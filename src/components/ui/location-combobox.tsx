import { useId, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { PiMapPinDuotone } from "react-icons/pi";
import { getCountries } from "../../api/index.api";
import { searchLocations } from "../../api/locations.api";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { QueryKey } from "../../utils/queryKeys";
import { inputClass } from "../../constants/formStyles";
import { cn } from "../../lib/cn";

interface LocationComboboxProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  kind?: "place" | "country";
  className?: string;
}

interface Option {
  key: string;
  value: string;
  primary: string;
  secondary: string | null;
  icon: ReactNode;
}

const DEBOUNCE_MS = 250;
const MIN_CITY_QUERY = 2;

const fold = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

const startsAWord = (name: string, query: string) =>
  name.split(/[\s-]+/).some((_, i, words) => words.slice(i).join(" ").startsWith(query));

function Highlight({ text, query }: { text: string; query: string }): JSX.Element {
  const at = query ? text.toLowerCase().indexOf(query.toLowerCase().trim()) : -1;
  if (at < 0 || !query.trim()) return <>{text}</>;
  const end = at + query.trim().length;
  return (
    <>
      {text.slice(0, at)}
      <span className="font-semibold text-fg">{text.slice(at, end)}</span>
      {text.slice(end)}
    </>
  );
}


export function LocationCombobox({
  id,
  value,
  onChange,
  placeholder,
  required,
  kind = "place",
  className,
}: LocationComboboxProps): JSX.Element {
  const listId = useId();
  const listRef = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  const query = fold(value);
  const debounced = useDebouncedValue(value.trim(), DEBOUNCE_MS);
  const wantCities = kind === "place" && open && debounced.length >= MIN_CITY_QUERY;

  const countries = useQuery({ queryKey: [QueryKey.getCountries], queryFn: getCountries, staleTime: Infinity });
  const cities = useQuery({
    queryKey: [QueryKey.locations, fold(debounced)],
    queryFn: ({ signal }) => searchLocations(debounced, signal),
    enabled: wantCities,
    staleTime: 24 * 60 * 60 * 1000,
    retry: 0,
    placeholderData: keepPreviousData,
  });

  const options = useMemo<Option[]>(() => {
    if (!query) return [];
    const countryLimit = kind === "country" ? 8 : 3;
    const rank = (name: string) => {
      const n = fold(name);
      if (n.startsWith(query)) return 0;
      return startsAWord(n, query) ? 1 : -1;
    };
    const ranked = (countries.data ?? [])
      .map((c) => ({ c, r: rank(c.name) }))
      .filter(({ r }) => r >= 0)
      .sort((a, b) => a.r - b.r || b.c.population - a.c.population)
      .slice(0, countryLimit);
    const toOption = ({ c }: (typeof ranked)[number]): Option => ({
        key: `country-${c.cca3}`,
        value: c.name,
        primary: c.name,
        secondary: kind === "country" ? c.region : `Country · ${c.region}`,
        icon: <span className="text-base leading-none">{c.flagEmoji ?? "🏳️"}</span>,
    });


    const leading = ranked.filter(({ r }) => r === 0).map(toOption);
    const trailing = ranked.filter(({ r }) => r > 0).map(toOption);
    if (kind === "country" || query.length < MIN_CITY_QUERY) return [...leading, ...trailing];


    const cityOptions: Option[] = (cities.data ?? [])
      .filter((p) => startsAWord(fold(p.name), query) || fold(`${p.name}, ${p.country ?? ""}`).startsWith(query))
      .map((p) => ({
        key: `city-${p.id}`,
        value: p.country ? `${p.name}, ${p.country}` : p.name,
        primary: p.name,
        secondary: [p.region, p.country].filter(Boolean).join(", ") || null,
        icon: <PiMapPinDuotone className="text-base text-sea" />,
      }));
    return [...leading, ...cityOptions, ...trailing];
  }, [query, kind, countries.data, cities.data]);

  const searching = wantCities && (cities.isFetching || debounced !== value.trim());
  const cityError = kind === "place" && cities.isError;
  const status =
    options.length > 0
      ? null
      : searching
        ? "Searching places…"
        : cityError
          ? "Couldn't search cities right now. You can still type a place."
          : query.length >= (kind === "country" ? 1 : MIN_CITY_QUERY)
            ? "No matches. You can still use what you typed."
            : null;
  const showList = open && (options.length > 0 || status !== null);


  useLayoutEffect(() => {
    const list = listRef.current;
    const item = active >= 0 ? (list?.children[active] as HTMLElement | undefined) : undefined;
    if (!list || !item) return;
    if (item.offsetTop < list.scrollTop) list.scrollTop = item.offsetTop;
    else if (item.offsetTop + item.offsetHeight > list.scrollTop + list.clientHeight)
      list.scrollTop = item.offsetTop + item.offsetHeight - list.clientHeight;
  }, [active]);

  const choose = (option: Option) => {
    onChange(option.value);
    setOpen(false);
    setActive(-1);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) return setOpen(true);
      if (!options.length) return;
      const step = e.key === "ArrowDown" ? 1 : -1;
      setActive((i) => (i + step + options.length) % options.length);
    } else if (e.key === "Enter" && showList && active >= 0 && options[active]) {
      e.preventDefault(); // choose the suggestion instead of submitting the form
      choose(options[active]);
    } else if (e.key === "Escape" && showList) {
      e.preventDefault();
      setOpen(false);
      setActive(-1);
    }
  };

  const optionId = (i: number) => `${listId}-option-${i}`;

  return (
    <div className={cn("relative", className)}>
      <input
        id={id}
        type="text"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={showList}
        aria-controls={listId}
        aria-activedescendant={showList && active >= 0 ? optionId(active) : undefined}
        autoComplete="off"
        spellCheck={false}
        className={inputClass}
        value={value}
        placeholder={placeholder}
        required={required}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
          setActive(-1);
        }}
        onKeyDown={onKeyDown}
        onBlur={() => {
          setOpen(false);
          setActive(-1);
        }}
      />


      <ul
        ref={listRef}
        id={listId}
        role="listbox"
        aria-label="Suggestions"
        hidden={!showList}
        className="z-30 mt-1.5 max-h-72 w-full overflow-y-auto overscroll-contain rounded-xl border border-border bg-surface p-1 shadow-card md:absolute"
      >
        {options.map((o, i) => (
          <li
            key={o.key}
            id={optionId(i)}
            role="option"
            aria-selected={i === active}
            aria-label={o.secondary ? `${o.primary}, ${o.secondary}` : o.primary}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => choose(o)}
            onMouseMove={() => i !== active && setActive(i)}
            className={cn(
              "flex cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2",
              i === active ? "bg-surface-2" : ""
            )}
          >
            <span
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                o.key.startsWith("city") ? "bg-sea-soft" : "bg-sand-soft"
              )}
              aria-hidden="true"
            >
              {o.icon}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm text-fg/90">
                <Highlight text={o.primary} query={value} />
              </span>
              {o.secondary && <span className="block truncate text-xs text-muted">{o.secondary}</span>}
            </span>
          </li>
        ))}
        {status && (
          <li role="presentation" className="px-3 py-2.5 text-sm text-muted">
            {status}
          </li>
        )}
      </ul>

      <p className="sr-only" aria-live="polite">
        {showList && options.length > 0
          ? `${options.length} suggestion${options.length === 1 ? "" : "s"} available. Use the up and down arrows to choose.`
          : ""}
      </p>
    </div>
  );
}
