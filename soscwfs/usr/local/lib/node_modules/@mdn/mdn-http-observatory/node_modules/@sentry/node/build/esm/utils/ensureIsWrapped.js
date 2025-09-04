import { _optionalChain } from '@sentry/core';
import { isWrapped } from '@opentelemetry/core';
import { getClient, isEnabled, hasTracingEnabled, consoleSandbox, getGlobalScope } from '@sentry/core';
import { isCjs } from './commonjs.js';
import { createMissingInstrumentationContext } from './createMissingInstrumentationContext.js';

/**
 * Checks and warns if a framework isn't wrapped by opentelemetry.
 */
function ensureIsWrapped(
  maybeWrappedFunction,
  name,
) {
  const client = getClient();
  if (
    !_optionalChain([client, 'optionalAccess', _ => _.getOptions, 'call', _2 => _2(), 'access', _3 => _3.disableInstrumentationWarnings]) &&
    !isWrapped(maybeWrappedFunction) &&
    isEnabled() &&
    hasTracingEnabled()
  ) {
    consoleSandbox(() => {
      if (isCjs()) {
        // eslint-disable-next-line no-console
        console.warn(
          `[Sentry] ${name} is not instrumented. This is likely because you required/imported ${name} before calling \`Sentry.init()\`.`,
        );
      } else {
        // eslint-disable-next-line no-console
        console.warn(
          `[Sentry] ${name} is not instrumented. Please make sure to initialize Sentry in a separate file that you \`--import\` when running node, see: https://docs.sentry.io/platforms/javascript/guides/${name}/install/esm/.`,
        );
      }
    });

    getGlobalScope().setContext('missing_instrumentation', createMissingInstrumentationContext(name));
  }
}

export { ensureIsWrapped };
//# sourceMappingURL=ensureIsWrapped.js.map
