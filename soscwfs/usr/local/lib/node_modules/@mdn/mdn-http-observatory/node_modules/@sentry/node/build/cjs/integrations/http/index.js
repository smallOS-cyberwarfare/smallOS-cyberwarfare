var {
  _optionalChain
} = require('@sentry/core');

Object.defineProperty(exports, '__esModule', { value: true });

const api = require('@opentelemetry/api');
const instrumentationHttp = require('@opentelemetry/instrumentation-http');
const core = require('@sentry/core');
const opentelemetry = require('@sentry/opentelemetry');
const instrument = require('../../otel/instrument.js');
const addOriginToSpan = require('../../utils/addOriginToSpan.js');
const getRequestUrl = require('../../utils/getRequestUrl.js');
const SentryHttpInstrumentation = require('./SentryHttpInstrumentation.js');

const INTEGRATION_NAME = 'Http';

const INSTRUMENTATION_NAME = '@opentelemetry_sentry-patched/instrumentation-http';

const instrumentSentryHttp = instrument.generateInstrumentOnce

(`${INTEGRATION_NAME}.sentry`, options => {
  return new SentryHttpInstrumentation.SentryHttpInstrumentation({
    breadcrumbs: _optionalChain([options, 'optionalAccess', _ => _.breadcrumbs]),
    ignoreOutgoingRequests: _optionalChain([options, 'optionalAccess', _2 => _2.ignoreOutgoingRequests]),
  });
});

const instrumentOtelHttp = instrument.generateInstrumentOnce(INTEGRATION_NAME, config => {
  const instrumentation = new instrumentationHttp.HttpInstrumentation(config);

  // We want to update the logger namespace so we can better identify what is happening here
  try {
    instrumentation['_diag'] = api.diag.createComponentLogger({
      namespace: INSTRUMENTATION_NAME,
    });
    // @ts-expect-error We are writing a read-only property here...
    instrumentation.instrumentationName = INSTRUMENTATION_NAME;
  } catch (e) {
    // ignore errors here...
  }

  return instrumentation;
});

/**
 * Instrument the HTTP and HTTPS modules.
 */
const instrumentHttp = (options = {}) => {
  // This is the "regular" OTEL instrumentation that emits spans
  if (options.spans !== false) {
    const instrumentationConfig = getConfigWithDefaults(options);
    instrumentOtelHttp(instrumentationConfig);
  }

  // This is the Sentry-specific instrumentation that isolates requests & creates breadcrumbs
  // Note that this _has_ to be wrapped after the OTEL instrumentation,
  // otherwise the isolation will not work correctly
  instrumentSentryHttp(options);
};

/**
 * The http integration instruments Node's internal http and https modules.
 * It creates breadcrumbs and spans for outgoing HTTP requests which will be attached to the currently active span.
 */
const httpIntegration = core.defineIntegration((options = {}) => {
  return {
    name: INTEGRATION_NAME,
    setupOnce() {
      instrumentHttp(options);
    },
  };
});

/**
 * Determines if @param req is a ClientRequest, meaning the request was created within the express app
 * and it's an outgoing request.
 * Checking for properties instead of using `instanceOf` to avoid importing the request classes.
 */
function _isClientRequest(req) {
  return 'outputData' in req && 'outputSize' in req && !('client' in req) && !('statusCode' in req);
}

/**
 * Detects if an incoming request is a prefetch request.
 */
function isKnownPrefetchRequest(req) {
  // Currently only handles Next.js prefetch requests but may check other frameworks in the future.
  return req.headers['next-router-prefetch'] === '1';
}

function getConfigWithDefaults(options = {}) {
  const instrumentationConfig = {
    ..._optionalChain([options, 'access', _3 => _3.instrumentation, 'optionalAccess', _4 => _4._experimentalConfig]),

    disableIncomingRequestInstrumentation: options.disableIncomingRequestSpans,

    ignoreOutgoingRequestHook: request => {
      const url = getRequestUrl.getRequestUrl(request);

      if (!url) {
        return false;
      }

      const _ignoreOutgoingRequests = options.ignoreOutgoingRequests;
      if (_ignoreOutgoingRequests && _ignoreOutgoingRequests(url, request)) {
        return true;
      }

      return false;
    },

    ignoreIncomingRequestHook: request => {
      // request.url is the only property that holds any information about the url
      // it only consists of the URL path and query string (if any)
      const urlPath = request.url;

      const method = _optionalChain([request, 'access', _5 => _5.method, 'optionalAccess', _6 => _6.toUpperCase, 'call', _7 => _7()]);
      // We do not capture OPTIONS/HEAD requests as transactions
      if (method === 'OPTIONS' || method === 'HEAD') {
        return true;
      }

      const _ignoreIncomingRequests = options.ignoreIncomingRequests;
      if (urlPath && _ignoreIncomingRequests && _ignoreIncomingRequests(urlPath, request)) {
        return true;
      }

      return false;
    },

    requireParentforOutgoingSpans: false,
    requireParentforIncomingSpans: false,
    requestHook: (span, req) => {
      addOriginToSpan.addOriginToSpan(span, 'auto.http.otel.http');
      if (!_isClientRequest(req) && isKnownPrefetchRequest(req)) {
        span.setAttribute('sentry.http.prefetch', true);
      }

      _optionalChain([options, 'access', _8 => _8.instrumentation, 'optionalAccess', _9 => _9.requestHook, 'optionalCall', _10 => _10(span, req)]);
    },
    responseHook: (span, res) => {
      const client = opentelemetry.getClient();

      if (
        client &&
        // eslint-disable-next-line deprecation/deprecation
        client.getOptions().autoSessionTracking !== false &&
        options.trackIncomingRequestsAsSessions !== false
      ) {
        setImmediate(() => {
          client['_captureRequestSession']();
        });
      }

      _optionalChain([options, 'access', _11 => _11.instrumentation, 'optionalAccess', _12 => _12.responseHook, 'optionalCall', _13 => _13(span, res)]);
    },
    applyCustomAttributesOnSpan: (
      span,
      request,
      response,
    ) => {
      _optionalChain([options, 'access', _14 => _14.instrumentation, 'optionalAccess', _15 => _15.applyCustomAttributesOnSpan, 'optionalCall', _16 => _16(span, request, response)]);
    },
  } ;

  return instrumentationConfig;
}

exports.httpIntegration = httpIntegration;
exports.instrumentOtelHttp = instrumentOtelHttp;
exports.instrumentSentryHttp = instrumentSentryHttp;
//# sourceMappingURL=index.js.map
