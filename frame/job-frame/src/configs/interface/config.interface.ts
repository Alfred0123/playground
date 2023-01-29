export interface DefaultConfig {
  env: string;
  service: {
    name: string;
    log_level: "debug" | "info";
  };
}
