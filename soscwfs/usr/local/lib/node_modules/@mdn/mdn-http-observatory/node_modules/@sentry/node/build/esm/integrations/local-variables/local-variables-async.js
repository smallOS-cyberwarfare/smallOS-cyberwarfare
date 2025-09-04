import { _optionalChain } from '@sentry/core';
import { Worker } from 'node:worker_threads';
import { defineIntegration, logger } from '@sentry/core';
import { isDebuggerEnabled } from '../../utils/debug.js';
import { LOCAL_VARIABLES_KEY, functionNamesMatch } from './common.js';

// This string is a placeholder that gets overwritten with the worker code.
const base64WorkerScript = 'LyohIEBzZW50cnkvbm9kZSA4LjU1LjAgKDEzNGZjZjMpIHwgaHR0cHM6Ly9naXRodWIuY29tL2dldHNlbnRyeS9zZW50cnktamF2YXNjcmlwdCAqLwppbXBvcnR7U2Vzc2lvbiBhcyBlfWZyb20ibm9kZTppbnNwZWN0b3IvcHJvbWlzZXMiO2ltcG9ydHt3b3JrZXJEYXRhIGFzIHR9ZnJvbSJub2RlOndvcmtlcl90aHJlYWRzIjtjb25zdCBuPSI4LjU1LjAiLG89Z2xvYmFsVGhpcztjb25zdCBpPSJ1bmRlZmluZWQiPT10eXBlb2YgX19TRU5UUllfREVCVUdfX3x8X19TRU5UUllfREVCVUdfXyxhPVsiZGVidWciLCJpbmZvIiwid2FybiIsImVycm9yIiwibG9nIiwiYXNzZXJ0IiwidHJhY2UiXSxzPXt9O2Z1bmN0aW9uIGMoZSl7aWYoISgiY29uc29sZSJpbiBvKSlyZXR1cm4gZSgpO2NvbnN0IHQ9by5jb25zb2xlLG49e30saT1PYmplY3Qua2V5cyhzKTtpLmZvckVhY2goKGU9Pntjb25zdCBvPXNbZV07bltlXT10W2VdLHRbZV09b30pKTt0cnl7cmV0dXJuIGUoKX1maW5hbGx5e2kuZm9yRWFjaCgoZT0+e3RbZV09bltlXX0pKX19IWZ1bmN0aW9uKGUsdCxpKXtjb25zdCBhPW8scz1hLl9fU0VOVFJZX189YS5fX1NFTlRSWV9ffHx7fSxjPXNbbl09c1tuXXx8e307Y1tlXXx8KGNbZV09dCgpKX0oImxvZ2dlciIsKGZ1bmN0aW9uKCl7bGV0IGU9ITE7Y29uc3QgdD17ZW5hYmxlOigpPT57ZT0hMH0sZGlzYWJsZTooKT0+e2U9ITF9LGlzRW5hYmxlZDooKT0+ZX07cmV0dXJuIGk/YS5mb3JFYWNoKChuPT57dFtuXT0oLi4udCk9PntlJiZjKCgoKT0+e28uY29uc29sZVtuXShgU2VudHJ5IExvZ2dlciBbJHtufV06YCwuLi50KX0pKX19KSk6YS5mb3JFYWNoKChlPT57dFtlXT0oKT0+e319KSksdH0pKTtjb25zdCByPSJfX1NFTlRSWV9FUlJPUl9MT0NBTF9WQVJJQUJMRVNfXyI7Y29uc3QgdT10O2Z1bmN0aW9uIGwoLi4uZSl7dS5kZWJ1ZyYmYygoKCk9PmNvbnNvbGUubG9nKCJbTG9jYWxWYXJpYWJsZXMgV29ya2VyXSIsLi4uZSkpKX1hc3luYyBmdW5jdGlvbiBmKGUsdCxuLG8pe2NvbnN0IGk9YXdhaXQgZS5wb3N0KCJSdW50aW1lLmdldFByb3BlcnRpZXMiLHtvYmplY3RJZDp0LG93blByb3BlcnRpZXM6ITB9KTtvW25dPWkucmVzdWx0LmZpbHRlcigoZT0+Imxlbmd0aCIhPT1lLm5hbWUmJiFpc05hTihwYXJzZUludChlLm5hbWUsMTApKSkpLnNvcnQoKChlLHQpPT5wYXJzZUludChlLm5hbWUsMTApLXBhcnNlSW50KHQubmFtZSwxMCkpKS5tYXAoKGU9PmUudmFsdWU/LnZhbHVlKSl9YXN5bmMgZnVuY3Rpb24gZyhlLHQsbixvKXtjb25zdCBpPWF3YWl0IGUucG9zdCgiUnVudGltZS5nZXRQcm9wZXJ0aWVzIix7b2JqZWN0SWQ6dCxvd25Qcm9wZXJ0aWVzOiEwfSk7b1tuXT1pLnJlc3VsdC5tYXAoKGU9PltlLm5hbWUsZS52YWx1ZT8udmFsdWVdKSkucmVkdWNlKCgoZSxbdCxuXSk9PihlW3RdPW4sZSkpLHt9KX1mdW5jdGlvbiBkKGUsdCl7ZS52YWx1ZSYmKCJ2YWx1ZSJpbiBlLnZhbHVlP3ZvaWQgMD09PWUudmFsdWUudmFsdWV8fG51bGw9PT1lLnZhbHVlLnZhbHVlP3RbZS5uYW1lXT1gPCR7ZS52YWx1ZS52YWx1ZX0+YDp0W2UubmFtZV09ZS52YWx1ZS52YWx1ZToiZGVzY3JpcHRpb24iaW4gZS52YWx1ZSYmImZ1bmN0aW9uIiE9PWUudmFsdWUudHlwZT90W2UubmFtZV09YDwke2UudmFsdWUuZGVzY3JpcHRpb259PmA6InVuZGVmaW5lZCI9PT1lLnZhbHVlLnR5cGUmJih0W2UubmFtZV09Ijx1bmRlZmluZWQ+IikpfWFzeW5jIGZ1bmN0aW9uIGIoZSx0KXtjb25zdCBuPWF3YWl0IGUucG9zdCgiUnVudGltZS5nZXRQcm9wZXJ0aWVzIix7b2JqZWN0SWQ6dCxvd25Qcm9wZXJ0aWVzOiEwfSksbz17fTtmb3IoY29uc3QgdCBvZiBuLnJlc3VsdClpZih0Py52YWx1ZT8ub2JqZWN0SWQmJiJBcnJheSI9PT10Py52YWx1ZS5jbGFzc05hbWUpe2NvbnN0IG49dC52YWx1ZS5vYmplY3RJZDthd2FpdCBmKGUsbix0Lm5hbWUsbyl9ZWxzZSBpZih0Py52YWx1ZT8ub2JqZWN0SWQmJiJPYmplY3QiPT09dD8udmFsdWU/LmNsYXNzTmFtZSl7Y29uc3Qgbj10LnZhbHVlLm9iamVjdElkO2F3YWl0IGcoZSxuLHQubmFtZSxvKX1lbHNlIHQ/LnZhbHVlJiZkKHQsbyk7cmV0dXJuIG99bGV0IHA7KGFzeW5jIGZ1bmN0aW9uKCl7Y29uc3QgdD1uZXcgZTt0LmNvbm5lY3RUb01haW5UaHJlYWQoKSxsKCJDb25uZWN0ZWQgdG8gbWFpbiB0aHJlYWQiKTtsZXQgbj0hMTt0Lm9uKCJEZWJ1Z2dlci5yZXN1bWVkIiwoKCk9PntuPSExfSkpLHQub24oIkRlYnVnZ2VyLnBhdXNlZCIsKGU9PntuPSEwLGFzeW5jIGZ1bmN0aW9uKGUse3JlYXNvbjp0LGRhdGE6e29iamVjdElkOm59LGNhbGxGcmFtZXM6b30pe2lmKCJleGNlcHRpb24iIT09dCYmInByb21pc2VSZWplY3Rpb24iIT09dClyZXR1cm47aWYocD8uKCksbnVsbD09bilyZXR1cm47Y29uc3QgaT1bXTtmb3IobGV0IHQ9MDt0PG8ubGVuZ3RoO3QrKyl7Y29uc3R7c2NvcGVDaGFpbjpuLGZ1bmN0aW9uTmFtZTphLHRoaXM6c309b1t0XSxjPW4uZmluZCgoZT0+ImxvY2FsIj09PWUudHlwZSkpLHI9Imdsb2JhbCIhPT1zLmNsYXNzTmFtZSYmcy5jbGFzc05hbWU/YCR7cy5jbGFzc05hbWV9LiR7YX1gOmE7aWYodm9pZCAwPT09Yz8ub2JqZWN0Lm9iamVjdElkKWlbdF09e2Z1bmN0aW9uOnJ9O2Vsc2V7Y29uc3Qgbj1hd2FpdCBiKGUsYy5vYmplY3Qub2JqZWN0SWQpO2lbdF09e2Z1bmN0aW9uOnIsdmFyczpufX19YXdhaXQgZS5wb3N0KCJSdW50aW1lLmNhbGxGdW5jdGlvbk9uIix7ZnVuY3Rpb25EZWNsYXJhdGlvbjpgZnVuY3Rpb24oKSB7IHRoaXMuJHtyfSA9IHRoaXMuJHtyfSB8fCAke0pTT04uc3RyaW5naWZ5KGkpfTsgfWAsc2lsZW50OiEwLG9iamVjdElkOm59KSxhd2FpdCBlLnBvc3QoIlJ1bnRpbWUucmVsZWFzZU9iamVjdCIse29iamVjdElkOm59KX0odCxlLnBhcmFtcykudGhlbigoYXN5bmMoKT0+e24mJmF3YWl0IHQucG9zdCgiRGVidWdnZXIucmVzdW1lIil9KSwoYXN5bmMgZT0+e24mJmF3YWl0IHQucG9zdCgiRGVidWdnZXIucmVzdW1lIil9KSl9KSksYXdhaXQgdC5wb3N0KCJEZWJ1Z2dlci5lbmFibGUiKTtjb25zdCBvPSExIT09dS5jYXB0dXJlQWxsRXhjZXB0aW9ucztpZihhd2FpdCB0LnBvc3QoIkRlYnVnZ2VyLnNldFBhdXNlT25FeGNlcHRpb25zIix7c3RhdGU6bz8iYWxsIjoidW5jYXVnaHQifSksbyl7Y29uc3QgZT11Lm1heEV4Y2VwdGlvbnNQZXJTZWNvbmR8fDUwO3A9ZnVuY3Rpb24oZSx0LG4pe2xldCBvPTAsaT01LGE9MDtyZXR1cm4gc2V0SW50ZXJ2YWwoKCgpPT57MD09PWE/bz5lJiYoaSo9MixuKGkpLGk+ODY0MDAmJihpPTg2NDAwKSxhPWkpOihhLT0xLDA9PT1hJiZ0KCkpLG89MH0pLDFlMykudW5yZWYoKSwoKT0+e28rPTF9fShlLChhc3luYygpPT57bCgiUmF0ZS1saW1pdCBsaWZ0ZWQuIiksYXdhaXQgdC5wb3N0KCJEZWJ1Z2dlci5zZXRQYXVzZU9uRXhjZXB0aW9ucyIse3N0YXRlOiJhbGwifSl9KSwoYXN5bmMgZT0+e2woYFJhdGUtbGltaXQgZXhjZWVkZWQuIERpc2FibGluZyBjYXB0dXJpbmcgb2YgY2F1Z2h0IGV4Y2VwdGlvbnMgZm9yICR7ZX0gc2Vjb25kcy5gKSxhd2FpdCB0LnBvc3QoIkRlYnVnZ2VyLnNldFBhdXNlT25FeGNlcHRpb25zIix7c3RhdGU6InVuY2F1Z2h0In0pfSkpfX0pKCkuY2F0Y2goKGU9PntsKCJGYWlsZWQgdG8gc3RhcnQgZGVidWdnZXIiLGUpfSkpLHNldEludGVydmFsKCgoKT0+e30pLDFlNCk7';

