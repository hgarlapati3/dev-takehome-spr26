// import React from "react";

// type DropdownVariant = "primary";

// export interface DropdownOption {
//   label: string;
//   value: string;
// }

// interface DropdownProps {
//   variant?: DropdownVariant;
//   value?: string;
//   label?: string;
//   options: DropdownOption[];
//   onChange?: React.ChangeEventHandler<HTMLSelectElement>;
// }

// export default function Dropdown({
//   variant = "primary",
//   value,
//   label,
//   options,
//   onChange,
// }: DropdownProps) {
//   const baseStyles = "py-2 px-4 rounded-md transition w-full";

//   const variantStyles: Record<DropdownVariant, string> = {
//     primary: "bg-primary-fill outline-gray-stroke text-gray-text",
//   };

//   return (
//     <div>
//       {label && <label className="block">{label}</label>}
//       <select
//         value={value}
//         onChange={onChange}
//         className={`${baseStyles} ${variantStyles[variant]}`}
//       >
//         {options.map((opt) => (
//           <option key={opt.value} value={opt.value}>
//             {opt.label}
//           </option>
//         ))}
//       </select>
//     </div>
//   );
// }


// "use client";

// import React, { useEffect, useMemo, useRef, useState } from "react";

// type DropdownVariant = "primary";

// export interface DropdownOption {
//   label: string;
//   value: string;
// }

// interface DropdownProps {
//   variant?: DropdownVariant;
//   value?: string; // selected value (optional)
//   label?: string; // optional label above
//   placeholder?: string; // e.g. "Status"
//   options: DropdownOption[];
//   disabled?: boolean;
//   size?: "md" | "lg";
//   onChange: (value: string) => void; // IMPORTANT: string, not event
// }

// const statusMeta: Record<
//   string,
//   { dotClass: string; pillClass: string; textClass: string }
// > = {
//   pending: {
//     dotClass: "bg-orange-500",
//     pillClass: "bg-orange-100",
//     textClass: "text-orange-800",
//   },
//   approved: {
//     dotClass: "bg-yellow-500",
//     pillClass: "bg-yellow-100",
//     textClass: "text-yellow-800",
//   },
//   completed: {
//     dotClass: "bg-green-500",
//     pillClass: "bg-green-100",
//     textClass: "text-green-800",
//   },
//   rejected: {
//     dotClass: "bg-red-500",
//     pillClass: "bg-red-100",
//     textClass: "text-red-800",
//   },
// };

// function Pill({ value, label }: { value: string; label: string }) {
//   const meta = statusMeta[value] ?? {
//     dotClass: "bg-gray-400",
//     pillClass: "bg-gray-100",
//     textClass: "text-gray-700",
//   };

//   return (
//     <span
//       className={[
//         "inline-flex items-center gap-2",
//         "px-3 py-1 rounded-full",
//         meta.pillClass,
//       ].join(" ")}
//     >
//       <span className={`h-2 w-2 rounded-full ${meta.dotClass}`} />
//       <span className={`text-sm font-medium ${meta.textClass}`}>{label}</span>
//     </span>
//   );
// }

// export default function Dropdown({
//   variant = "primary",
//   value,
//   label,
//   placeholder = "Select",
//   options,
//   disabled = false,
//   size = "md",
//   onChange,
// }: DropdownProps) {
//   const [open, setOpen] = useState(false);
//   const rootRef = useRef<HTMLDivElement | null>(null);

//   const selected = useMemo(
//     () => options.find((o) => o.value === value) || null,
//     [options, value]
//   );

//   const variantStyles: Record<DropdownVariant, string> = {
//     primary: "bg-white border border-gray-stroke text-gray-text",
//   };

//   const heightClass = size === "lg" ? "h-12" : "h-10";
//   const widthClass = size === "lg" ? "w-80" : "w-56";

//   useEffect(() => {
//     const onDocClick = (e: MouseEvent) => {
//       if (!rootRef.current) return;
//       if (!rootRef.current.contains(e.target as Node)) setOpen(false);
//     };
//     document.addEventListener("mousedown", onDocClick);
//     return () => document.removeEventListener("mousedown", onDocClick);
//   }, []);

