import { injectable } from "inversify";
import { LoggerService } from "src/modules/logger";
import { BaseController } from "src/controllers/interface/controller";
import { ConfigService } from "src/configs/config.service";
import { ValidationService } from "src/modules/validation";
import * as Joi from "joi";
import { SAMPLE_TYPE } from "src/types/job/type";

const schema = Joi.object().keys({
  job: Joi.string()
    .trim()
    .valid(...Object.values(SAMPLE_TYPE))
    .required(),
});

@injectable()
export class SampleController implements BaseController {
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
    private readonly validation: ValidationService
  ) {}

  public run = async (job: string) => {
    this.logger.debug("ConnectedIdController:run", job);
    this.validation.check(
      {
        job,
      },
      schema
    );
    await this.jobSelector(job)(job);
  };

  public jobSelector = (command: string) => {
    switch (command) {
      case SAMPLE_TYPE.TEST:
        return this.test;
    }
    throw new Error("SAMPLE_TYPE not found");
  };

  public test = async (command: string) => {
    console.log("test");
  };
}
