export declare const instrumentMysql2: ((options?: unknown) => void) & {
    id: string;
};
/**
 * Adds Sentry tracing instrumentation for the [mysql2](https://www.npmjs.com/package/mysql2) library.
 *
 * For more information, see the [`mysql2Integration` documentation](https://docs.sentry.io/platforms/javascript/guides/node/configuration/integrations/mysql2/).
 *
 * @example
 * ```javascript
 * const Sentry = require('@sentry/node');
 *
 * Sentry.init({
 *  integrations: [Sentry.mysqlIntegration()],
 * });
 * ```
 */
export declare const mysql2Integration: () => import("@sentry/core").Integration;
//# sourceMappingURL=mysql2.d.ts.map
