Object.defineProperty(exports, '__esModule', { value: true });

const util = require('node:util');
const core = require('@sentry/core');

const INTEGRATION_NAME = 'Console';

/**
 * Capture console logs as breadcrumbs.
 */
const consoleIntegration = core.defineIntegration(() => {
  return {
    name: INTEGRATION_NAME,
    setup(client) {
      core.addConsoleInstrumentationHandler(({ args, level }) => {
        if (core.getClient() !== client) {
          return;
        }

        core.addBreadcrumb(
          {
            category: 'console',
            level: core.severityLevelFromString(level),
            message: core.truncate(util.format.apply(undefined, args), 2048), // 2KB
          },
          {
            input: [...args],
            level,
          },
        );
      });
    },
  };
});

exports.consoleIntegration = consoleIntegration;
//# sourceMappingURL=console.js.map
