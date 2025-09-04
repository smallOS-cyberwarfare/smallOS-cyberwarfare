Object.defineProperty(exports, '__esModule', { value: true });

const aggregator = require('./aggregator.js');
const exports$1 = require('./exports.js');

/**
 * Adds a value to a counter metric
 *
 * @deprecated The Sentry metrics beta has ended. This method will be removed in a future release.
 */
function increment(name, value = 1, data) {
  // eslint-disable-next-line deprecation/deprecation
  exports$1.metrics.increment(aggregator.MetricsAggregator, name, value, data);
}

/**
 * Adds a value to a distribution metric
 *
 * @deprecated The Sentry metrics beta has ended. This method will be removed in a future release.
 */
function distribution(name, value, data) {
  // eslint-disable-next-line deprecation/deprecation
  exports$1.metrics.distribution(aggregator.MetricsAggregator, name, value, data);
}

/**
 * Adds a value to a set metric. Value must be a string or integer.
 *
 * @deprecated The Sentry metrics beta has ended. This method will be removed in a future release.
 */
function set(name, value, data) {
  // eslint-disable-next-line deprecation/deprecation
  exports$1.metrics.set(aggregator.MetricsAggregator, name, value, data);
}

/**
 * Adds a value to a gauge metric
 *
 * @deprecated The Sentry metrics beta has ended. This method will be removed in a future release.
 */
function gauge(name, value, data) {
  // eslint-disable-next-line deprecation/deprecation
  exports$1.metrics.gauge(aggregator.MetricsAggregator, name, value, data);
}

/**
 * Adds a timing metric.
 * The metric is added as a distribution metric.
 *
 * You can either directly capture a numeric `value`, or wrap a callback function in `timing`.
 * In the latter case, the duration of the callback execution will be captured as a span & a metric.
 *
 * @deprecated The Sentry metrics beta has ended. This method will be removed in a future release.
 */

function timing(
  name,
  value,
  unit = 'second',
  data,
) {
  // eslint-disable-next-line deprecation/deprecation
  return exports$1.metrics.timing(aggregator.MetricsAggregator, name, value, unit, data);
}

/**
 * Returns the metrics aggregator for a given client.
 */
function getMetricsAggregatorForClient(client) {
  // eslint-disable-next-line deprecation/deprecation
  return exports$1.metrics.getMetricsAggregatorForClient(client, aggregator.MetricsAggregator);
}

/**
 * The metrics API is used to capture custom metrics in Sentry.
 *
 * @deprecated The Sentry metrics beta has ended. This export will be removed in a future release.
 */
const metricsDefault

 = {
  increment,
  distribution,
  set,
  gauge,
  timing,
  /**
   * @ignore This is for internal use only.
   */
  getMetricsAggregatorForClient,
};

exports.metricsDefault = metricsDefault;
//# sourceMappingURL=exports-default.js.map
