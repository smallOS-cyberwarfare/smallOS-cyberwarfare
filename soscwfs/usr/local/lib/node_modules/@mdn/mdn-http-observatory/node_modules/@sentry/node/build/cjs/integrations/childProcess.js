Object.defineProperty(exports, '__esModule', { value: true });

const diagnosticsChannel = require('node:diagnostics_channel');
const core = require('@sentry/core');

// TODO(v9): Update this name and mention in migration docs.
const INTEGRATION_NAME = 'ProcessAndThreadBreadcrumbs';

/**
 * Capture breadcrumbs for child processes and worker threads.
 */
const childProcessIntegration = core.defineIntegration((options = {}) => {
  return {
    name: INTEGRATION_NAME,
    setup(_client) {
      // eslint-disable-next-line deprecation/deprecation
      diagnosticsChannel.channel('child_process').subscribe((event) => {
        if (event && typeof event === 'object' && 'process' in event) {
          captureChildProcessEvents(event.process , options);
        }
      });

      // eslint-disable-next-line deprecation/deprecation
      diagnosticsChannel.channel('worker_threads').subscribe((event) => {
        if (event && typeof event === 'object' && 'worker' in event) {
          captureWorkerThreadEvents(event.worker );
        }
      });
    },
  };
});

/**
 * Capture breadcrumbs for child processes and worker threads.
 *
 * @deprecated Use `childProcessIntegration` integration instead. Functionally they are the same. `processThreadBreadcrumbIntegration` will be removed in the next major version.
 */
const processThreadBreadcrumbIntegration = childProcessIntegration;

function captureChildProcessEvents(child, options) {
  let hasExited = false;
  let data;

  child
    .on('spawn', () => {
      // This is Sentry getting macOS OS context
      if (child.spawnfile === '/usr/bin/sw_vers') {
        hasExited = true;
        return;
      }

      data = { spawnfile: child.spawnfile };
      if (options.includeChildProcessArgs) {
        data.spawnargs = child.spawnargs;
      }
    })
    .on('exit', code => {
      if (!hasExited) {
        hasExited = true;

        // Only log for non-zero exit codes
        if (code !== null && code !== 0) {
          core.addBreadcrumb({
            category: 'child_process',
            message: `Child process exited with code '${code}'`,
            level: 'warning',
            data,
          });
        }
      }
    })
    .on('error', error => {
      if (!hasExited) {
        hasExited = true;

        core.addBreadcrumb({
          category: 'child_process',
          message: `Child process errored with '${error.message}'`,
          level: 'error',
          data,
        });
      }
    });
}

function captureWorkerThreadEvents(worker) {
  let threadId;

  worker
    .on('online', () => {
      threadId = worker.threadId;
    })
    .on('error', error => {
      core.addBreadcrumb({
        category: 'worker_thread',
        message: `Worker thread errored with '${error.message}'`,
        level: 'error',
        data: { threadId },
      });
    });
}

exports.childProcessIntegration = childProcessIntegration;
exports.processThreadBreadcrumbIntegration = processThreadBreadcrumbIntegration;
//# sourceMappingURL=childProcess.js.map
