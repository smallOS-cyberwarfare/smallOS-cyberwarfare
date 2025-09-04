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

export { SentryError };
//# sourceMappingURL=error.js.map