//   return (
//     <div ref={rootRef} className="relative inline-block">
//       {label && <label className="block mb-1 text-gray-text">{label}</label>}

//       <button
//         type="button"
//         disabled={disabled}
//         onClick={() => !disabled && setOpen((p) => !p)}
//         className={[
//           "flex items-center justify-between gap-3",
//           heightClass,
//           widthClass,
//           "px-4 rounded-md transition",
//           variantStyles[variant],
//           disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
//           open ? "border-blue-600" : "",
//         ].join(" ")}
//       >
//         <div className="flex items-center gap-2">
//           {selected ? (
//             <Pill value={selected.value} label={selected.label} />
//           ) : (
//             <span className="text-gray-400">{placeholder}</span>
//           )}
//         </div>

//         <span className="text-gray-500">▾</span>
//       </button>

//       {open && (
//         <div className="absolute right-0 mt-2 w-full rounded-lg border border-gray-stroke bg-white shadow-lg z-50 p-3">
//           <div className="flex flex-col gap-3">
//             {options.map((o) => (
//               <button
//                 key={o.value}
//                 type="button"
//                 className="flex justify-start"
//                 onClick={() => {
//                   onChange(o.value);
//                   setOpen(false);
//                 }}
//               >
//                 <Pill value={o.value} label={o.label} />
//               </button>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type DropdownVariant = "primary";

export interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownProps {
  variant?: DropdownVariant;
  value?: string;
  label?: string;
  placeholder?: string;
  options: DropdownOption[];
  disabled?: boolean;
  size?: "md" | "lg";
  onChange: (value: string) => void;
}

const statusMeta: Record<
  string,
  { dotClass: string; pillClass: string; textClass: string }
> = {
  pending: {
    dotClass: "bg-orange-500",
    pillClass: "bg-orange-100",
    textClass: "text-orange-800",
  },
  approved: {
    dotClass: "bg-yellow-500",
    pillClass: "bg-yellow-100",
    textClass: "text-yellow-800",
  },
  completed: {
    dotClass: "bg-green-500",
    pillClass: "bg-green-100",
    textClass: "text-green-800",
  },
  rejected: {
    dotClass: "bg-red-500",
    pillClass: "bg-red-100",
    textClass: "text-red-800",
  },
};

export function StatusPill({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  const meta = statusMeta[value] ?? {
    dotClass: "bg-gray-400",
    pillClass: "bg-gray-100",
    textClass: "text-gray-700",
  };

  return (
    <span
      className={[
        "inline-flex items-center gap-2",
        "px-3 py-1 rounded-full",
        meta.pillClass,
      ].join(" ")}
    >
      <span className={`h-2 w-2 rounded-full ${meta.dotClass}`} />
      <span className={`text-sm font-medium ${meta.textClass}`}>{label}</span>
    </span>
  );
}

export default function Dropdown({
  variant = "primary",
  value,
  label,
  placeholder = "Select",
  options,
  disabled = false,
  size = "md",
  onChange,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const selected = useMemo(
    () => options.find((o) => o.value === value) || null,
    [options, value]
  );

  const variantStyles: Record<DropdownVariant, string> = {
    primary: "bg-white border border-gray-stroke text-gray-text",
  };

  const heightClass = size === "lg" ? "h-12" : "h-10";
  const widthClass = size === "lg" ? "w-80" : "w-56";

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div ref={rootRef} className="relative inline-block">
      {label && <label className="block mb-1 text-gray-text">{label}</label>}

      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((p) => !p)}
        className={[
          "flex items-center justify-between gap-3",
          heightClass,
          widthClass,
          "px-4 rounded-md transition",
          variantStyles[variant],
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
          open ? "border-blue-600" : "",
        ].join(" ")}
      >
        <div className="flex items-center gap-2">
          {selected ? (
            <StatusPill value={selected.value} label={selected.label} />
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
        </div>

        <span className="text-gray-500">▾</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-full rounded-lg border border-gray-stroke bg-white shadow-lg z-50 p-3">
          <div className="flex flex-col gap-3">
            {options.map((o) => (
              <button
                key={o.value}
                type="button"
                className="flex justify-start"
                onClick={() => {
                  onChange(o.value);
                  setOpen(false);
                }}
              >
                <StatusPill value={o.value} label={o.label} />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
