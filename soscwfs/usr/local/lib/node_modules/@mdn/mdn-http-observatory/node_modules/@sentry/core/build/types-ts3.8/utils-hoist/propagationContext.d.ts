import { PropagationContext } from '../types-hoist';
/**
 * Returns a new minimal propagation context.
 *
 * @deprecated Use `generateTraceId` and `generateSpanId` instead.
 */
export declare function generatePropagationContext(): PropagationContext;
/**
 * Generate a random, valid trace ID.
 */
export declare function generateTraceId(): string;
/**
 * Generate a random, valid span ID.
 */
export declare function generateSpanId(): string;
//# sourceMappingURL=propagationContext.d.ts.map
