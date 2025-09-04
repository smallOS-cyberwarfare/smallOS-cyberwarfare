import { dsnToString } from './utils-hoist/dsn.js';
import { createEnvelope } from './utils-hoist/envelope.js';
import { dropUndefinedKeys } from './utils-hoist/object.js';

/**
 * Create envelope from check in item.
 */
function createCheckInEnvelope(
  checkIn,
  dynamicSamplingContext,
  metadata,
  tunnel,
  dsn,
) {
  const headers = {
    sent_at: new Date().toISOString(),
  };

  if (metadata && metadata.sdk) {
    headers.sdk = {
      name: metadata.sdk.name,
      version: metadata.sdk.version,
    };
  }

  if (!!tunnel && !!dsn) {
    headers.dsn = dsnToString(dsn);
  }

  if (dynamicSamplingContext) {
    headers.trace = dropUndefinedKeys(dynamicSamplingContext) ;
  }

  const item = createCheckInEnvelopeItem(checkIn);
  return createEnvelope(headers, [item]);
}

function createCheckInEnvelopeItem(checkIn) {
  const checkInHeaders = {
    type: 'check_in',
  };
  return [checkInHeaders, checkIn];
}

export { createCheckInEnvelope };
//# sourceMappingURL=checkin.js.map
