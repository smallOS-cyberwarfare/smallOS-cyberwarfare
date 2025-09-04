import { getClient, withScope } from './currentScopes.js';
import { captureException } from './exports.js';
import { SEMANTIC_ATTRIBUTE_SENTRY_SOURCE, SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN } from './semanticAttributes.js';
import './tracing/errors.js';
import './utils-hoist/debug-build.js';
import './utils-hoist/logger.js';
import './debug-build.js';
import './utils-hoist/time.js';
import { normalize } from './utils-hoist/normalize.js';
import './utils-hoist/syncpromise.js';
import { startSpanManual } from './tracing/trace.js';

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
    captureException(nextResult.error, trpcCaptureContext);
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

    const client = getClient();
    const clientOptions = client && client.getOptions();

    const trpcContext = {
      procedure_path: path,
      procedure_type: type,
    };

    if (options.attachRpcInput !== undefined ? options.attachRpcInput : clientOptions && clientOptions.sendDefaultPii) {
      if (rawInput !== undefined) {
        trpcContext.input = normalize(rawInput);
      }

      if (getRawInput !== undefined && typeof getRawInput === 'function') {
        try {
          const rawRes = await getRawInput();

          trpcContext.input = normalize(rawRes);
        } catch (err) {
          // noop
        }
      }
    }

    return withScope(scope => {
      scope.setContext('trpc', trpcContext);
      return startSpanManual(
        {
          name: `trpc/${path}`,
          op: 'rpc.server',
          attributes: {
            [SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]: 'route',
            [SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: 'auto.rpc.trpc',
          },
        },
        async span => {
          try {
            const nextResult = await next();
            captureIfError(nextResult);
            span.end();
            return nextResult;
          } catch (e) {
            captureException(e, trpcCaptureContext);
            span.end();
            throw e;
          }
        },
      ) ;
    });
  };
}

export { trpcMiddleware };
//# sourceMappingURL=trpc.js.map
