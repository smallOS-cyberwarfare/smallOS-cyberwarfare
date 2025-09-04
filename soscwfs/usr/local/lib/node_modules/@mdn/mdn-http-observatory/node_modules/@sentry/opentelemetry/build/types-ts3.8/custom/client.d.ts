import { BaseClient, Client } from '@sentry/core';
import { OpenTelemetryClient as OpenTelemetryClientInterface } from '../types';
/**
 * Wrap an Client with things we need for OpenTelemetry support.
 *
 * Usage:
 * const OpenTelemetryClient = getWrappedClientClass(NodeClient);
 * const client = new OpenTelemetryClient(options);
 */
export declare function wrapClientClass<ClassConstructor extends new (...args: any[]) => Client & BaseClient<any>, WrappedClassConstructor extends new (...args: any[]) => Client & BaseClient<any> & OpenTelemetryClientInterface>(ClientClass: ClassConstructor): WrappedClassConstructor;
//# sourceMappingURL=client.d.ts.map
