import { injectable } from "inversify";

import { Router, Request, Response, NextFunction } from "express";
import wrapper from "src/middlewares/asyncWrapper";
import { ConfigService } from "src/configs/config.service";
import { LoggerService } from "src/modules/logger";
import rateLimit, { MemoryStore } from "express-rate-limit";

@injectable()
export class SampleController {
  private _router: Router;

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: LoggerService
  ) {
    this._router = Router();

    this._router.get("/rate-limit", this.limiter, wrapper(this.rateLimit));
  }

  get router() {
    return this._router;
  }

  public limiter = rateLimit({
    windowMs: 60 * 1000, // 1 min
    max: 5,
    message: "Too many request in min",
    standardHeaders: true,
    store: new MemoryStore(), // redis or mongodb or memory
  });

  public rateLimit = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    this.logger.debug("SampleController:rateLimit");
    response.status(200).json({
      message: "success",
    });
    next();
  };
}
