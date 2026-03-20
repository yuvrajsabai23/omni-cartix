import Decimal from "decimal.js";

export const UK_STANDARD_VAT_RATE = new Decimal("0.20");
export const UK_REDUCED_VAT_RATE = new Decimal("0.05");
export const UK_ZERO_VAT_RATE = new Decimal("0.00");

export function calculateVAT(
  priceExVAT: Decimal | number | string,
  vatRate: Decimal | number | string = UK_STANDARD_VAT_RATE
) {
  const price = new Decimal(priceExVAT);
  const rate = new Decimal(vatRate);
  const vatAmount = price.mul(rate).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
  const priceIncVAT = price.add(vatAmount);
  return { vatAmount, priceIncVAT, priceExVAT: price, vatRate: rate };
}

export function priceIncVAT(
  priceExVAT: Decimal | number | string,
  vatRate: Decimal | number | string = UK_STANDARD_VAT_RATE
): Decimal {
  const { priceIncVAT: incVAT } = calculateVAT(priceExVAT, vatRate);
  return incVAT;
}

export function priceExVATFromInc(
  priceIncVAT: Decimal | number | string,
  vatRate: Decimal | number | string = UK_STANDARD_VAT_RATE
): Decimal {
  const price = new Decimal(priceIncVAT);
  const rate = new Decimal(vatRate);
  return price.div(rate.add(1)).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
}

export function formatGBP(amount: Decimal | number | string): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(Number(amount));
}

export function toStripePence(amount: Decimal | number | string): number {
  return Math.round(new Decimal(amount).mul(100).toNumber());
}

export function fromStripePence(pence: number): Decimal {
  return new Decimal(pence).div(100);
}

export function applyDiscount(
  amount: Decimal,
  discountType: "PERCENTAGE" | "FIXED",
  discountValue: Decimal
): Decimal {
  if (discountType === "PERCENTAGE") {
    const discount = amount.mul(discountValue.div(100));
    return amount.sub(discount).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
  }
  return Decimal.max(0, amount.sub(discountValue)).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
}
