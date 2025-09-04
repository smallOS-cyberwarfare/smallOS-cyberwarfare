import { uuid4 } from './misc.js';

/**
 * Returns a new minimal propagation context.
 *
 * @deprecated Use `generateTraceId` and `generateSpanId` instead.
 */
function generatePropagationContext() {
  return {
    traceId: generateTraceId(),
    spanId: generateSpanId(),
  };
}

/**
 * Generate a random, valid trace ID.
 */
function generateTraceId() {
  return uuid4();
}

/**
 * Generate a random, valid span ID.
 */
function generateSpanId() {
  return uuid4().substring(16);
}

export { generatePropagationContext, generateSpanId, generateTraceId };
//# sourceMappingURL=propagationContext.js.map
