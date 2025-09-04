Object.defineProperty(exports, '__esModule', { value: true });

const core = require('@opentelemetry/core');
const instrumentation = require('@opentelemetry/instrumentation');
const core$1 = require('@sentry/core');
const debugBuild = require('../../debug-build.js');
const getRequestUrl = require('../../utils/getRequestUrl.js');
const getRequestInfo = require('./vendor/getRequestInfo.js');

// We only want to capture request bodies up to 1mb.
const MAX_BODY_BYTE_LENGTH = 1024 * 1024;

/**
 * This custom HTTP instrumentation is used to isolate incoming requests and annotate them with additional information.
 * It does not emit any spans.
 *
 * The reason this is isolated from the OpenTelemetry instrumentation is that users may overwrite this,
 * which would lead to Sentry not working as expected.
 *
 * Important note: Contrary to other OTEL instrumentation, this one cannot be unwrapped.
 * It only does minimal things though and does not emit any spans.
 *
 * This is heavily inspired & adapted from:
 * https://github.com/open-telemetry/opentelemetry-js/blob/f8ab5592ddea5cba0a3b33bf8d74f27872c0367f/experimental/packages/opentelemetry-instrumentation-http/src/http.ts
 */
class SentryHttpInstrumentation extends instrumentation.InstrumentationBase {
   constructor(config = {}) {
    super('@sentry/instrumentation-http', core.VERSION, config);
  }

  /** @inheritdoc */
   init() {
    return [this._getHttpsInstrumentation(), this._getHttpInstrumentation()];
  }

  /** Get the instrumentation for the http module. */
   _getHttpInstrumentation() {
    return new instrumentation.InstrumentationNodeModuleDefinition(
      'http',
      ['*'],
      (moduleExports) => {
        // Patch incoming requests for request isolation
        stealthWrap(moduleExports.Server.prototype, 'emit', this._getPatchIncomingRequestFunction());

        // Patch outgoing requests for breadcrumbs
        const patchedRequest = stealthWrap(moduleExports, 'request', this._getPatchOutgoingRequestFunction());
        stealthWrap(moduleExports, 'get', this._getPatchOutgoingGetFunction(patchedRequest));

        return moduleExports;
      },
      () => {
        // no unwrap here
      },
    );
  }

  /** Get the instrumentation for the https module. */
   _getHttpsInstrumentation() {
    return new instrumentation.InstrumentationNodeModuleDefinition(
      'https',
      ['*'],
      (moduleExports) => {
        // Patch incoming requests for request isolation
        stealthWrap(moduleExports.Server.prototype, 'emit', this._getPatchIncomingRequestFunction());

        // Patch outgoing requests for breadcrumbs
        const patchedRequest = stealthWrap(moduleExports, 'request', this._getPatchOutgoingRequestFunction());
        stealthWrap(moduleExports, 'get', this._getPatchOutgoingGetFunction(patchedRequest));

        return moduleExports;
      },
      () => {
        // no unwrap here
      },
    );
  }

  /**
   * Patch the incoming request function for request isolation.
   */
   _getPatchIncomingRequestFunction()

 {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const instrumentation = this;

    return (
      original,
    ) => {
      return function incomingRequest( event, ...args) {
        // Only traces request events
        if (event !== 'request') {
          return original.apply(this, [event, ...args]);
        }

        instrumentation._diag.debug('http instrumentation for incoming request');

        const isolationScope = core$1.getIsolationScope().clone();
        const request = args[0] ;

        const normalizedRequest = core$1.httpRequestToRequestData(request);

        patchRequestToCaptureBody(request, isolationScope);

        // Update the isolation scope, isolate this request
        // TODO(v9): Stop setting `request`, we only rely on normalizedRequest anymore
        isolationScope.setSDKProcessingMetadata({
          request,
          normalizedRequest,
        });

        const client = core$1.getClient();
        // eslint-disable-next-line deprecation/deprecation
        if (client && client.getOptions().autoSessionTracking) {
          // eslint-disable-next-line deprecation/deprecation
          isolationScope.setRequestSession({ status: 'ok' });
        }

        // attempt to update the scope's `transactionName` based on the request URL
        // Ideally, framework instrumentations coming after the HttpInstrumentation
        // update the transactionName once we get a parameterized route.
        const httpMethod = (request.method || 'GET').toUpperCase();
        const httpTarget = core$1.stripUrlQueryAndFragment(request.url || '/');

        const bestEffortTransactionName = `${httpMethod} ${httpTarget}`;

        isolationScope.setTransactionName(bestEffortTransactionName);

        return core$1.withIsolationScope(isolationScope, () => {
          return original.apply(this, [event, ...args]);
        });
      };
    };
  }

