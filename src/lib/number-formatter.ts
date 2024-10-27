import numeral from "numeral";

export function numberFormat(number: number | string, decimals?: number) {
  return numeral(number).format("0,000." + "0".repeat(decimals ?? 0));
}

export function numberFormatInt(number: number | string) {
  return numeral(number).format("0,000");
}

export function formatNumberInput(inputValue: string, decimals?: number) {
  if (!inputValue) return "0";
  if (inputValue[0] === ".") return "0".concat(inputValue);
  if (inputValue.charAt(inputValue.length - 1) === ".") {
    return inputValue;
  }
  // Remove all non-digit characters except the decimal point
  const cleanedValue = inputValue.replace(/[^\d.]/g, "").replace(/^0+/g, "");

  // Split the cleaned value into integer and decimal parts
  const [integerPart, decimalPart] = cleanedValue.split(".");

  // Format the integer part with space separators
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // Reconstruct the formatted number with the decimal part (if present)
  const formattedNumber = decimalPart
    ? `${formattedInteger}.${decimalPart.slice(0, decimals)}`
    : formattedInteger;

  return formattedNumber;
}

export function numberInterpret(value: string | number | undefined) {
  if (value == undefined) return 0;
  const sanitizedValue =
    typeof value === "string" ? value.replace(/,/g, "") : value;
  return typeof sanitizedValue === "string"
    ? Number(sanitizedValue)
    : sanitizedValue;
}

type handler = {
  (e: React.ChangeEvent<any>): void;
  <T_1 = string | React.ChangeEvent<any>>(
    field: T_1
  ): T_1 extends React.ChangeEvent<any>
    ? void
    : (e: string | React.ChangeEvent<any>) => void;
};
export function formatterInputHandlingChange(handleChange: handler) {
  return (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.value = formatNumberInput(e.target.value);
    handleChange(e);
  };
}

export function kFormat(number: string | number) {
  const n = Number(number);
  if (-1000 < n && n < 1000) return n.toFixed();
  if (Math.abs(n / 1000000000) >= 1)
    return Math.abs(n / 1000000000) > 9
      ? (n / 1000000000).toFixed() + "B"
      : (n / 1000000000).toFixed(1) + "B";
  if (Math.abs(n / 1000000) >= 1)
    return Math.abs(n / 1000000) > 9
      ? (n / 1000000).toFixed() + "M"
      : (n / 1000000).toFixed(1) + "M";
  return n / 1000 > 9
    ? (n / 1000).toFixed() + "K"
    : (n / 1000).toFixed(1) + "K";
}
