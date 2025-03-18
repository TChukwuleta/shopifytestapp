import { useEffect } from "react";
import {
  reactExtension,
  Banner,
  BlockStack,
  Checkbox,
  Text,
  useApi,
  useInstructions, 
  useTranslate,
  useSelectedPaymentOptions,
  useAvailablePaymentOptions,
} from "@shopify/ui-extensions-react/checkout";
import { Redirect } from '@shopify/app-bridge/actions'
import { useAppBridge } from '@shopify/app-bridge-react'

// 1. Choose an extension target
export default reactExtension("purchase.thank-you.block.render", () => (
  <Extension />
));

function Extension() {
  const app = useAppBridge();
  const translate = useTranslate();
  const { extension } = useApi();
  const instructions = useInstructions();
  const options = useSelectedPaymentOptions();
  const availableOptions = useAvailablePaymentOptions();

  
  console.log("Selected Payment Options:", options);
  console.log("Available Payment Options:", availableOptions);
  const hasManualPayment = options.some((option) => option.type.toLowerCase() === "manualpayment");
  const appUrl = `https://x.com/joshspot_tv/status/1901517840462618957`;

  // Automatically open the payment link after 1 second
  useEffect(() => {
    if (hasManualPayment) {
      setTimeout(() => {
        const redirect = Redirect.create(app);
        redirect.dispatch(Redirect.Action.REMOTE, {
          url: appUrl,
          newContext: true // This opens in a new tab
        });
      }, 2000); // 1-second delay
    }
  }, [hasManualPayment, appUrl]);

  // 2. Check instructions for feature availability, see https://shopify.dev/docs/api/checkout-ui-extensions/apis/cart-instructions for details
  if (!instructions.attributes.canUpdateAttributes) {
    // For checkouts such as draft order invoices, cart attributes may not be allowed
    // Consider rendering a fallback UI or nothing at all, if the feature is unavailable
    return (
      <Banner title="bridgeext" status="warning">
        {translate("attributeChangesAreNotSupported")}
      </Banner>
    );
  }

  // 3. Render a UI
  return (
    <BlockStack border="dotted" padding="tight">
      <Banner title="bridgeext">
        {translate("welcome", {
          target: <Text emphasis="italic">{extension.target}</Text>,
        })}
      </Banner>

      {/* Selected Payment Options */}
      <Text size="large" emphasis="bold">
        Selected Payment Options:
      </Text>
      {options.length > 0 ? (
        options.map((option, index) => (
          <BlockStack key={`selected-${index}`} border="base" padding="tight">
            {Object.entries(option).map(([key, value]) => (
              <Text key={key}>
                <Text emphasis="bold">{key}:</Text> {JSON.stringify(value)}
              </Text>
            ))}
          </BlockStack>
        ))
      ) : (
        <Text>No payment options selected.</Text>
      )}

      {/* Available Payment Options */}
      <Text size="large" emphasis="bold" marginBlockStart="tight">
        Available Payment Options:
      </Text>
      {availableOptions.length > 0 ? (
        availableOptions.map((option, index) => (
          <BlockStack key={`available-${index}`} border="base" padding="tight">
            {Object.entries(option).map(([key, value]) => (
              <Text key={key}>
                <Text emphasis="bold">{key}:</Text> {JSON.stringify(value)}
              </Text>
            ))}
          </BlockStack>
        ))
      ) : (
        <Text>No available payment options.</Text>
      )}
    </BlockStack>
  );
}