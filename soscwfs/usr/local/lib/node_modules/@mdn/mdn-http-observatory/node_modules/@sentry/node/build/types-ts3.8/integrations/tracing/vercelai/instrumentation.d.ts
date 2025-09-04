import { InstrumentationBase } from '@opentelemetry/instrumentation';
import { InstrumentationConfig, InstrumentationModuleDefinition } from '@opentelemetry/instrumentation';
export declare let sentryVercelAiPatched: boolean;
/**
 * This detects is added by the Sentry Vercel AI Integration to detect if the integration should
 * be enabled.
 *
 * It also patches the `ai` module to enable Vercel AI telemetry automatically for all methods.
 */
export declare class SentryVercelAiInstrumentation extends InstrumentationBase {
    constructor(config?: InstrumentationConfig);
    /**
     * Initializes the instrumentation by defining the modules to be patched.
     */
    init(): InstrumentationModuleDefinition;
    /**
     * Patches module exports to enable Vercel AI telemetry.
     */
    private _patch;
}
//# sourceMappingURL=instrumentation.d.ts.map
