export interface BaseController {
  run(job: string): Promise<any>;
}
