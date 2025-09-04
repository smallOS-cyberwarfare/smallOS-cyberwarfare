import type { MeasurementUnit, Measurements, TimedEvent } from '../types-hoist';
/**
 * Adds a measurement to the active transaction on the current global scope. You can optionally pass in a different span
 * as the 4th parameter.
 */
export declare function setMeasurement(name: string, value: number, unit: MeasurementUnit, activeSpan?: import("../types-hoist").Span | undefined): void;
/**
 * Convert timed events to measurements.
 */
export declare function timedEventsToMeasurements(events: TimedEvent[]): Measurements | undefined;
//# sourceMappingURL=measurement.d.ts.map