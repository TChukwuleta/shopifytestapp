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
  const [errorMessage, setErrorMessage] = useState('');
  const baseUrl = "https://f6fc-102-89-40-2.ngrok-free.app/stores/2TznNK1VcTNAFYsxWg8Rt1dHW8d2rXwDCjJe6kNCvfRZ/plugins/shopify-v2";
  const hasManualPayment = options.some((option) => option.type.toLowerCase() === 'manualpayment');
  const checkoutUrl = `${baseUrl}/checkout?checkout_token=${checkoutToken.current}`;

  useEffect(() => {
    if (!hasManualPayment) return;
    const fetchInvoice = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${checkoutUrl}&redirect=false`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (response.ok) { 
          setIsSuccess(true);
        }
        else if (response.status !== 404) {
          const errorText = await response.text();
          console.log(errorText);
          setErrorMessage(`BTCPay Server Error: Failed to fetch invoice: ${errorText || response.statusText}`);
        }
      } catch (error) {
        setErrorMessage(`BTCPay Server Error: Failed to fetch invoice. ${error.message}`);
      } 
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
      {!isLoading && errorMessage && (
        <Text size="large" appearance="critical">{errorMessage}</Text>
      )}
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
