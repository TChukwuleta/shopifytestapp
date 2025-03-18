import {
  reactExtension,
  BlockStack,
  Button,
  Text,
  useApi,
  Spinner,
  useSelectedPaymentOptions
} from "@shopify/ui-extensions-react/checkout";
import { useEffect, useState } from "react";

// 1. Choose an extension target
export default reactExtension("purchase.thank-you.block.render", () => (
  <Extension />
));


function Extension() {
  const options = useSelectedPaymentOptions();
  const { shop, checkoutToken } = useApi();
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const hasManualPayment = options.some((option) => option.type.toLowerCase() === 'manualpayment');
  const createInvoiceUrl = `https://6d87-102-89-23-165.ngrok-free.app/stores/JC52vAtXMKK2C8wyoXDPuGB1wAcUoHqFnzYdyNhEoEZV/plugins/shopify-v2/create-invoice?checkout_token=${checkoutToken.current}`;
  const checkoutUrl = `https://6d87-102-89-23-165.ngrok-free.app/stores/JC52vAtXMKK2C8wyoXDPuGB1wAcUoHqFnzYdyNhEoEZV/plugins/shopify-v2/checkout?checkout_token=${checkoutToken.current}`;

  console.log("Selected Payment Options:", options);

  useEffect(() => {
    if (!hasManualPayment) return;

    const fetchInvoice = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(createInvoiceUrl, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (response.ok) {
          setIsSuccess(true);
        }
      } catch (error) {
        console.error("Failed to create invoice:", error);
      } finally {
        setIsLoading(false);
      }
    };
    const timer = setTimeout(fetchInvoice, 2000);
    return () => clearTimeout(timer)
  }, [hasManualPayment]);

  if (!hasManualPayment || (!isLoading && !isSuccess)) return null;

  return (
    <BlockStack>
      {isLoading ? (
        <Spinner />
      ) : isSuccess ? (
        <>
          <Text>Shop name: {shop.name}</Text>
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
          <Button to={checkoutUrl} external>Complete Test Payment</Button>
        </>
      ) : null}
    </BlockStack>
  );
  
}
