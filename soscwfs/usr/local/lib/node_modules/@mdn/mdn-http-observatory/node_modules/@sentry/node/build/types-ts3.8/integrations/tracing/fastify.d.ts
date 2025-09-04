interface Fastify {
    register: (plugin: any) => void;
    addHook: (hook: string, handler: (request: any, reply: any, error: Error) => void) => void;
}
export declare const instrumentFastify: ((options?: unknown) => void) & {
    id: string;
};
/**
 * Adds Sentry tracing instrumentation for [Fastify](https://fastify.dev/).
 *
 * If you also want to capture errors, you need to call `setupFastifyErrorHandler(app)` after you set up your Fastify server.
 *
 * For more information, see the [fastify documentation](https://docs.sentry.io/platforms/javascript/guides/fastify/).
 *
 * @example
 * ```javascript
 * const Sentry = require('@sentry/node');
 *
 * Sentry.init({
 *   integrations: [Sentry.fastifyIntegration()],
 * })
 * ```
 */
export declare const fastifyIntegration: () => import("@sentry/core").Integration;
/**
 * Add an Fastify error handler to capture errors to Sentry.
 *
 * @param fastify The Fastify instance to which to add the error handler
 *
 * @example
 * ```javascript
 * const Sentry = require('@sentry/node');
 * const Fastify = require("fastify");
 *
 * const app = Fastify();
 *
 * Sentry.setupFastifyErrorHandler(app);
 *
 * // Add your routes, etc.
 *
 * app.listen({ port: 3000 });
 * ```
 */
export declare function setupFastifyErrorHandler(fastify: Fastify): void;
export {};
//# sourceMappingURL=fastify.d.ts.map
