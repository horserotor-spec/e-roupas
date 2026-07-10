import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { I as Input } from "./input-D7a6tjwM.mjs";
function CurrencyInput({
  value,
  onChange,
  className,
  placeholder = "R$ 0,00",
  ...props
}) {
  const [displayValue, setDisplayValue] = reactExports.useState("");
  const [isFocused, setIsFocused] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (isFocused) return;
    if (value === void 0 || value === null) {
      setDisplayValue("");
    } else {
      setDisplayValue(
        value.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL"
        })
      );
    }
  }, [value, isFocused]);
  const handleChange = (e) => {
    let raw = e.target.value;
    raw = raw.replace(/[^0-9,.]/g, "");
    raw = raw.replace(/\./g, ",");
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
    if (value !== void 0 && value !== null) {
      setDisplayValue(
        value.toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
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
        currency: "BRL"
      })
    );
    onChange(parsed);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Input,
    {
      type: "text",
      value: displayValue,
      onChange: handleChange,
      onFocus: handleFocus,
      onBlur: handleBlur,
      placeholder,
      className,
      ...props
    }
  );
}
export {
  CurrencyInput as C
};
