import { injectable } from "inversify";
import * as express from "express";
import { Application, Request, Response, NextFunction } from "express";
import { LoggerService } from "src/modules/logger";
import { MainController } from "./controllers";
import { ConfigService } from "src/configs/config.service";
import * as cors from "cors";

@injectable()
export class App {
  public app: Application;

  constructor(
    private readonly logger: LoggerService,
    private readonly config: ConfigService,
    private readonly mainController: MainController
  ) {
    this.app = express();

    this.app.use(cors());

    // body parser
    this.app.use(express.json());

    // router init
    this.app.use(this.mainController.router);

    // error handler
    // this.app.use(this.exception.handler);
  }

  public run = async (port: number) => {
    await this.init();

    this.app.listen(port, () => {
      this.logger.info(`express run / port ${port}`);
    });
  };

  public init = async () => {
    // await this.redisService.init();
  };

  public async end() {}
}
