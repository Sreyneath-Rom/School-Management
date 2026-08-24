// src/features/setup/school/constants.ts

export const inputClass = `
  w-full
  rounded-xl
  border
  border-white/40
  bg-white/45
  px-4
  py-3
  text-sm
  font-medium
  text-slate-900
  outline-none
  backdrop-blur-xl

  shadow-[
    inset_-2px_-2px_5px_rgba(255,255,255,0.7),
    inset_2px_2px_5px_rgba(15,23,42,0.06)
  ]

  transition-all
  duration-200

  placeholder:text-slate-400

  hover:bg-white/60

  focus:border-brand-500/60
  focus:ring-4
  focus:ring-brand-500/10

  dark:border-white/10
  dark:bg-slate-900/45
  dark:text-white

  dark:shadow-[
    inset_-2px_-2px_5px_rgba(255,255,255,0.03),
    inset_2px_2px_5px_rgba(0,0,0,0.25)
  ]

  dark:placeholder:text-slate-500
`;

export const labelClass = `
  mb-2
  block
  text-sm
  font-semibold
  text-slate-700
  dark:text-slate-300
`;