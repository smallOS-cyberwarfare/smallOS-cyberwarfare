/**
 * A function that is possibly wrapped by Sentry.
 */
export type WrappedFunction<T extends Function = Function> = T & {
    [key: string]: any;
    __sentry_wrapped__?: WrappedFunction<T>;
    __sentry_original__?: T;
};
//# sourceMappingURL=wrappedfunction.d.ts.map
