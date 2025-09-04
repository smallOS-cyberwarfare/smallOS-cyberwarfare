Object.defineProperty(exports, '__esModule', { value: true });

const currentScopes = require('./currentScopes.js');
const exports$1 = require('./exports.js');
const semanticAttributes = require('./semanticAttributes.js');
require('./tracing/errors.js');
require('./utils-hoist/debug-build.js');
require('./utils-hoist/logger.js');
require('./debug-build.js');
require('./utils-hoist/time.js');
const normalize = require('./utils-hoist/normalize.js');
require('./utils-hoist/syncpromise.js');
const trace = require('./tracing/trace.js');

const trpcCaptureContext = { mechanism: { handled: false, data: { function: 'trpcMiddleware' } } };

function captureIfError(nextResult) {
  // TODO: Set span status based on what TRPCError was encountered
  if (
    typeof nextResult === 'object' &&
    nextResult !== null &&
    'ok' in nextResult &&
    !nextResult.ok &&
    'error' in nextResult
  ) {
    exports$1.captureException(nextResult.error, trpcCaptureContext);
  }
}

/**
 * Sentry tRPC middleware that captures errors and creates spans for tRPC procedures.
 */
function trpcMiddleware(options = {}) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return async function (opts) {
    const { path, type, next, rawInput, getRawInput } = opts;

    const client = currentScopes.getClient();
    const clientOptions = client && client.getOptions();

    const trpcContext = {
      procedure_path: path,
      procedure_type: type,
    };

    if (options.attachRpcInput !== undefined ? options.attachRpcInput : clientOptions && clientOptions.sendDefaultPii) {
      if (rawInput !== undefined) {
        trpcContext.input = normalize.normalize(rawInput);
      }

      if (getRawInput !== undefined && typeof getRawInput === 'function') {
        try {
          const rawRes = await getRawInput();

          trpcContext.input = normalize.normalize(rawRes);
        } catch (err) {
          // noop
        }
      }
    }

    return currentScopes.withScope(scope => {
      scope.setContext('trpc', trpcContext);
      return trace.startSpanManual(
        {
          name: `trpc/${path}`,
          op: 'rpc.server',
          attributes: {
            [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]: 'route',
            [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: 'auto.rpc.trpc',
          },
        },
        async span => {
          try {
            const nextResult = await next();
            captureIfError(nextResult);
            span.end();
            return nextResult;
          } catch (e) {
            exports$1.captureException(e, trpcCaptureContext);
            span.end();
            throw e;
          }
        },
      ) ;
    });
  };
}

exports.trpcMiddleware = trpcMiddleware;
//# sourceMappingURL=trpc.js.map
