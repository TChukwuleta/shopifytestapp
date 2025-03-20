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
  const baseUrl = "https://9a81-102-89-33-186.ngrok-free.app/stores/6CdE4qd1Cbq44UDeCfZmX9siEnvKxcxLrreDqTfomCJ1/plugins/shopify-v2";
  const hasManualPayment = options.some((option) => option.type.toLowerCase() === 'manualpayment');
  const createInvoiceUrl = `${baseUrl}/create-invoice?checkout_token=${checkoutToken.current}`;
  const checkoutUrl = `${baseUrl}/checkout?checkout_token=${checkoutToken.current}`;

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
      } catch (error) {} 
      finally {
        setIsLoading(false);
      }
    };
    const timer = setTimeout(fetchInvoice, 1000);
    return () => clearTimeout(timer)
  }, [hasManualPayment]);

  if (!hasManualPayment) return null;

  return (
    <BlockStack>
      {isLoading && <Spinner />}
      {!isLoading && isSuccess && (
        <>
          <Text>Shop name: {shop.name}</Text>
          <Text size="large" alignment="center" bold>Review and pay using BTCPay Server!</Text>
          <Text>Please review your order and complete the payment using BTCPay Server.</Text>
          <Button to={checkoutUrl} external>Complete Payment</Button>
        </>
      )}
    </BlockStack>
  );
  
}
