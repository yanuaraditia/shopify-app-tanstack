import '@shopify/shopify-api/adapters/web-api';
import {setAbstractRuntimeString} from '@shopify/shopify-api/runtime';

import {setAppBridgeUrlOverride} from '../../authenticate/helpers';

setAbstractRuntimeString(() => {
  return `TanStack Start (Nitro)`;
});

/* eslint-disable no-process-env */
if (process.env.APP_BRIDGE_URL) {
  setAppBridgeUrlOverride(process.env.APP_BRIDGE_URL);
}
/* eslint-enable no-process-env */
