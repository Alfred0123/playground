export interface DefaultConfig {
  env: string;
  port: number;
  service: {
    name: string;
    log_level: "debug" | "info";
  };
}
