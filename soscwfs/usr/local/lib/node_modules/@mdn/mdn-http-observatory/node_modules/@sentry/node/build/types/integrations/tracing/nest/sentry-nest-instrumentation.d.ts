import type { InstrumentationConfig } from '@opentelemetry/instrumentation';
import { InstrumentationBase, InstrumentationNodeModuleDefinition } from '@opentelemetry/instrumentation';
/**
 * Custom instrumentation for nestjs.
 *
 * This hooks into
 * 1. @Injectable decorator, which is applied on class middleware, interceptors and guards.
 * 2. @Catch decorator, which is applied on exception filters.
 */
export declare class SentryNestInstrumentation extends InstrumentationBase {
    static readonly COMPONENT = "@nestjs/common";
    static readonly COMMON_ATTRIBUTES: {
        component: string;
    };
    constructor(config?: InstrumentationConfig);
    /**
     * Initializes the instrumentation by defining the modules to be patched.
     */
    init(): InstrumentationNodeModuleDefinition;
    /**
     * Wraps the @Injectable decorator.
     */
    private _getInjectableFileInstrumentation;
    /**
     * Wraps the @Catch decorator.
     */
    private _getCatchFileInstrumentation;
    /**
     * Creates a wrapper function for the @Injectable decorator.
     */
    private _createWrapInjectable;
    /**
     * Creates a wrapper function for the @Catch decorator. Used to instrument exception filters.
     */
    private _createWrapCatch;
}
//# sourceMappingURL=sentry-nest-instrumentation.d.ts.map