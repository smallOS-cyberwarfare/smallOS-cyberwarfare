var {
  _optionalChain
} = require('@sentry/core');

Object.defineProperty(exports, '__esModule', { value: true });

const instrumentationNestjsCore = require('@opentelemetry/instrumentation-nestjs-core');
const core = require('@sentry/core');
const instrument = require('../../../otel/instrument.js');
const sentryNestEventInstrumentation = require('./sentry-nest-event-instrumentation.js');
const sentryNestInstrumentation = require('./sentry-nest-instrumentation.js');

const INTEGRATION_NAME = 'Nest';

const instrumentNestCore = instrument.generateInstrumentOnce('Nest-Core', () => {
  return new instrumentationNestjsCore.NestInstrumentation();
});

const instrumentNestCommon = instrument.generateInstrumentOnce('Nest-Common', () => {
  return new sentryNestInstrumentation.SentryNestInstrumentation();
});

const instrumentNestEvent = instrument.generateInstrumentOnce('Nest-Event', () => {
  return new sentryNestEventInstrumentation.SentryNestEventInstrumentation();
});

const instrumentNest = Object.assign(
  () => {
    instrumentNestCore();
    instrumentNestCommon();
    instrumentNestEvent();
  },
  { id: INTEGRATION_NAME },
);

/**
 * Integration capturing tracing data for NestJS.
 *
 * @deprecated The `nestIntegration` is deprecated. Instead, use the NestJS SDK directly (`@sentry/nestjs`), or use the `nestIntegration` export from `@sentry/nestjs`.
 */
const nestIntegration = core.defineIntegration(() => {
  return {
    name: INTEGRATION_NAME,
    setupOnce() {
      instrumentNest();
    },
  };
});

/**
 * Setup an error handler for Nest.
 *
 * @deprecated `setupNestErrorHandler` is deprecated.
 * Instead use the `@sentry/nestjs` package, which has more functional APIs for capturing errors.
 * See the [`@sentry/nestjs` Setup Guide](https://docs.sentry.io/platforms/javascript/guides/nestjs/) for how to set up the Sentry NestJS SDK.
 */
function setupNestErrorHandler(app, baseFilter) {
  core.consoleSandbox(() => {
    // eslint-disable-next-line no-console
    console.warn(
      '[Sentry] Warning: You used the `setupNestErrorHandler()` method to set up Sentry error monitoring. This function is deprecated and will be removed in the next major version. Instead, it is recommended to use the `@sentry/nestjs` package. To set up the NestJS SDK see: https://docs.sentry.io/platforms/javascript/guides/nestjs/',
    );
  });

  // Sadly, NestInstrumentation has no requestHook, so we need to add the attributes here
  // We register this hook in this method, because if we register it in the integration `setup`,
  // it would always run even for users that are not even using Nest.js
  const client = core.getClient();
  if (client) {
    client.on('spanStart', span => {
      addNestSpanAttributes(span);
    });
  }

  app.useGlobalInterceptors({
    intercept(context, next) {
      if (core.getIsolationScope() === core.getDefaultIsolationScope()) {
        core.logger.warn('Isolation scope is still the default isolation scope, skipping setting transactionName.');
        return next.handle();
      }

      if (context.getType() === 'http') {
        // getRequest() returns either a FastifyRequest or ExpressRequest, depending on the used adapter
        const req = context.switchToHttp().getRequest();
        if ('routeOptions' in req && req.routeOptions && req.routeOptions.url) {
          // fastify case
          core.getIsolationScope().setTransactionName(`${_optionalChain([req, 'access', _ => _.method, 'optionalAccess', _2 => _2.toUpperCase, 'call', _3 => _3()]) || 'GET'} ${req.routeOptions.url}`);
        } else if ('route' in req && req.route && req.route.path) {
          // express case
          core.getIsolationScope().setTransactionName(`${_optionalChain([req, 'access', _4 => _4.method, 'optionalAccess', _5 => _5.toUpperCase, 'call', _6 => _6()]) || 'GET'} ${req.route.path}`);
        }
      }

      return next.handle();
    },
  });

  const wrappedFilter = new Proxy(baseFilter, {
    get(target, prop, receiver) {
      if (prop === 'catch') {
        const originalCatch = Reflect.get(target, prop, receiver);

        return (exception, host) => {
          const exceptionIsObject = typeof exception === 'object' && exception !== null;
          const exceptionStatusCode = exceptionIsObject && 'status' in exception ? exception.status : null;
          const exceptionErrorProperty = exceptionIsObject && 'error' in exception ? exception.error : null;

          /*
          Don't report expected NestJS control flow errors
          - `HttpException` errors will have a `status` property
          - `RpcException` errors will have an `error` property
           */
          if (exceptionStatusCode !== null || exceptionErrorProperty !== null) {
            return originalCatch.apply(target, [exception, host]);
          }

          core.captureException(exception);
          return originalCatch.apply(target, [exception, host]);
        };
      }
      return Reflect.get(target, prop, receiver);
    },
  });

  app.useGlobalFilters(wrappedFilter);
}

function addNestSpanAttributes(span) {
  const attributes = core.spanToJSON(span).data || {};

  // this is one of: app_creation, request_context, handler
  const type = attributes['nestjs.type'];

  // If this is already set, or we have no nest.js span, no need to process again...
  if (attributes[core.SEMANTIC_ATTRIBUTE_SENTRY_OP] || !type) {
    return;
  }

  span.setAttributes({
    [core.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: 'auto.http.otel.nestjs',
    [core.SEMANTIC_ATTRIBUTE_SENTRY_OP]: `${type}.nestjs`,
  });
}

exports.instrumentNest = instrumentNest;
exports.nestIntegration = nestIntegration;
exports.setupNestErrorHandler = setupNestErrorHandler;
//# sourceMappingURL=nest.js.map
