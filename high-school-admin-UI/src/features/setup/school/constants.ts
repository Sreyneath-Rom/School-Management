// src/features/setup/school/constants.ts

// Inputs get their sunken-well treatment (bg + inset shadow + no border)
// from globals.css automatically. This constant only layers on the
// layout + focus ring + typography that the global rule doesn't set.
export const inputClass = `
  w-full
  outline-none
  px-4
  py-3
  text-sm
  font-medium
  text-fg
  placeholder:text-fg-muted/70

  transition-all
  duration-200

  focus:outline-none
  focus:ring-2
  focus:ring-brand-500/30
`;

export const labelClass = `
  mb-2
  block
  text-sm
  font-semibold
  text-fg
`;