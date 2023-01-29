import { injectable } from "inversify";
import { LoggerService } from "src/modules/logger";
import { RootController } from "src/controllers";

@injectable()
export class App {
  constructor(
    private readonly logger: LoggerService,
    private readonly rootController: RootController
  ) {}

  public init = async () => {};

  public async end() {}

  public run = async (job: string) => {
    await this.init();

    await this.rootController.run(job);

    await this.end();
  };
}
