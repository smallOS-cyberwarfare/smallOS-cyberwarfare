import { _optionalChain } from '@sentry/core';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { UndiciInstrumentation } from '@opentelemetry/instrumentation-undici';
import { defineIntegration, LRUMap, hasTracingEnabled, getTraceData, SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN, getBreadcrumbLogLevelFromHttpStatusCode, addBreadcrumb, parseUrl, getSanitizedUrlString, getClient } from '@sentry/core';
import { shouldPropagateTraceForUrl } from '@sentry/opentelemetry';

const _nativeNodeFetchIntegration = ((options = {}) => {
  const _breadcrumbs = typeof options.breadcrumbs === 'undefined' ? true : options.breadcrumbs;
  const _ignoreOutgoingRequests = options.ignoreOutgoingRequests;

  return {
    name: 'NodeFetch',
    setupOnce() {
      const propagationDecisionMap = new LRUMap(100);

      const instrumentation = new UndiciInstrumentation({
        requireParentforSpans: false,
        ignoreRequestHook: request => {
          const url = getAbsoluteUrl(request.origin, request.path);
          const shouldIgnore = _ignoreOutgoingRequests && url && _ignoreOutgoingRequests(url);

          if (shouldIgnore) {
            return true;
          }

          // If tracing is disabled, we still want to propagate traces
          // So we do that manually here, matching what the instrumentation does otherwise
          if (!hasTracingEnabled()) {
            const tracePropagationTargets = _optionalChain([getClient, 'call', _2 => _2(), 'optionalAccess', _3 => _3.getOptions, 'call', _4 => _4(), 'access', _5 => _5.tracePropagationTargets]);
            const addedHeaders = shouldPropagateTraceForUrl(url, tracePropagationTargets, propagationDecisionMap)
              ? getTraceData()
              : {};

            const requestHeaders = request.headers;
            if (Array.isArray(requestHeaders)) {
              Object.entries(addedHeaders).forEach(headers => requestHeaders.push(...headers));
            } else {
              request.headers += Object.entries(addedHeaders)
                .map(([k, v]) => `${k}: ${v}\r\n`)
                .join('');
            }

            // Prevent starting a span for this request
            return true;
          }

          return false;
        },
        startSpanHook: () => {
          return {
            [SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: 'auto.http.otel.node_fetch',
          };
        },
        responseHook: (_, { request, response }) => {
          if (_breadcrumbs) {
            addRequestBreadcrumb(request, response);
          }
        },
      });

      registerInstrumentations({ instrumentations: [instrumentation] });
    },
  };
}) ;

const nativeNodeFetchIntegration = defineIntegration(_nativeNodeFetchIntegration);

/** Add a breadcrumb for outgoing requests. */
function addRequestBreadcrumb(request, response) {
  const data = getBreadcrumbData(request);
  const statusCode = response.statusCode;
  const level = getBreadcrumbLogLevelFromHttpStatusCode(statusCode);

  addBreadcrumb(
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
    const url = new URL(request.path, request.origin);
    const parsedUrl = parseUrl(url.toString());

    const data = {
      url: getSanitizedUrlString(parsedUrl),
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

// Matching the behavior of the base instrumentation
function getAbsoluteUrl(origin, path = '/') {
  const url = `${origin}`;

  if (url.endsWith('/') && path.startsWith('/')) {
    return `${url}${path.slice(1)}`;
  }

  if (!url.endsWith('/') && !path.startsWith('/')) {
    return `${url}/${path.slice(1)}`;
  }

  return `${url}${path}`;
}

export { nativeNodeFetchIntegration };
//# sourceMappingURL=node-fetch.js.map
