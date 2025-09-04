Object.defineProperty(exports, '__esModule', { value: true });

/** An error emitted by Sentry SDKs and related utilities. */
class SentryError extends Error {

   constructor(
     message,
    logLevel = 'warn',
  ) {
    super(message);this.message = message;
    this.logLevel = logLevel;
  }
}

exports.SentryError = SentryError;
//# sourceMappingURL=error.js.map
