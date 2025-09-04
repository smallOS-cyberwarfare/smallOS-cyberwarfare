import { _optionalChain } from '@sentry/core';
import { FastifyInstrumentation } from '@opentelemetry/instrumentation-fastify';
import { defineIntegration, captureException, getIsolationScope, getClient, spanToJSON, SEMANTIC_ATTRIBUTE_SENTRY_OP, SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN } from '@sentry/core';
import { generateInstrumentOnce } from '../../otel/instrument.js';
import { ensureIsWrapped } from '../../utils/ensureIsWrapped.js';

// We inline the types we care about here

const INTEGRATION_NAME = 'Fastify';

const instrumentFastify = generateInstrumentOnce(
  INTEGRATION_NAME,
  () =>
    new FastifyInstrumentation({
      requestHook(span) {
        addFastifySpanAttributes(span);
      },
    }),
);

const _fastifyIntegration = (() => {
  return {
    name: INTEGRATION_NAME,
    setupOnce() {
      instrumentFastify();
    },
  };
}) ;

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
const fastifyIntegration = defineIntegration(_fastifyIntegration);

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
function setupFastifyErrorHandler(fastify) {
  const plugin = Object.assign(
    function (fastify, _options, done) {
      fastify.addHook('onError', async (_request, _reply, error) => {
        captureException(error);
      });

      // registering `onRequest` hook here instead of using Otel `onRequest` callback b/c `onRequest` hook
      // is ironically called in the fastify `preHandler` hook which is called later in the lifecycle:
      // https://fastify.dev/docs/latest/Reference/Lifecycle/
      fastify.addHook('onRequest', async (request, _reply) => {
        const reqWithRouteInfo = request ;

        // Taken from Otel Fastify instrumentation:
        // https://github.com/open-telemetry/opentelemetry-js-contrib/blob/main/plugins/node/opentelemetry-instrumentation-fastify/src/instrumentation.ts#L94-L96
        const routeName = _optionalChain([reqWithRouteInfo, 'access', _ => _.routeOptions, 'optionalAccess', _2 => _2.url]) || reqWithRouteInfo.routerPath;
        const method = reqWithRouteInfo.method || 'GET';

        getIsolationScope().setTransactionName(`${method} ${routeName}`);
      });

      done();
    },
    {
      [Symbol.for('skip-override')]: true,
      [Symbol.for('fastify.display-name')]: 'sentry-fastify-error-handler',
    },
  );

  fastify.register(plugin);

  // Sadly, middleware spans do not go through `requestHook`, so we handle those here
  // We register this hook in this method, because if we register it in the integration `setup`,
  // it would always run even for users that are not even using fastify
  const client = getClient();
  if (client) {
    client.on('spanStart', span => {
      addFastifySpanAttributes(span);
    });
  }

  ensureIsWrapped(fastify.addHook, 'fastify');
}

function addFastifySpanAttributes(span) {
  const attributes = spanToJSON(span).data || {};

  // this is one of: middleware, request_handler
  const type = attributes['fastify.type'];

  // If this is already set, or we have no fastify span, no need to process again...
  if (attributes[SEMANTIC_ATTRIBUTE_SENTRY_OP] || !type) {
    return;
  }

  span.setAttributes({
    [SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: 'auto.http.otel.fastify',
    [SEMANTIC_ATTRIBUTE_SENTRY_OP]: `${type}.fastify`,
  });

  // Also update the name, we don't need to "middleware - " prefix
  const name = attributes['fastify.name'] || attributes['plugin.name'] || attributes['hook.name'];
  if (typeof name === 'string') {
    // Also remove `fastify -> ` prefix
    span.updateName(name.replace(/^fastify -> /, ''));
  }
}

export { fastifyIntegration, instrumentFastify, setupFastifyErrorHandler };
//# sourceMappingURL=fastify.js.map
