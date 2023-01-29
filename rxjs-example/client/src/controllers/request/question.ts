import { injectable } from "inversify";
import { LoggerService } from "src/modules/logger";
import { BaseController } from "src/controllers/interface/controller";
import { mergeMap, range, tap } from "rxjs";
import * as Bluebird from "bluebird";

let count = 0;
let ratelimit: number[] = [];

@injectable()
export class RequestController implements BaseController {
  constructor(private readonly logger: LoggerService) {}

  public run = async (job: string) => {
    console.debug("RequestController:run", job);

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
          console.debug("ratelimitRequest", {
            payload,
            time: new Date().getTime(),
          });
          await this.ratelimitRequest();
          return payload;
        })
      )
      .pipe(
        tap((payload) => {
          console.debug("result", payload);
          if (count > 5) {
            throw new Error("out of memory");
          }
        })
      )
      .subscribe();
  };

  public ratelimitRequest = async () => {
    ratelimit.push(new Date().getTime());
    // 5초 안에 index 갯수가 10개 미만
    ratelimit.forEach((start, index) => {
      const i = ratelimit.findIndex((value) => start + 1000 * 3 < value);
      if (i - index > 10) {
        console.debug({ start, count: i - index });
        throw new Error("rate limit error");
      }
    });
  };

  public heavyRequest = async () => {
    ++count;
    await Bluebird.delay(1000);
    --count;
  };
}
