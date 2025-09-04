import { InstrumentationBase, InstrumentationNodeModuleDefinition } from '@opentelemetry/instrumentation';
import { SDK_VERSION } from '@sentry/core';

// List of patched methods
// From: https://sdk.vercel.ai/docs/ai-sdk-core/telemetry#collected-data
const INSTRUMENTED_METHODS = [
  'generateText',
  'streamText',
  'generateObject',
  'streamObject',
  'embed',
  'embedMany',
] ;

let sentryVercelAiPatched = false;

/**
 * This detects is added by the Sentry Vercel AI Integration to detect if the integration should
 * be enabled.
 *
 * It also patches the `ai` module to enable Vercel AI telemetry automatically for all methods.
 */
class SentryVercelAiInstrumentation extends InstrumentationBase {
   constructor(config = {}) {
    super('@sentry/instrumentation-vercel-ai', SDK_VERSION, config);
  }

  /**
   * Initializes the instrumentation by defining the modules to be patched.
   */
   init() {
    const module = new InstrumentationNodeModuleDefinition('ai', ['>=3.0.0 <5'], this._patch.bind(this));
    return module;
  }

  /**
   * Patches module exports to enable Vercel AI telemetry.
   */
   _patch(moduleExports) {
    sentryVercelAiPatched = true;

    function generatePatch(name) {
      return (...args) => {
        const existingExperimentalTelemetry = args[0].experimental_telemetry || {};
        const isEnabled = existingExperimentalTelemetry.isEnabled;

        // if `isEnabled` is not explicitly set to `true` or `false`, enable telemetry
        // but disable capturing inputs and outputs by default
        if (isEnabled === undefined) {
          args[0].experimental_telemetry = {
            isEnabled: true,
            recordInputs: false,
            recordOutputs: false,
            ...existingExperimentalTelemetry,
          };
        }

        // @ts-expect-error we know that the method exists
        return moduleExports[name].apply(this, args);
      };
    }

    const patchedModuleExports = INSTRUMENTED_METHODS.reduce((acc, curr) => {
      acc[curr] = generatePatch(curr);
      return acc;
    }, {} );

    return { ...moduleExports, ...patchedModuleExports };
  }
}

export { SentryVercelAiInstrumentation, sentryVercelAiPatched };
//# sourceMappingURL=instrumentation.js.map
