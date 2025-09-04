Object.defineProperty(exports, '__esModule', { value: true });

const commonjs = require('./commonjs.js');

const createMissingInstrumentationContext = (pkg) => ({
  package: pkg,
  'javascript.is_cjs': commonjs.isCjs(),
});

exports.createMissingInstrumentationContext = createMissingInstrumentationContext;
//# sourceMappingURL=createMissingInstrumentationContext.js.map