  /**
   * Patch the outgoing request function for breadcrumbs.
   */
   _getPatchOutgoingRequestFunction()

 {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const instrumentation = this;

    return (original) => {
      return function outgoingRequest( ...args) {
        instrumentation._diag.debug('http instrumentation for outgoing requests');

        // Making a copy to avoid mutating the original args array
        // We need to access and reconstruct the request options object passed to `ignoreOutgoingRequests`
        // so that it matches what Otel instrumentation passes to `ignoreOutgoingRequestHook`.
        // @see https://github.com/open-telemetry/opentelemetry-js/blob/7293e69c1e55ca62e15d0724d22605e61bd58952/experimental/packages/opentelemetry-instrumentation-http/src/http.ts#L756-L789
        const argsCopy = [...args];

        const options = argsCopy.shift() ;

        const extraOptions =
          typeof argsCopy[0] === 'object' && (typeof options === 'string' || options instanceof URL)
            ? (argsCopy.shift() )
            : undefined;

        const { optionsParsed } = getRequestInfo.getRequestInfo(instrumentation._diag, options, extraOptions);

        const request = original.apply(this, args) ;

        request.prependListener('response', (response) => {
          const _breadcrumbs = instrumentation.getConfig().breadcrumbs;
          const breadCrumbsEnabled = typeof _breadcrumbs === 'undefined' ? true : _breadcrumbs;

          const _ignoreOutgoingRequests = instrumentation.getConfig().ignoreOutgoingRequests;
          const shouldCreateBreadcrumb =
            typeof _ignoreOutgoingRequests === 'function'
              ? !_ignoreOutgoingRequests(getRequestUrl.getRequestUrl(request), optionsParsed)
              : true;

          if (breadCrumbsEnabled && shouldCreateBreadcrumb) {
            addRequestBreadcrumb(request, response);
          }
        });

        return request;
      };
    };
  }

