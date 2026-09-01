import { useMemo, useState } from "react";
import { MdSwapHoriz } from "react-icons/md";
import { useExchangeRates } from "../../hooks/useExchangeRates";
import { CURRENCIES } from "../../constants/currencies";
import { formatCurrency } from "../../utils/custom";

interface CurrencyConverterProps {
  defaultFrom?: string;
  defaultTo?: string;
}

const nameFor = (code: string) =>
  CURRENCIES.find((c) => c.code === code)?.name ?? code;

export default function CurrencyConverter({
  defaultFrom = "USD",
  defaultTo = "EUR",
}: CurrencyConverterProps): JSX.Element {
  const [from, setFrom] = useState(defaultFrom.toUpperCase());
  const [to, setTo] = useState(defaultTo.toUpperCase());
  const [amount, setAmount] = useState(1);

  const { data, isLoading, isError, error, refetch } = useExchangeRates(from);

  // Ensure the defaults are always selectable even if outside the curated list.
  const options = useMemo(() => {
    const codes = new Set([from, to, ...CURRENCIES.map((c) => c.code)]);
    return Array.from(codes)
      .map((code) => ({ code, name: nameFor(code) }))
      .sort((a, b) => a.code.localeCompare(b.code));
  }, [from, to]);

  const rate = data?.rates[to];
  const result = rate != null ? amount * rate : null;

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  const selectClass =
    "px-3 py-2.5 rounded-md bg-surface text-fg border border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary";

  return (
    <div className="bg-surface border border-border rounded-xl p-5">
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto_auto] gap-3 items-center">
        <input
          type="number"
          min={0}
          value={amount}
          onChange={(e) => setAmount(Math.max(0, Number(e.target.value) || 0))}
          aria-label="Amount"
          className="px-4 py-2.5 rounded-md bg-surface text-fg border border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary"
        />
        <select
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          aria-label="From currency"
          className={selectClass}
        >
          {options.map((o) => (
            <option key={o.code} value={o.code}>
              {o.code}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={swap}
          aria-label="Swap currencies"
          className="w-11 h-11 mx-auto rounded-xl bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20"
        >
          <MdSwapHoriz className="text-xl" />
        </button>
        <select
          value={to}
          onChange={(e) => setTo(e.target.value)}
          aria-label="To currency"
          className={selectClass}
        >
          {options.map((o) => (
            <option key={o.code} value={o.code}>
              {o.code}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4">
        {isLoading && (
          <div className="h-8 w-2/3 bg-surface-2 rounded animate-pulse" />
        )}

        {isError && !isLoading && (
          <div className="flex items-center gap-3">
            <p className="text-muted">
              {(error as Error)?.message || "Rates are unavailable right now."}
            </p>
            <button onClick={() => refetch()} className="text-primary font-medium hover:underline">
              Retry
            </button>
          </div>
        )}

        {!isLoading && !isError && (
          <div>
            {result !== null ? (
              <>
                <p className="text-3xl font-semibold text-fg">
                  {formatCurrency(result, to)}
                </p>
                {rate != null && (
                  <p className="text-sm text-muted mt-1">
                    1 {from} = {rate.toFixed(4)} {to} · {nameFor(to)}
                  </p>
                )}
              </>
            ) : (
              <p className="text-muted">
                Conversion to {to} isn't available.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
