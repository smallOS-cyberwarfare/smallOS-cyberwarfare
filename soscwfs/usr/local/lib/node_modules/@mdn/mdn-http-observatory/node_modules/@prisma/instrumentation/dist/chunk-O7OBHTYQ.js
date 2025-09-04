"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var chunk_O7OBHTYQ_exports = {};
__export(chunk_O7OBHTYQ_exports, {
  ActiveTracingHelper: () => ActiveTracingHelper
});
module.exports = __toCommonJS(chunk_O7OBHTYQ_exports);
var import_api = require("@opentelemetry/api");
var import_sdk_trace_base = require("@opentelemetry/sdk-trace-base");
var showAllTraces = process.env.PRISMA_SHOW_ALL_TRACES === "true";
var nonSampledTraceParent = `00-10-10-00`;
function engineSpanKindToOTELSpanKind(engineSpanKind) {
  switch (engineSpanKind) {
    case "client":
      return import_api.SpanKind.CLIENT;
    case "internal":
    default:
      return import_api.SpanKind.INTERNAL;
  }
}
var ActiveTracingHelper = class {
  constructor({ traceMiddleware }) {
    this.traceMiddleware = traceMiddleware;
  }
  isEnabled() {
    return true;
  }
  getTraceParent(context) {
    const span = import_api.trace.getSpanContext(context ?? import_api.context.active());
    if (span) {
      return `00-${span.traceId}-${span.spanId}-0${span.traceFlags}`;
    }
    return nonSampledTraceParent;
  }
  createEngineSpan(engineSpanEvent) {
    const tracer = import_api.trace.getTracer("prisma");
    engineSpanEvent.spans.forEach((engineSpan) => {
      const spanKind = engineSpanKindToOTELSpanKind(engineSpan.kind);
      const spanContext = {
        traceId: engineSpan.trace_id,
        spanId: engineSpan.span_id,
        traceFlags: import_api.TraceFlags.SAMPLED
      };
      const links = engineSpan.links?.map((link) => {
        return {
          context: {
            traceId: link.trace_id,
            spanId: link.span_id,
            traceFlags: import_api.TraceFlags.SAMPLED
          }
        };
      });
      const span = new import_sdk_trace_base.Span(
        tracer,
        import_api.ROOT_CONTEXT,
        engineSpan.name,
        spanContext,
        spanKind,
        engineSpan.parent_span_id,
        links,
        engineSpan.start_time
      );
      if (engineSpan.attributes) {
        span.setAttributes(engineSpan.attributes);
      }
      span.end(engineSpan.end_time);
    });
  }
  getActiveContext() {
    return import_api.context.active();
  }
  runInChildSpan(options, callback) {
    if (typeof options === "string") {
      options = { name: options };
    }
    if (options.internal && !showAllTraces) {
      return callback();
    }
    if (options.middleware && !this.traceMiddleware) {
      return callback();
    }
    const tracer = import_api.trace.getTracer("prisma");
    const context = options.context ?? this.getActiveContext();
    const name = `prisma:client:${options.name}`;
    if (options.active === false) {
      const span = tracer.startSpan(name, options, context);
      return endSpan(span, callback(span, context));
    }
    return tracer.startActiveSpan(name, options, (span) => endSpan(span, callback(span, context)));
  }
};
function endSpan(span, result) {
  if (isPromiseLike(result)) {
    return result.then(
      (value) => {
        span.end();
        return value;
      },
      (reason) => {
        span.end();
        throw reason;
      }
    );
  }
  span.end();
  return result;
}
function isPromiseLike(value) {
  return value != null && typeof value["then"] === "function";
}
