import { SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN, SEMANTIC_ATTRIBUTE_SENTRY_OP } from './semanticAttributes.js';
import './tracing/errors.js';
import { isInstanceOf } from './utils-hoist/is.js';
import './utils-hoist/debug-build.js';
import './utils-hoist/logger.js';
import './utils-hoist/time.js';
import './utils-hoist/syncpromise.js';
import { parseUrl } from './utils-hoist/url.js';
import { SENTRY_BAGGAGE_KEY_PREFIX } from './utils-hoist/baggage.js';
import './debug-build.js';
import { hasTracingEnabled } from './utils/hasTracingEnabled.js';
import { getActiveSpan } from './utils/spanUtils.js';
import { SentryNonRecordingSpan } from './tracing/sentryNonRecordingSpan.js';
import { setHttpStatus, SPAN_STATUS_ERROR } from './tracing/spanstatus.js';
import { startInactiveSpan } from './tracing/trace.js';
import { getTraceData } from './utils/traceData.js';

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

  const shouldCreateSpanResult = hasTracingEnabled() && shouldCreateSpan(handlerData.fetchData.url);

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

  const { method, url } = handlerData.fetchData;

  const fullUrl = getFullURL(url);
  const host = fullUrl ? parseUrl(fullUrl).host : undefined;

  const hasParent = !!getActiveSpan();

  const span =
    shouldCreateSpanResult && hasParent
      ? startInactiveSpan({
          name: `${method} ${url}`,
          attributes: {
            url,
            type: 'fetch',
            'http.method': method,
            'http.url': fullUrl,
            'server.address': host,
            [SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: spanOrigin,
            [SEMANTIC_ATTRIBUTE_SENTRY_OP]: 'http.client',
          },
        })
      : new SentryNonRecordingSpan();

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
      hasTracingEnabled() && hasParent ? span : undefined,
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
  const traceHeaders = getTraceData({ span });
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
    setHttpStatus(span, handlerData.response.status);

    const contentLength =
      handlerData.response && handlerData.response.headers && handlerData.response.headers.get('content-length');

    if (contentLength) {
      const contentLengthNum = parseInt(contentLength);
      if (contentLengthNum > 0) {
        span.setAttribute('http.response_content_length', contentLengthNum);
      }
    }
  } else if (handlerData.error) {
    span.setStatus({ code: SPAN_STATUS_ERROR, message: 'internal_error' });
  }
  span.end();
}

function stripBaggageHeaderOfSentryBaggageValues(baggageHeader) {
  return (
    baggageHeader
      .split(',')
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      .filter(baggageEntry => !baggageEntry.split('=')[0].startsWith(SENTRY_BAGGAGE_KEY_PREFIX))
      .join(',')
  );
}

function isRequest(request) {
  return typeof Request !== 'undefined' && isInstanceOf(request, Request);
}

function isHeaders(headers) {
  return typeof Headers !== 'undefined' && isInstanceOf(headers, Headers);
}

export { addTracingHeadersToFetchRequest, instrumentFetchRequest };
//# sourceMappingURL=fetch.js.map
