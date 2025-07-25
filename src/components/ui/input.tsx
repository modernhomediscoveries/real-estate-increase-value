import { cn } from "@/lib/utils";
import * as React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  maxValue?: number;
  shouldFormat?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      name,
      type = "text",
      maxValue,
      shouldFormat = false,
      onChange,
      value,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(
      value ? value.toString() : ""
    );
    const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

    // Sync with parent value
    React.useEffect(() => {
      setInternalValue(value ? value.toString() : "");
    }, [value]);

    // Optional formatter
    const formatNumber = (val: string) => {
      if (!shouldFormat) return val;
      const num = parseFloat(val.replace(/,/g, ""));
      if (isNaN(num)) return val;
      return num.toLocaleString();
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const rawVal = event.target.value.replace(/,/g, "");
      const name = event.target.name;
      setInternalValue(rawVal);

      const numVal = parseFloat(rawVal);

      // Always propagate typed value immediately
      onChange?.({
        ...event,
        target: {
          ...event.target,
          value: rawVal,
          name,
        },
      } as React.ChangeEvent<HTMLInputElement>);

      // If above maxValue, clamp after delay
      if (typeof maxValue === "number" && !isNaN(numVal) && numVal > maxValue) {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          setInternalValue(maxValue.toString());
          onChange?.({
            ...event,
            target: {
              ...event.target,
              value: maxValue.toString(),
              name,
            },
          } as React.ChangeEvent<HTMLInputElement>);
        }, 800);
      } else {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      }
    };

    return (
      <input
        type={type}
        className={cn(
          "h-10 w-40 sm:w-full font-bold rounded placeholder:text-gray-500 border px-4",
          className
        )}
        name={name}
        ref={ref}
        value={shouldFormat ? formatNumber(internalValue) : internalValue}
        onChange={handleChange}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
