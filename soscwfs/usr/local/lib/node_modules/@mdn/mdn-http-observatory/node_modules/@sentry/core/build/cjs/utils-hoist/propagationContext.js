Object.defineProperty(exports, '__esModule', { value: true });

const misc = require('./misc.js');

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
  return misc.uuid4();
}

/**
 * Generate a random, valid span ID.
 */
function generateSpanId() {
  return misc.uuid4().substring(16);
}

exports.generatePropagationContext = generatePropagationContext;
exports.generateSpanId = generateSpanId;
exports.generateTraceId = generateTraceId;
//# sourceMappingURL=propagationContext.js.map
