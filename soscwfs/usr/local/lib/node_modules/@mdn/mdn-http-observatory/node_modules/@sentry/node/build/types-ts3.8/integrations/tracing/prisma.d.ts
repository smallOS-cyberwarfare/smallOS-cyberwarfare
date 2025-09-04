import { Instrumentation } from '@opentelemetry/instrumentation';
export declare const instrumentPrisma: ((options?: {
    prismaInstrumentation?: Instrumentation<import("@opentelemetry/instrumentation").InstrumentationConfig> | undefined;
} | undefined) => void) & {
    id: string;
};
/**
 * Adds Sentry tracing instrumentation for the [Prisma](https://www.npmjs.com/package/prisma) ORM.
 * For more information, see the [`prismaIntegration` documentation](https://docs.sentry.io/platforms/javascript/guides/node/configuration/integrations/prisma/).
 *
 * Make sure `previewFeatures = ["tracing"]` is added to the generator block in your Prisma schema.
 *
 * ```prisma
 * generator client {
 *  provider = "prisma-client-js"
 *  previewFeatures = ["tracing"]
 * }
 * ```
 *
 * NOTE: By default, this integration works with Prisma version 5.
 * To get performance instrumentation for other Prisma versions,
 * 1. Install the `@prisma/instrumentation` package with the desired version.
 * 1. Pass a `new PrismaInstrumentation()` instance as exported from `@prisma/instrumentation` to the `prismaInstrumentation` option of this integration:
 *
 *    ```js
 *    import { PrismaInstrumentation } from '@prisma/instrumentation'
 *
 *    Sentry.init({
 *      integrations: [
 *        prismaIntegration({
 *          // Override the default instrumentation that Sentry uses
 *          prismaInstrumentation: new PrismaInstrumentation()
 *        })
 *      ]
 *    })
 *    ```
 *
 *    The passed instrumentation instance will override the default instrumentation instance the integration would use, while the `prismaIntegration` will still ensure data compatibility for the various Prisma versions.
 */
export declare const prismaIntegration: (args_0?: {
    /**
     * Overrides the instrumentation used by the Sentry SDK with the passed in instrumentation instance.
     *
     * NOTE: By default, the Sentry SDK uses the Prisma v5 instrumentation. Use this option if you need performance instrumentation different Prisma versions.
     *
     * For more information refer to the documentation of `prismaIntegration()` or see https://docs.sentry.io/platforms/javascript/guides/node/configuration/integrations/prisma/
     */
    prismaInstrumentation?: Instrumentation<import("@opentelemetry/instrumentation").InstrumentationConfig> | undefined;
} | undefined) => import("@sentry/core").Integration;
//# sourceMappingURL=prisma.d.ts.map