  /** Path the outgoing get function for breadcrumbs. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
   _getPatchOutgoingGetFunction(clientRequest) {
    return (_original) => {
      // Re-implement http.get. This needs to be done (instead of using
      // getPatchOutgoingRequestFunction to patch it) because we need to
      // set the trace context header before the returned http.ClientRequest is
      // ended. The Node.js docs state that the only differences between
      // request and get are that (1) get defaults to the HTTP GET method and
      // (2) the returned request object is ended immediately. The former is
      // already true (at least in supported Node versions up to v10), so we
      // simply follow the latter. Ref:
      // https://nodejs.org/dist/latest/docs/api/http.html#http_http_get_options_callback
      // https://github.com/googleapis/cloud-trace-nodejs/blob/master/src/instrumentations/instrumentation-http.ts#L198
      return function outgoingGetRequest(...args) {
        const req = clientRequest(...args);
        req.end();
        return req;
      };
    };
  }
}

/**
 * This is a minimal version of `wrap` from shimmer:
 * https://github.com/othiym23/shimmer/blob/master/index.js
 *
 * In contrast to the original implementation, this version does not allow to unwrap,
 * and does not make it clear that the method is wrapped.
 * This is necessary because we want to wrap the http module with our own code,
 * while still allowing to use the HttpInstrumentation from OTEL.
 *
 * Without this, if we'd just use `wrap` from shimmer, the OTEL instrumentation would remove our wrapping,
 * because it only allows any module to be wrapped a single time.
 */
function stealthWrap(
  nodule,
  name,
  wrapper,
) {
  const original = nodule[name];
  const wrapped = wrapper(original);

  defineProperty(nodule, name, wrapped);
  return wrapped;
}

// Sets a property on an object, preserving its enumerability.
function defineProperty(
  obj,
  name,
  value,
) {
  const enumerable = !!obj[name] && Object.prototype.propertyIsEnumerable.call(obj, name);

  Object.defineProperty(obj, name, {
    configurable: true,
    enumerable: enumerable,
    writable: true,
    value: value,
  });
}

/** Add a breadcrumb for outgoing requests. */
function addRequestBreadcrumb(request, response) {
  const data = getBreadcrumbData(request);

  const statusCode = response.statusCode;
  const level = core$1.getBreadcrumbLogLevelFromHttpStatusCode(statusCode);

  core$1.addBreadcrumb(
    {
      category: 'http',
      data: {
        status_code: statusCode,
        ...data,
      },
      type: 'http',
      level,
    },
    {
      event: 'response',
      request,
      response,
    },
  );
}

function getBreadcrumbData(request) {
  try {
    // `request.host` does not contain the port, but the host header does
    const host = request.getHeader('host') || request.host;
    const url = new URL(request.path, `${request.protocol}//${host}`);
    const parsedUrl = core$1.parseUrl(url.toString());

    const data = {
      url: core$1.getSanitizedUrlString(parsedUrl),
      'http.method': request.method || 'GET',
    };

    if (parsedUrl.search) {
      data['http.query'] = parsedUrl.search;
    }
    if (parsedUrl.hash) {
      data['http.fragment'] = parsedUrl.hash;
    }

    return data;
  } catch (e) {
    return {};
  }
}

/**
 * This method patches the request object to capture the body.
 * Instead of actually consuming the streamed body ourselves, which has potential side effects,
 * we monkey patch `req.on('data')` to intercept the body chunks.
 * This way, we only read the body if the user also consumes the body, ensuring we do not change any behavior in unexpected ways.
 */
function patchRequestToCaptureBody(req, isolationScope) {
  const chunks = [];

  function getChunksSize() {
    return chunks.reduce((acc, chunk) => acc + chunk.byteLength, 0);
  }

  /**
   * We need to keep track of the original callbacks, in order to be able to remove listeners again.
   * Since `off` depends on having the exact same function reference passed in, we need to be able to map
   * original listeners to our wrapped ones.
   */
  const callbackMap = new WeakMap();

  try {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    req.on = new Proxy(req.on, {
      apply: (target, thisArg, args) => {
        const [event, listener, ...restArgs] = args;

        if (event === 'data') {
          const callback = new Proxy(listener, {
            apply: (target, thisArg, args) => {
              // If we have already read more than the max body length, we stop addiing chunks
              // To avoid growing the memory indefinitely if a respons is e.g. streamed
              if (getChunksSize() < MAX_BODY_BYTE_LENGTH) {
                const chunk = args[0] ;
                chunks.push(chunk);
              } else if (debugBuild.DEBUG_BUILD) {
                core$1.logger.log(
                  `Dropping request body chunk because it maximum body length of ${MAX_BODY_BYTE_LENGTH}b is exceeded.`,
                );
              }

              return Reflect.apply(target, thisArg, args);
            },
          });

          callbackMap.set(listener, callback);

          return Reflect.apply(target, thisArg, [event, callback, ...restArgs]);
        }

        if (event === 'end') {
          const callback = new Proxy(listener, {
            apply: (target, thisArg, args) => {
              try {
                const body = Buffer.concat(chunks).toString('utf-8');

                if (body) {
                  const normalizedRequest = { data: body } ;
                  isolationScope.setSDKProcessingMetadata({ normalizedRequest });
                }
              } catch (e2) {
                // ignore errors here
              }

              return Reflect.apply(target, thisArg, args);
            },
          });

          callbackMap.set(listener, callback);

          return Reflect.apply(target, thisArg, [event, callback, ...restArgs]);
        }

        return Reflect.apply(target, thisArg, args);
      },
    });

    // Ensure we also remove callbacks correctly
    // eslint-disable-next-line @typescript-eslint/unbound-method
    req.off = new Proxy(req.off, {
      apply: (target, thisArg, args) => {
        const [, listener] = args;

        const callback = callbackMap.get(listener);
        if (callback) {
          callbackMap.delete(listener);

          const modifiedArgs = args.slice();
          modifiedArgs[1] = callback;
          return Reflect.apply(target, thisArg, modifiedArgs);
        }

        return Reflect.apply(target, thisArg, args);
      },
    });
  } catch (e3) {
    // ignore errors if we can't patch stuff
  }
}

exports.SentryHttpInstrumentation = SentryHttpInstrumentation;
//# sourceMappingURL=SentryHttpInstrumentation.js.map
