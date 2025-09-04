Object.defineProperty(exports, '__esModule', { value: true });

const dsn = require('../utils-hoist/dsn.js');
const envelope = require('../utils-hoist/envelope.js');
const logger = require('../utils-hoist/logger.js');
const utils = require('./utils.js');

/**
 * Captures aggregated metrics to the supplied client.
 */
function captureAggregateMetrics(client, metricBucketItems) {
  logger.logger.log(`Flushing aggregated metrics, number of metrics: ${metricBucketItems.length}`);
  const dsn = client.getDsn();
  const metadata = client.getSdkMetadata();
  const tunnel = client.getOptions().tunnel;

  const metricsEnvelope = createMetricEnvelope(metricBucketItems, dsn, metadata, tunnel);

  // sendEnvelope should not throw
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  client.sendEnvelope(metricsEnvelope);
}

/**
 * Create envelope from a metric aggregate.
 */
function createMetricEnvelope(
  metricBucketItems,
  dsn$1,
  metadata,
  tunnel,
) {
  const headers = {
    sent_at: new Date().toISOString(),
  };

  if (metadata && metadata.sdk) {
    headers.sdk = {
      name: metadata.sdk.name,
      version: metadata.sdk.version,
    };
  }

  if (!!tunnel && dsn$1) {
    headers.dsn = dsn.dsnToString(dsn$1);
  }

  const item = createMetricEnvelopeItem(metricBucketItems);
  return envelope.createEnvelope(headers, [item]);
}

function createMetricEnvelopeItem(metricBucketItems) {
  const payload = utils.serializeMetricBuckets(metricBucketItems);
  const metricHeaders = {
    type: 'statsd',
    length: payload.length,
  };
  return [metricHeaders, payload];
}

exports.captureAggregateMetrics = captureAggregateMetrics;
exports.createMetricEnvelope = createMetricEnvelope;
//# sourceMappingURL=envelope.js.map
