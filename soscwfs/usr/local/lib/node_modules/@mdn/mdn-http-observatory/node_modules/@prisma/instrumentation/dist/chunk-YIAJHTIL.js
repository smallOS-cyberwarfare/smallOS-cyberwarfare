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
var chunk_YIAJHTIL_exports = {};
__export(chunk_YIAJHTIL_exports, {
  PrismaInstrumentation: () => PrismaInstrumentation
});
module.exports = __toCommonJS(chunk_YIAJHTIL_exports);
var import_chunk_O7OBHTYQ = require("./chunk-O7OBHTYQ.js");
var import_chunk_KSVJP65B = require("./chunk-KSVJP65B.js");
var import_instrumentation = require("@opentelemetry/instrumentation");
var PrismaInstrumentation = class extends import_instrumentation.InstrumentationBase {
  constructor(config = {}) {
    super(import_chunk_KSVJP65B.NAME, import_chunk_KSVJP65B.VERSION, config);
  }
  init() {
    const module2 = new import_instrumentation.InstrumentationNodeModuleDefinition(import_chunk_KSVJP65B.MODULE_NAME, [import_chunk_KSVJP65B.VERSION]);
    return [module2];
  }
  enable() {
    const config = this._config;
    const globalValue = {
      helper: new import_chunk_O7OBHTYQ.ActiveTracingHelper({ traceMiddleware: config.middleware ?? false })
    };
    global[import_chunk_KSVJP65B.GLOBAL_KEY] = globalValue;
  }
  disable() {
    delete global[import_chunk_KSVJP65B.GLOBAL_KEY];
  }
  isEnabled() {
    return Boolean(global[import_chunk_KSVJP65B.GLOBAL_KEY]);
  }
};
