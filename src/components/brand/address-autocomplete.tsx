"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Loader2, Search } from "lucide-react";
import { cn } from "@/lib/cn";

export type AddressSuggestion = {
  id: string;
  value: string;
  unrestrictedValue: string;
  city: string | null;
  street: string | null;
  house: string | null;
  lat: number | null;
  lng: number | null;
  geoProvider: "dadata";
  geoPlaceId: string | null;
};

type AddressAutocompleteProps = {
  city: string | null;
  value: string;
  onChange: (value: string) => void;
  onSelect: (suggestion: AddressSuggestion) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
};

export function AddressAutocomplete({
  city,
  value,
  onChange,
  onSelect,
  placeholder = "Начните вводить улицу и дом",
  disabled = false,
  className,
}: AddressAutocompleteProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  useEffect(() => {
    const query = value.trim();
    const timer = window.setTimeout(async () => {
      if (disabled || query.length < 3) {
        setSuggestions([]);
        setLoading(false);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/geocoding/address-suggest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query, city }),
        });
        const data = (await response.json().catch(() => null)) as {
          suggestions?: AddressSuggestion[];
          error?: string;
        } | null;

        if (!response.ok) {
          setSuggestions([]);
          setError(data?.error ?? "Не удалось загрузить подсказки");
          return;
        }

        setSuggestions(data?.suggestions ?? []);
        setIsOpen(true);
      } catch {
        setSuggestions([]);
        setError("Не удалось загрузить подсказки");
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => window.clearTimeout(timer);
  }, [city, disabled, value]);

  function handleInput(value: string) {
    onChange(value);
    if (value.trim().length >= 3) setIsOpen(true);
  }

  function selectSuggestion(suggestion: AddressSuggestion) {
    onChange(suggestion.value || suggestion.unrestrictedValue);
    onSelect(suggestion);
    setIsOpen(false);
    setSuggestions([]);
    setError(null);
  }

  const showDropdown = isOpen && !disabled && (loading || error || suggestions.length > 0 || value.trim().length >= 3);

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold shadow-sm shadow-slate-900/[0.02] focus-within:border-blue-500">
        {loading ? <Loader2 className="h-4 w-4 animate-spin text-blue-600" /> : <Search className="h-4 w-4 text-slate-400" />}
        <input
          className="min-w-0 flex-1 bg-transparent text-slate-900 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed"
          autoComplete="street-address"
          disabled={disabled}
          placeholder={disabled ? "Сначала выберите город" : placeholder}
          value={value}
          onFocus={() => setIsOpen(true)}
          onChange={(event) => handleInput(event.target.value)}
        />
      </div>

      {showDropdown ? (
        <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-30 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10">
          {loading ? (
            <div className="px-4 py-3 text-sm font-bold text-slate-500">Ищем адрес...</div>
          ) : null}

          {!loading && error ? (
            <div className="px-4 py-3 text-sm font-bold text-amber-700">
              {error === "Геокодинг временно недоступен"
                ? "Подсказки адресов временно недоступны, можно ввести адрес вручную"
                : error}
            </div>
          ) : null}

          {!loading && !error && suggestions.length === 0 ? (
            <div className="px-4 py-3 text-sm font-bold text-slate-500">Ничего не найдено</div>
          ) : null}

          {!loading && !error ? (
            <div className="max-h-64 overflow-y-auto py-1">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  className="flex w-full items-start gap-3 px-4 py-3 text-left text-sm hover:bg-blue-50"
                  type="button"
                  onClick={() => selectSuggestion(suggestion)}
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                  <span>
                    <span className="block font-extrabold text-slate-900">{suggestion.value}</span>
                    {suggestion.unrestrictedValue !== suggestion.value ? (
                      <span className="mt-0.5 block text-xs font-bold text-slate-400">{suggestion.unrestrictedValue}</span>
                    ) : null}
                  </span>
                </button>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}

      <p className="mt-1 text-xs font-bold text-slate-400">Начните вводить улицу и дом. Если подсказки недоступны, адрес можно сохранить вручную.</p>
    </div>
  );
}
