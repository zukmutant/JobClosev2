export type TrustedBusinessContext = {
  businessId: string;
};

export const DEV_BUSINESS_ID = "11111111-1111-4111-8111-111111111111";

export function getTrustedBusinessContext(): TrustedBusinessContext {
  return {
    businessId: DEV_BUSINESS_ID,
  };
}
