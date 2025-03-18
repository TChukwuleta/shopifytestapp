import { useEffect, useRef } from "react";
import {
  reactExtension,
  Banner,
  BlockStack,
  Button,
  Text,
  useApi,
  useInstructions, 
  useTranslate,
  useSelectedPaymentOptions,
  useAvailablePaymentOptions,
} from "@shopify/ui-extensions-react/checkout";

// 1. Choose an extension target
export default reactExtension("purchase.thank-you.block.render", () => (
  <Extension />
));

function Extension() {
  const translate = useTranslate();
  const { extension } = useApi();
  const instructions = useInstructions();
  const options = useSelectedPaymentOptions();
  const availableOptions = useAvailablePaymentOptions();

  const linkRef = useRef(null);
  console.log("Selected Payment Options:", options);
  console.log("Available Payment Options:", availableOptions);
  const hasManualPayment = options.some((option) => option.type.toLowerCase() === "manualpayment");
  const appUrl = `https://x.com/`;

  useEffect(() => {
    // Set timeout to click the link after 2 seconds
    const timer = setTimeout(() => {
      // Check if the ref is attached to a DOM element
      console.log("try to click")
      if (linkRef.current) {
        // Programmatically click the link
        linkRef.current.click();
      }
    }, 2000);
    
    // Clean up the timer if the component unmounts
    return () => clearTimeout(timer);
  }, []);

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

      <Link to="https://www.shopify.ca/climate/sustainability-fund">
      Sustainability fund
    </Link>

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
      <Link
        ref={linkRef}
        url="https://www.shopify.ca/climate/sustainability-fund"
        external={true}
        monochrome
        removeUnderline
        style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
      >
        Sustainability fund
      </Link>
    </BlockStack>
  );
}