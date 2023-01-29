import { readFileSync } from "fs";
import * as yaml from "js-yaml";
import { join } from "path";
import { CONFIG_TYPE } from "src/configs/type/config.type";
import { DefaultConfig } from "src/configs/interface/config.interface";
import { injectable, inject } from "inversify";

@injectable()
export class ConfigService {
  public defaultConfig: DefaultConfig;

  constructor() {
    const ENV = process.env.ENV || "local";
    const YAML_CONFIG_FILENAME = `${ENV}.config.yaml`;

    const result = yaml.load(
      readFileSync(
        join(`dist/configs/${CONFIG_TYPE.DEFAULT}/${YAML_CONFIG_FILENAME}`),
        // join(__dirname, `${CONFIG_TYPE.DEFAULT}/${YAML_CONFIG_FILENAME}`),
        "utf8"
      )
    ) as DefaultConfig;

    // TODO. validation check

    this.defaultConfig = result;
  }
}
