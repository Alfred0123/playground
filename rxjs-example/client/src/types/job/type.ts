export const JOB_TYPE = {
  FINANCIAL_STATEMENTS: "FinancialStatements",
} as const;
export type JOB_TYPE = typeof JOB_TYPE[keyof typeof JOB_TYPE];

export const SAMPLE_TYPE = {
  TEST: "test",
} as const;
export type SAMPLE_TYPE = typeof SAMPLE_TYPE[keyof typeof SAMPLE_TYPE];
