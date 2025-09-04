import { Context } from '@opentelemetry/api';
import { EngineSpanEvent, ExtendedSpanOptions, SpanCallback, TracingHelper } from '@prisma/internals';
type Options = {
    traceMiddleware: boolean;
};
export declare class ActiveTracingHelper implements TracingHelper {
    private traceMiddleware;
    constructor({ traceMiddleware }: Options);
    isEnabled(): boolean;
    getTraceParent(context?: Context | undefined): string;
    createEngineSpan(engineSpanEvent: EngineSpanEvent): void;
    getActiveContext(): Context | undefined;
    runInChildSpan<R>(options: string | ExtendedSpanOptions, callback: SpanCallback<R>): R;
}
export {};
