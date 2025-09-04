Object.defineProperty(exports, '__esModule', { value: true });

const scope = require('./scope.js');
const worldwide = require('./utils-hoist/worldwide.js');

/** Get the default current scope. */
function getDefaultCurrentScope() {
  return worldwide.getGlobalSingleton('defaultCurrentScope', () => new scope.Scope());
}

/** Get the default isolation scope. */
function getDefaultIsolationScope() {
  return worldwide.getGlobalSingleton('defaultIsolationScope', () => new scope.Scope());
}

exports.getDefaultCurrentScope = getDefaultCurrentScope;
exports.getDefaultIsolationScope = getDefaultIsolationScope;
//# sourceMappingURL=defaultScopes.js.map
