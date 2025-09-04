import { SpanContext } from '@opentelemetry/api';
import { PropagationContext } from '@sentry/core';
/**
 * Generates a SpanContext that represents a PropagationContext.
 * This can be set on a `context` to make this a (virtual) active span.
 *
 * @deprecated This function is deprecated and will be removed in the next major version.
 */
export declare function generateSpanContextForPropagationContext(propagationContext: PropagationContext): SpanContext;
//# sourceMappingURL=generateSpanContextForPropagationContext.d.ts.map
