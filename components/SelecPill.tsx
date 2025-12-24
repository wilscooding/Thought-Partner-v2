"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type SelectPillProps = {
    label: string;
    placeholder: string;
    value: string;
    options: readonly string[];
    onChange: (next: string) => void;
};

export default function SelectPill({
    label,
    placeholder,
    value,
    options,
    onChange,
}: SelectPillProps) {
    const wrapRef = useRef<HTMLDivElement | null>(null);
    const btnRef = useRef<HTMLButtonElement | null>(null);
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState<number>(() => {
        const i = options.findIndex((o) => o === value);
        return i >= 0 ? i : 0;
    });

    const display = value || placeholder;

    const selectedIndex = useMemo(() => {
        const i = options.findIndex((o) => o === value);
        return i >= 0 ? i : -1;
    }, [options, value]);

    useEffect(() => {
        if (!open) return;

        const onDocMouseDown = (e: MouseEvent) => {
            if (!wrapRef.current) return;
            if (!wrapRef.current.contains(e.target as Node)) setOpen(false);
        };

        const onDocKeyDown = (e: KeyboardEvent) => {
            if (!open) return;

            if (e.key === "Escape") {
                e.preventDefault();
                setOpen(false);
                btnRef.current?.focus();
            } else if (e.key === "ArrowDown") {
                e.preventDefault();
                setActiveIndex((i) => Math.min(i + 1, options.length - 1));
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActiveIndex((i) => Math.max(i - 1, 0));
            } else if (e.key === "Enter") {
                e.preventDefault();
                const chosen = options[activeIndex];
                if (chosen) onChange(chosen);
                setOpen(false);
                btnRef.current?.focus();
            }
        };

        document.addEventListener("mousedown", onDocMouseDown);
        document.addEventListener("keydown", onDocKeyDown);
        return () => {
            document.removeEventListener("mousedown", onDocMouseDown);
            document.removeEventListener("keydown", onDocKeyDown);
        };
    }, [open, activeIndex, options, onChange]);

    useEffect(() => {
        if (!open) return;
        // start highlight on selected item if any
        setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
    }, [open, selectedIndex]);

    return (
        <div ref={wrapRef} className="tp-select-wrap">
            <label className="setup-label">{label}</label>

            <button
                ref={btnRef}
                type="button"
                className={`up-select-pill ${!value ? "is-placeholder" : ""}`}
                aria-haspopup="listbox"
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
            >
                <span className="tp-select-text">{display}</span>

                <svg
                    className={`up-select-arrow ${open ? "is-open" : ""}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                >
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </button>

            {open && (
                <ul className="tp-select-menu" role="listbox" aria-label={label}>
                    {/* placeholder row */}
                    <li
                        className={`tp-select-option ${value === "" ? "is-selected" : ""} ${activeIndex === -1 ? "is-active" : ""
                            }`}
                        role="option"
                        aria-selected={value === ""}
                        onMouseEnter={() => setActiveIndex(0)}
                        onClick={() => {
                            onChange("");
                            setOpen(false);
                            btnRef.current?.focus();
                        }}
                    >
                        {placeholder}
                    </li>

                    {options.map((opt, idx) => {
                        const i = idx; // active index for options list
                        const isSelected = opt === value;
                        const isActive = activeIndex === i;

                        return (
                            <li
                                key={opt}
                                className={`tp-select-option ${isSelected ? "is-selected" : ""} ${isActive ? "is-active" : ""
                                    }`}
                                role="option"
                                aria-selected={isSelected}
                                onMouseEnter={() => setActiveIndex(i)}
                                onClick={() => {
                                    onChange(opt);
                                    setOpen(false);
                                    btnRef.current?.focus();
                                }}
                            >
                                {opt}
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
