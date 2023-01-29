import { injectable } from "inversify";
import { LoggerService } from "src/modules/logger";
import { BaseController } from "src/controllers/interface/controller";
import { ConfigService } from "src/configs/config.service";
import { ValidationService } from "src/modules/validation";
import { mergeMap, range, tap } from "rxjs";
import * as Bluebird from "bluebird";

@injectable()
export class RequestController implements BaseController {
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
    private readonly validation: ValidationService
  ) {}

  public run = async (job: string) => {
    this.logger.debug("RequestController:run", job);
    global.count = 0;
    global.ratelimit = [];
    const start = new Date().getTime();

    /*
      heavyRequest 를 호출해서 100 개의 데이터를 받아와야 한다. 
      하지만 heavyRequest 는 정말 무거운 작업이기 때문에, 5개의 작업밖에 동시에 진행할 수 없다.
    */

    await range(0, 100)
      .pipe
      // 여기에 답을 넣어주세요.
      ()
      .pipe(
        // ratelimitRequest 호출을 통과하도록 pipe를 붙여주세요.
        mergeMap(async (payload) => {
          this.logger.debug("ratelimitRequest", {
            payload,
            time: new Date().getTime(),
          });
          await this.ratelimitRequest();
          return payload;
        })
      )
      .pipe(
        tap((payload) => {
          this.logger.debug("result", payload);
          if (global.count > 5) {
            throw new Error("out of memory");
          }
        })
      )
      .subscribe();

    const end = new Date().getTime();
  };

  public ratelimitRequest = async () => {
    global.ratelimit.push(new Date().getTime());
    // 5초 안에 index 갯수가 10개 미만
    global.ratelimit.forEach((start, index) => {
      const i = global.ratelimit.findIndex((value) => start + 1000 * 3 < value);
      if (i - index > 10) {
        this.logger.debug({ start, count: i - index });
        throw new Error("rate limit error");
      }
    });
  };

  public heavyRequest = async () => {
    ++global.count;
    await Bluebird.delay(1000);
    --global.count;
  };
}
