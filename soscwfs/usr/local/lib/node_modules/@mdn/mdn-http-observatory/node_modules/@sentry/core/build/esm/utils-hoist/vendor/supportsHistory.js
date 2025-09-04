import { GLOBAL_OBJ } from '../worldwide.js';

// Based on https://github.com/angular/angular.js/pull/13945/files
// The MIT License


const WINDOW = GLOBAL_OBJ ;

/**
 * Tells whether current environment supports History API
 * {@link supportsHistory}.
 *
 * @returns Answer to the given question.
 */
function supportsHistory() {
  // NOTE: in Chrome App environment, touching history.pushState, *even inside
  //       a try/catch block*, will cause Chrome to output an error to console.error
  // borrowed from: https://github.com/angular/angular.js/pull/13945/files
  // TODO(v9): Remove this custom check, it is pretty old and likely not needed anymore
  const chromeVar = (WINDOW ).chrome;
  const isChromePackagedApp = chromeVar && chromeVar.app && chromeVar.app.runtime;
  const hasHistoryApi = 'history' in WINDOW && !!WINDOW.history.pushState && !!WINDOW.history.replaceState;

  return !isChromePackagedApp && hasHistoryApi;
}

export { supportsHistory };
//# sourceMappingURL=supportsHistory.js.map
