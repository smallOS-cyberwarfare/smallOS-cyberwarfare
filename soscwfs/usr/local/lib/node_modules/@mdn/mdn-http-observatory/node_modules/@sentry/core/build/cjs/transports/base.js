Object.defineProperty(exports, '__esModule', { value: true });

const debugBuild = require('../debug-build.js');
const envelope = require('../utils-hoist/envelope.js');
const error = require('../utils-hoist/error.js');
const logger = require('../utils-hoist/logger.js');
const promisebuffer = require('../utils-hoist/promisebuffer.js');
const ratelimit = require('../utils-hoist/ratelimit.js');
const syncpromise = require('../utils-hoist/syncpromise.js');

const DEFAULT_TRANSPORT_BUFFER_SIZE = 64;

/**
 * Creates an instance of a Sentry `Transport`
 *
 * @param options
 * @param makeRequest
 */
function createTransport(
  options,
  makeRequest,
  buffer = promisebuffer.makePromiseBuffer(
    options.bufferSize || DEFAULT_TRANSPORT_BUFFER_SIZE,
  ),
) {
  let rateLimits = {};
  const flush = (timeout) => buffer.drain(timeout);

  function send(envelope$1) {
    const filteredEnvelopeItems = [];

    // Drop rate limited items from envelope
    envelope.forEachEnvelopeItem(envelope$1, (item, type) => {
      const dataCategory = envelope.envelopeItemTypeToDataCategory(type);
      if (ratelimit.isRateLimited(rateLimits, dataCategory)) {
        const event = getEventForEnvelopeItem(item, type);
        options.recordDroppedEvent('ratelimit_backoff', dataCategory, event);
      } else {
        filteredEnvelopeItems.push(item);
      }
    });

    // Skip sending if envelope is empty after filtering out rate limited events
    if (filteredEnvelopeItems.length === 0) {
      return syncpromise.resolvedSyncPromise({});
    }

    const filteredEnvelope = envelope.createEnvelope(envelope$1[0], filteredEnvelopeItems );

    // Creates client report for each item in an envelope
    const recordEnvelopeLoss = (reason) => {
      envelope.forEachEnvelopeItem(filteredEnvelope, (item, type) => {
        const event = getEventForEnvelopeItem(item, type);
        options.recordDroppedEvent(reason, envelope.envelopeItemTypeToDataCategory(type), event);
      });
    };

    const requestTask = () =>
      makeRequest({ body: envelope.serializeEnvelope(filteredEnvelope) }).then(
        response => {
          // We don't want to throw on NOK responses, but we want to at least log them
          if (response.statusCode !== undefined && (response.statusCode < 200 || response.statusCode >= 300)) {
            debugBuild.DEBUG_BUILD && logger.logger.warn(`Sentry responded with status code ${response.statusCode} to sent event.`);
          }

          rateLimits = ratelimit.updateRateLimits(rateLimits, response);
          return response;
        },
        error => {
          recordEnvelopeLoss('network_error');
          throw error;
        },
      );

    return buffer.add(requestTask).then(
      result => result,
      error$1 => {
        if (error$1 instanceof error.SentryError) {
          debugBuild.DEBUG_BUILD && logger.logger.error('Skipped sending event because buffer is full.');
          recordEnvelopeLoss('queue_overflow');
          return syncpromise.resolvedSyncPromise({});
        } else {
          throw error$1;
        }
      },
    );
  }

  return {
    send,
    flush,
  };
}

function getEventForEnvelopeItem(item, type) {
  if (type !== 'event' && type !== 'transaction') {
    return undefined;
  }

  return Array.isArray(item) ? (item )[1] : undefined;
}

exports.DEFAULT_TRANSPORT_BUFFER_SIZE = DEFAULT_TRANSPORT_BUFFER_SIZE;
exports.createTransport = createTransport;
//# sourceMappingURL=base.js.map
