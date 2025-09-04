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
var constants_exports = {};
__export(constants_exports, {
  GLOBAL_KEY: () => import_chunk_5J6RGI77.GLOBAL_KEY,
  MODULE_NAME: () => import_chunk_5J6RGI77.MODULE_NAME,
  NAME: () => import_chunk_5J6RGI77.NAME,
  VERSION: () => import_chunk_5J6RGI77.VERSION
});
module.exports = __toCommonJS(constants_exports);
var import_chunk_5J6RGI77 = require("./chunk-5J6RGI77.js");
var import_chunk_FTA5RKYX = require("./chunk-FTA5RKYX.js");
