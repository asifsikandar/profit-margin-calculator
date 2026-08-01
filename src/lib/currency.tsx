import { useSyncExternalStore } from "react";

export interface Currency {
  code: string;
  symbol: string;
  label: string;
}

export const CURRENCIES: Currency[] = [
  { code: "USD", symbol: "$", label: "US Dollar" },
  { code: "PKR", symbol: "₨", label: "Pakistani Rupee" },
  { code: "INR", symbol: "₹", label: "Indian Rupee" },
  { code: "EUR", symbol: "€", label: "Euro" },
  { code: "GBP", symbol: "£", label: "British Pound" },
  { code: "AED", symbol: "AED ", label: "UAE Dirham" },
];

const STORAGE_KEY = "profitcalc:currency";

let current: Currency = CURRENCIES[0]!;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export function getCurrency(): Currency {
  return current;
}

export function currencySymbol(): string {
  return current.symbol;
}

export function setCurrency(code: string) {
  const next = CURRENCIES.find((c) => c.code === code);
  if (!next || next.code === current.code) return;
  current = next;
  try {
    localStorage.setItem(STORAGE_KEY, next.code);
  } catch {
    /* ignore */
  }
  emit();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

let hydrated = false;
function hydrate() {
  if (hydrated) return;
  hydrated = true;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const next = CURRENCIES.find((c) => c.code === saved);
      if (next && next.code !== current.code) {
        current = next;
        emit();
      }
    }
  } catch {
    /* ignore */
  }
}

export function useCurrency(): Currency {
  const value = useSyncExternalStore(
    subscribe,
    () => {
      hydrate();
      return current;
    },
    () => CURRENCIES[0]!,
  );
  return value;
}

export function CurrencySelect({ className = "" }: { className?: string }) {
  const currency = useCurrency();
  return (
    <label className={"inline-flex items-center gap-1.5 " + className}>
      <span className="sr-only">Currency</span>
      <select
        value={currency.code}
        onChange={(e) => setCurrency(e.target.value)}
        aria-label="Select currency"
        className="rounded-full border border-white/15 bg-white/10 px-2.5 py-1.5 text-xs font-semibold text-white outline-none transition-colors hover:bg-white/15 focus:border-lime"
      >
        {CURRENCIES.map((c) => (
          <option key={c.code} value={c.code} className="text-ink">
            {c.symbol.trim()} {c.code}
          </option>
        ))}
      </select>
    </label>
  );
}