function log(...args) {
  logger.log('[LocalVariables]', ...args);
}

/**
 * Adds local variables to exception frames
 */
const localVariablesAsyncIntegration = defineIntegration(((
  integrationOptions = {},
) => {
  function addLocalVariablesToException(exception, localVariables) {
    // Filter out frames where the function name is `new Promise` since these are in the error.stack frames
    // but do not appear in the debugger call frames
    const frames = (_optionalChain([exception, 'access', _ => _.stacktrace, 'optionalAccess', _2 => _2.frames]) || []).filter(frame => frame.function !== 'new Promise');

    for (let i = 0; i < frames.length; i++) {
      // Sentry frames are in reverse order
      const frameIndex = frames.length - i - 1;

      const frameLocalVariables = localVariables[i];
      const frame = frames[frameIndex];

      if (!frame || !frameLocalVariables) {
        // Drop out if we run out of frames to match up
        break;
      }

      if (
        // We need to have vars to add
        frameLocalVariables.vars === undefined ||
        // We're not interested in frames that are not in_app because the vars are not relevant
        frame.in_app === false ||
        // The function names need to match
        !functionNamesMatch(frame.function, frameLocalVariables.function)
      ) {
        continue;
      }

      frame.vars = frameLocalVariables.vars;
    }
  }

  function addLocalVariablesToEvent(event, hint) {
    if (
      hint.originalException &&
      typeof hint.originalException === 'object' &&
      LOCAL_VARIABLES_KEY in hint.originalException &&
      Array.isArray(hint.originalException[LOCAL_VARIABLES_KEY])
    ) {
      for (const exception of _optionalChain([event, 'access', _3 => _3.exception, 'optionalAccess', _4 => _4.values]) || []) {
        addLocalVariablesToException(exception, hint.originalException[LOCAL_VARIABLES_KEY]);
      }

      hint.originalException[LOCAL_VARIABLES_KEY] = undefined;
    }

    return event;
  }

  async function startInspector() {
    // We load inspector dynamically because on some platforms Node is built without inspector support
    const inspector = await import('node:inspector');
    if (!inspector.url()) {
      inspector.open(0);
    }
  }

  function startWorker(options) {
    const worker = new Worker(new URL(`data:application/javascript;base64,${base64WorkerScript}`), {
      workerData: options,
      // We don't want any Node args to be passed to the worker
      execArgv: [],
      env: { ...process.env, NODE_OPTIONS: undefined },
    });

    process.on('exit', () => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      worker.terminate();
    });

    worker.once('error', (err) => {
      log('Worker error', err);
    });

    worker.once('exit', (code) => {
      log('Worker exit', code);
    });

    // Ensure this thread can't block app exit
    worker.unref();
  }

  return {
    name: 'LocalVariablesAsync',
    async setup(client) {
      const clientOptions = client.getOptions();

      if (!clientOptions.includeLocalVariables) {
        return;
      }

      if (await isDebuggerEnabled()) {
        logger.warn('Local variables capture has been disabled because the debugger was already enabled');
        return;
      }

      const options = {
        ...integrationOptions,
        debug: logger.isEnabled(),
      };

      startInspector().then(
        () => {
          try {
            startWorker(options);
          } catch (e) {
            logger.error('Failed to start worker', e);
          }
        },
        e => {
          logger.error('Failed to start inspector', e);
        },
      );
    },
    processEvent(event, hint) {
      return addLocalVariablesToEvent(event, hint);
    },
  };
}) );

export { base64WorkerScript, localVariablesAsyncIntegration };
//# sourceMappingURL=local-variables-async.js.map
