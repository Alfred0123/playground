import { injectable } from "inversify";

import { Router, Request, Response, NextFunction } from "express";
import wrapper from "src/middlewares/asyncWrapper";
import { ConfigService } from "src/configs/config.service";
import { LoggerService } from "src/modules/logger";

@injectable()
export class MainController {
  private _router: Router;

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: LoggerService
  ) {
    this._router = Router();

    // this._router.use("/sample", sampleController.router);

    this._router.use("/ping", wrapper(this.ping));
  }

  get router() {
    return this._router;
  }

  public ping = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    this.logger.debug("MainController:ping");
    response.status(200).json({
      message: "success",
      env: this.configService.defaultConfig.env,
      ip: request.ip,
    });
    next();
  };
}
