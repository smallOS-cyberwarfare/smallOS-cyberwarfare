import { InstrumentationConfig } from '@opentelemetry/instrumentation';
import { InstrumentationBase, InstrumentationNodeModuleDefinition } from '@opentelemetry/instrumentation';
/**
 * Custom instrumentation for nestjs event-emitter
 *
 * This hooks into the `OnEvent` decorator, which is applied on event handlers.
 */
export declare class SentryNestEventInstrumentation extends InstrumentationBase {
    static readonly COMPONENT = "@nestjs/event-emitter";
    static readonly COMMON_ATTRIBUTES: {
        component: string;
    };
    constructor(config?: InstrumentationConfig);
    /**
     * Initializes the instrumentation by defining the modules to be patched.
     */
    init(): InstrumentationNodeModuleDefinition;
    /**
     * Wraps the @OnEvent decorator.
     */
    private _getOnEventFileInstrumentation;
    /**
     * Creates a wrapper function for the @OnEvent decorator.
     */
    private _createWrapOnEvent;
}
//# sourceMappingURL=sentry-nest-event-instrumentation.d.ts.map
