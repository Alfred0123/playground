import "module-alias/register";
import "reflect-metadata";
import { container } from "src/di";
import { ConfigService } from "src/configs/config.service";
import { LoggerService } from "src/modules/logger/index";
import { App } from "src/app";

(async () => {
  const app = container.get(App);
  const config = container.get(ConfigService);
  const logger = container.get(LoggerService);
  // console.log({process.env.JOB_COMMAND})
  logger.info("process.env.JOB_COMMAND", process.env.JOB_COMMAND);
  if (process.env.JOB_COMMAND === undefined) {
    throw new Error("job command not found");
  }
  app.run(process.env.JOB_COMMAND);
})();
