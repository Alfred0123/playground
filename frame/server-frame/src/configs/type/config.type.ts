export const CONFIG_TYPE = {
  DEFAULT: "default",
} as const;
export type CONFIG_TYPE = typeof CONFIG_TYPE[keyof typeof CONFIG_TYPE];
