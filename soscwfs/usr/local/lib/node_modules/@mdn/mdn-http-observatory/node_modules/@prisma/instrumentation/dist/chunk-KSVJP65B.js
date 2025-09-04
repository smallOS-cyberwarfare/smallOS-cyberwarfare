"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
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
var chunk_KSVJP65B_exports = {};
__export(chunk_KSVJP65B_exports, {
  GLOBAL_KEY: () => GLOBAL_KEY,
  MODULE_NAME: () => MODULE_NAME,
  NAME: () => NAME,
  VERSION: () => VERSION
});
module.exports = __toCommonJS(chunk_KSVJP65B_exports);
var import_chunk_FTA5RKYX = require("./chunk-FTA5RKYX.js");
var require_package = (0, import_chunk_FTA5RKYX.__commonJS)({
  "package.json"(exports, module2) {
    module2.exports = {
      name: "@prisma/instrumentation",
      version: "0.0.0",
      description: "OpenTelemetry compliant instrumentation for Prisma Client",
      main: "dist/index.js",
      types: "dist/index.d.ts",
      license: "Apache-2.0",
      homepage: "https://www.prisma.io",
      repository: {
        type: "git",
        url: "https://github.com/prisma/prisma.git",
        directory: "packages/instrumentation"
      },
      bugs: "https://github.com/prisma/prisma/issues",
      devDependencies: {
        "@prisma/internals": "workspace:*",
        "@swc/core": "1.6.13",
        "@types/jest": "29.5.12",
        "@types/node": "18.19.31",
        jest: "29.7.0",
        "jest-junit": "16.0.0",
        typescript: "5.4.5"
      },
      dependencies: {
        "@opentelemetry/api": "^1.8",
        "@opentelemetry/instrumentation": "^0.49 || ^0.50 || ^0.51 || ^0.52.0 || ^0.53.0",
        "@opentelemetry/sdk-trace-base": "^1.22"
      },
      files: [
        "dist"
      ],
      keywords: [
        "prisma",
        "instrumentation",
        "opentelemetry",
        "otel"
      ],
      scripts: {
        dev: "DEV=true tsx helpers/build.ts",
        build: "tsx helpers/build.ts",
        prepublishOnly: "pnpm run build",
        test: "jest"
      },
      sideEffects: false
    };
  }
});
var { version, name } = require_package();
var GLOBAL_KEY = "PRISMA_INSTRUMENTATION";
var VERSION = version;
var NAME = name;
var MODULE_NAME = "prisma";
