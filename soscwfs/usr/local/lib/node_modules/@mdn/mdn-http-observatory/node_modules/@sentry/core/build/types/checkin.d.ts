import type { CheckInEnvelope, DsnComponents, DynamicSamplingContext, SdkMetadata, SerializedCheckIn } from './types-hoist';
/**
 * Create envelope from check in item.
 */
export declare function createCheckInEnvelope(checkIn: SerializedCheckIn, dynamicSamplingContext?: Partial<DynamicSamplingContext>, metadata?: SdkMetadata, tunnel?: string, dsn?: DsnComponents): CheckInEnvelope;
//# sourceMappingURL=checkin.d.ts.map