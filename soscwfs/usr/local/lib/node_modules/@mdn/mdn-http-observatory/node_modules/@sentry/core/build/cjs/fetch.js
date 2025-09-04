Object.defineProperty(exports, '__esModule', { value: true });

const semanticAttributes = require('./semanticAttributes.js');
require('./tracing/errors.js');
const is = require('./utils-hoist/is.js');
require('./utils-hoist/debug-build.js');
require('./utils-hoist/logger.js');
require('./utils-hoist/time.js');
require('./utils-hoist/syncpromise.js');
const url = require('./utils-hoist/url.js');
const baggage = require('./utils-hoist/baggage.js');
require('./debug-build.js');
const hasTracingEnabled = require('./utils/hasTracingEnabled.js');
const spanUtils = require('./utils/spanUtils.js');
const sentryNonRecordingSpan = require('./tracing/sentryNonRecordingSpan.js');
const spanstatus = require('./tracing/spanstatus.js');
const trace = require('./tracing/trace.js');
const traceData = require('./utils/traceData.js');

/**
 * Create and track fetch request spans for usage in combination with `addFetchInstrumentationHandler`.
 *
 * @returns Span if a span was created, otherwise void.
 */
function instrumentFetchRequest(
  handlerData,
  shouldCreateSpan,
  shouldAttachHeaders,
  spans,
  spanOrigin = 'auto.http.browser',
) {
  if (!handlerData.fetchData) {
    return undefined;
  }

  const shouldCreateSpanResult = hasTracingEnabled.hasTracingEnabled() && shouldCreateSpan(handlerData.fetchData.url);

  if (handlerData.endTimestamp && shouldCreateSpanResult) {
    const spanId = handlerData.fetchData.__span;
    if (!spanId) return;

    const span = spans[spanId];
    if (span) {
      endSpan(span, handlerData);

      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete spans[spanId];
    }
    return undefined;
  }

  const { method, url: url$1 } = handlerData.fetchData;

  const fullUrl = getFullURL(url$1);
  const host = fullUrl ? url.parseUrl(fullUrl).host : undefined;

  const hasParent = !!spanUtils.getActiveSpan();

  const span =
    shouldCreateSpanResult && hasParent
      ? trace.startInactiveSpan({
          name: `${method} ${url$1}`,
          attributes: {
            url: url$1,
            type: 'fetch',
            'http.method': method,
            'http.url': fullUrl,
            'server.address': host,
            [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: spanOrigin,
            [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_OP]: 'http.client',
          },
        })
      : new sentryNonRecordingSpan.SentryNonRecordingSpan();

  handlerData.fetchData.__span = span.spanContext().spanId;
  spans[span.spanContext().spanId] = span;

  if (shouldAttachHeaders(handlerData.fetchData.url)) {
    const request = handlerData.args[0];

    const options = handlerData.args[1] || {};

    const headers = _addTracingHeadersToFetchRequest(
      request,
      options,
      // If performance is disabled (TWP) or there's no active root span (pageload/navigation/interaction),
      // we do not want to use the span as base for the trace headers,
      // which means that the headers will be generated from the scope and the sampling decision is deferred
      hasTracingEnabled.hasTracingEnabled() && hasParent ? span : undefined,
    );
    if (headers) {
      // Ensure this is actually set, if no options have been passed previously
      handlerData.args[1] = options;
      options.headers = headers;
    }
  }

  return span;
}

/**
 * Adds sentry-trace and baggage headers to the various forms of fetch headers.
 */
function _addTracingHeadersToFetchRequest(
  request,
  fetchOptionsObj

,
  span,
) {
  const traceHeaders = traceData.getTraceData({ span });
  const sentryTrace = traceHeaders['sentry-trace'];
  const baggage = traceHeaders.baggage;

  // Nothing to do, when we return undefined here, the original headers will be used
  if (!sentryTrace) {
    return undefined;
  }

  const headers = fetchOptionsObj.headers || (isRequest(request) ? request.headers : undefined);

  if (!headers) {
    return { ...traceHeaders };
  } else if (isHeaders(headers)) {
    const newHeaders = new Headers(headers);
    newHeaders.set('sentry-trace', sentryTrace);

    if (baggage) {
      const prevBaggageHeader = newHeaders.get('baggage');
      if (prevBaggageHeader) {
        const prevHeaderStrippedFromSentryBaggage = stripBaggageHeaderOfSentryBaggageValues(prevBaggageHeader);
        newHeaders.set(
          'baggage',
          // If there are non-sentry entries (i.e. if the stripped string is non-empty/truthy) combine the stripped header and sentry baggage header
          // otherwise just set the sentry baggage header
          prevHeaderStrippedFromSentryBaggage ? `${prevHeaderStrippedFromSentryBaggage},${baggage}` : baggage,
        );
      } else {
        newHeaders.set('baggage', baggage);
      }
    }

    return newHeaders;
  } else if (Array.isArray(headers)) {
    const newHeaders = [
      ...headers
        // Remove any existing sentry-trace headers
        .filter(header => {
          return !(Array.isArray(header) && header[0] === 'sentry-trace');
        })
        // Get rid of previous sentry baggage values in baggage header
        .map(header => {
          if (Array.isArray(header) && header[0] === 'baggage' && typeof header[1] === 'string') {
            const [headerName, headerValue, ...rest] = header;
            return [headerName, stripBaggageHeaderOfSentryBaggageValues(headerValue), ...rest];
          } else {
            return header;
          }
        }),
      // Attach the new sentry-trace header
      ['sentry-trace', sentryTrace],
    ];

    if (baggage) {
      // If there are multiple entries with the same key, the browser will merge the values into a single request header.
      // Its therefore safe to simply push a "baggage" entry, even though there might already be another baggage header.
      newHeaders.push(['baggage', baggage]);
    }

    return newHeaders ;
  } else {
    const existingBaggageHeader = 'baggage' in headers ? headers.baggage : undefined;
    let newBaggageHeaders = [];

    if (Array.isArray(existingBaggageHeader)) {
      newBaggageHeaders = existingBaggageHeader
        .map(headerItem =>
          typeof headerItem === 'string' ? stripBaggageHeaderOfSentryBaggageValues(headerItem) : headerItem,
        )
        .filter(headerItem => headerItem === '');
    } else if (existingBaggageHeader) {
      newBaggageHeaders.push(stripBaggageHeaderOfSentryBaggageValues(existingBaggageHeader));
    }

    if (baggage) {
      newBaggageHeaders.push(baggage);
    }

    return {
      ...(headers ),
      'sentry-trace': sentryTrace,
      baggage: newBaggageHeaders.length > 0 ? newBaggageHeaders.join(',') : undefined,
    };
  }
}

/**
 * Adds sentry-trace and baggage headers to the various forms of fetch headers.
 *
 * @deprecated This function will not be exported anymore in v9.
 */
function addTracingHeadersToFetchRequest(
  request,
  _client,
  _scope,
  fetchOptionsObj

,
  span,
) {
  return _addTracingHeadersToFetchRequest(request , fetchOptionsObj, span);
}

function getFullURL(url) {
  try {
    const parsed = new URL(url);
    return parsed.href;
  } catch (e) {
    return undefined;
  }
}

function endSpan(span, handlerData) {
  if (handlerData.response) {
    spanstatus.setHttpStatus(span, handlerData.response.status);

    const contentLength =
      handlerData.response && handlerData.response.headers && handlerData.response.headers.get('content-length');

    if (contentLength) {
      const contentLengthNum = parseInt(contentLength);
      if (contentLengthNum > 0) {
        span.setAttribute('http.response_content_length', contentLengthNum);
      }
    }
  } else if (handlerData.error) {
    span.setStatus({ code: spanstatus.SPAN_STATUS_ERROR, message: 'internal_error' });
  }
  span.end();
}

function stripBaggageHeaderOfSentryBaggageValues(baggageHeader) {
  return (
    baggageHeader
      .split(',')
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      .filter(baggageEntry => !baggageEntry.split('=')[0].startsWith(baggage.SENTRY_BAGGAGE_KEY_PREFIX))
      .join(',')
  );
}

function isRequest(request) {
  return typeof Request !== 'undefined' && is.isInstanceOf(request, Request);
}

function isHeaders(headers) {
  return typeof Headers !== 'undefined' && is.isInstanceOf(headers, Headers);
}

exports.addTracingHeadersToFetchRequest = addTracingHeadersToFetchRequest;
exports.instrumentFetchRequest = instrumentFetchRequest;
//# sourceMappingURL=fetch.js.map
