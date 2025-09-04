import { type Instrumentation } from '@opentelemetry/instrumentation';
/** Exported only for tests. */
export declare const INSTRUMENTED: Record<string, Instrumentation>;
/**
 * Instrument an OpenTelemetry instrumentation once.
 * This will skip running instrumentation again if it was already instrumented.
 */
export declare function generateInstrumentOnce<Options = unknown>(name: string, creator: (options?: Options) => Instrumentation): ((options?: Options) => void) & {
    id: string;
};
//# sourceMappingURL=instrument.d.ts.map