import {
  reactExtension,
  Banner,
  BlockStack,
  Checkbox,
  Text,
  useApi,
  useApplyAttributeChange,
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
  const applyAttributeChange = useApplyAttributeChange();
  const options = useSelectedPaymentOptions();
  const availableOptions = useAvailablePaymentOptions();

  
  console.log("Selected Payment Options:", options);
  console.log("Available Payment Options:", availableOptions);


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
    <BlockStack border={"dotted"} padding={"tight"}>
      <Banner title="bridgeext">
        {translate("welcome", {
          target: <Text emphasis="italic">{extension.target}</Text>,
        })}
      </Banner>


      <Text size="large" emphasis="bold">Selected Payment Options:</Text>
      {options.length > 0 ? (
        options.map((option, index) => (
          <BlockStack key={index} border="base" padding="tight">
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


      <Checkbox onChange={onCheckboxChange}>
        {translate("iWouldLikeAFreeGiftWithMyOrder")}
      </Checkbox>
    </BlockStack>
  );

  async function onCheckboxChange(isChecked) {
    // 4. Call the API to modify checkout
    const result = await applyAttributeChange({
      key: "requestedFreeGift",
      type: "updateAttribute",
      value: isChecked ? "yes" : "no",
    });
    console.log("applyAttributeChange result", result);
  }
}