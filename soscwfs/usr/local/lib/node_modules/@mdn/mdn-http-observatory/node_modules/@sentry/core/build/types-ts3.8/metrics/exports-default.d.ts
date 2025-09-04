import { Client, Metrics, MetricsAggregator as MetricsAggregatorInterface } from '../types-hoist';
/**
 * Returns the metrics aggregator for a given client.
 */
declare function getMetricsAggregatorForClient(client: Client): MetricsAggregatorInterface;
/**
 * The metrics API is used to capture custom metrics in Sentry.
 *
 * @deprecated The Sentry metrics beta has ended. This export will be removed in a future release.
 */
export declare const metricsDefault: Metrics & {
    getMetricsAggregatorForClient: typeof getMetricsAggregatorForClient;
};
export {};
//# sourceMappingURL=exports-default.d.ts.map
