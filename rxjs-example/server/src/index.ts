import "module-alias/register";
import "reflect-metadata";
import { container } from "src/di";
import { App } from "src/app";
import { ConfigService } from "src/configs/config.service";

// sentry sourcemap 관련
global.__rootdir__ = __dirname || process.cwd();

(async () => {
  const app = container.get(App);
  const config = container.get(ConfigService);

  app.run(config.defaultConfig.port);
})();
