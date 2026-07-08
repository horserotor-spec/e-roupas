import React, { useState, useEffect } from "react";
import { Input } from "./input";

interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value: number;
  onChange: (v: number) => void;
  className?: string;
  placeholder?: string;
}

export function CurrencyInput({
  value,
  onChange,
  className,
  placeholder = "R$ 0,00",
  ...props
}: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  // Sync internal display value when external value changes
  useEffect(() => {
    if (isFocused) return;
    
    if (value === undefined || value === null) {
      setDisplayValue("");
    } else {
      setDisplayValue(
        value.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })
      );
    }
  }, [value, isFocused]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value;
    
    // Remove characters that aren't digits, commas or dots
    raw = raw.replace(/[^0-9,.]/g, "");
    
    // Normalize dots to commas
    raw = raw.replace(/\./g, ",");
    
    // Prevent multiple commas
    const parts = raw.split(",");
    if (parts.length > 2) {
      raw = parts[0] + "," + parts.slice(1).join("");
    }

    setDisplayValue(raw);

    const parsed = parseFloat(raw.replace(",", ".")) || 0;
    onChange(parsed);
  };

  const handleFocus = () => {
    setIsFocused(true);
    // When focusing, show just the decimal number with comma, e.g. "23,50"
    if (value !== undefined && value !== null) {
      setDisplayValue(
        value.toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      );
    } else {
      setDisplayValue("");
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    const parsed = parseFloat(displayValue.replace(",", ".")) || 0;
    setDisplayValue(
      parsed.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })
    );
    onChange(parsed);
  };

  return (
    <Input
      type="text"
      value={displayValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      placeholder={placeholder}
      className={className}
      {...props}
    />
  );
}
