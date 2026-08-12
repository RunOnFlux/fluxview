import { cn } from "@/lib/utils";

/**
 * A one-of-N choice rendered as adjacent segments, with every option always
 * labelled. Preferred over a switch whenever the two states are two different
 * things ("search by name" vs "search by ZelID") rather than one thing being
 * on or off — a switch leaves its off state unlabelled, so the alternative has
 * to be guessed.
 *
 * Built on native radio inputs, so arrow-key navigation, focus and screen
 * reader announcements come for free.
 */
const SegmentedControl = ({ name, value, onChange, options, disabled = false, disabledTitle, label, className }) => (
  <div
    role="group"
    aria-label={label}
    title={disabled ? disabledTitle : undefined}
    className={cn("inline-flex items-center p-[3px] rounded-[10px] bg-[#14101d] border border-white/20", disabled && "opacity-50", className)}
  >
    {options.map((option) => {
      const selected = option.value === value;
      return (
        <label key={option.value} className={cn("relative", disabled ? "cursor-not-allowed" : "cursor-pointer")}>
          {/* the radio is only hidden visually: it stays in the tab order and
              the accessibility tree, and drives the styling of its own segment */}
          <input type="radio" name={name} value={option.value} checked={selected} disabled={disabled} onChange={() => onChange(option.value)} className="focus-ring-peer sr-only" />
          <span
            className={cn(
              // the vertical padding lines the control up with the search button next to it
              "block font-poppins font-medium text-[16px] px-3 py-[7px] rounded-[8px] transition-colors select-none",
              selected ? "bg-blue-gradient text-white" : "text-dimWhite",
              !selected && !disabled && "hover:text-white"
            )}
          >
            {option.label}
          </span>
        </label>
      );
    })}
  </div>
);

export { SegmentedControl };
