import { injectable } from "inversify";

import { LoggerService } from "src/modules/logger";
import { ValidationService } from "src/modules/validation";
import { SampleController } from "./sample";
import { RequestController } from "src/controllers/request";

import * as Joi from "joi";

import { JOB_TYPE } from "src/types/job/type";

import { BaseController } from "src/controllers/interface/controller";

const schema = Joi.object().keys({
  job: Joi.string()
    .trim()
    .valid(...Object.values(JOB_TYPE))
    .required(),
});

@injectable()
export class RootController implements BaseController {
  constructor(
    private readonly logger: LoggerService,
    private readonly validation: ValidationService,
    private readonly sampleController: SampleController,
    private readonly requestController: RequestController
  ) {}

  public run = async (job: string) => {
    this.logger.debug("RootController:run", job);
    const commands = job.split(":");

    this.validation.check(
      {
        job: commands[0],
      },
      schema
    );

    console.log({ commands: [commands[0], commands[1]] });
    await this.jobSelector(commands[0]).run(commands[1]);
  };

  public jobSelector = (command: string) => {
    switch (command) {
      case JOB_TYPE.REQUEST:
        return this.requestController;
    }

    throw new Error("JOB_TYPE not found");
  };
}
