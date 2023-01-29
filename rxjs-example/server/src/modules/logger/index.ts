import { injectable, inject } from "inversify";

import { ConfigService } from "src/configs/config.service";
import * as winston from "winston";
import { format, Logger, transports } from "winston";
import { inspect } from "util";

import fs from "fs";

@injectable()
export class LoggerService {
  private logger: Logger;

  constructor(private readonly config: ConfigService) {
    this.logger = this.loggerFactory(this.config);
  }

  log(message: any, context?: any) {
    if (typeof message == "object") {
      return this.logger.info("", { context: { ...message, ...context } });
    }
    return this.logger.info(message, { context });
  }
  info(message: any, context?: any) {
    if (typeof message == "object") {
      return this.logger.info("", { context: { ...message, ...context } });
    }
    return this.logger.info(message, { context });
  }
  error(message: any, context?: any) {
    if (typeof message == "object") {
      return this.logger.error("", { context: { ...message, ...context } });
    }
    return this.logger.error(message, { context });
  }
  warn(message: any, context?: any) {
    if (typeof message == "object") {
      return this.logger.warn("", { context: { ...message, ...context } });
    }
    return this.logger.warn(message, { context });
  }
  debug(message: any, context?: any) {
    if (typeof message == "object") {
      return this.logger.debug("", { context: { ...message, ...context } });
    }
    return this.logger.debug(message, { context });
  }
  verbose(message: any, context?: any) {
    if (typeof message == "object") {
      return this.logger.verbose("", { context: { ...message, ...context } });
    }
    return this.logger.verbose(message, { context });
  }

  async save(payload: any, fileName?: string) {
    return await this.saveJson(JSON.stringify(payload), fileName);
  }

  private saveJson = async (str: string, fileName?: string) => {
    const logDir = "log";
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir);
    }
    let wf = fs.createWriteStream(
      `${logDir}/${!!fileName ? fileName : "log"}.json`
    );
    await wf.write(str);
  };

  private loggerFactory = (configService: ConfigService) => {
    const config = configService.defaultConfig;
    const logger = winston.createLogger({
      level: config.service.log_level,
      format: winston.format.json(),
      defaultMeta: {
        service: config.service.name,
      },
      silent: config.env == "test" ? true : false,
      transports: [
        new transports.Console({
          format: format.combine(
            format.timestamp(),
            format.json(),
            ...(() => {
              if (config.env != "local") return [];
              return [format.colorize(), this.pretty(config.env)];
            })()
          ),
        }),
      ],
    });

    return logger;
  };

  private pretty = (env: string) => {
    return format.printf((info) => {
      let message;
      if (!info.message) {
        message = `[\x1b[2m${info.timestamp}\x1b[0m]:[${info.level}]`;
      } else {
        message = `[\x1b[2m${info.timestamp}\x1b[0m]:[${info.level}]:\x1b[36m${info.message}\x1b[0m`;
      }
      if (!info.context) {
        return message;
      }
      if (typeof info.context == "object") {
        return message + "\n" + inspect(info.context, false, 10, true);
      }
      return message + ":" + info.context;
    });
  };
}
