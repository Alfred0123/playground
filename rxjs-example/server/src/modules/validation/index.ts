import { injectable } from "inversify";
import * as Joi from "joi";

@injectable()
export class ValidationService {
  constructor() {}

  public check = (obj: any, schema: Joi.ObjectSchema) => {
    const { error, value } = schema.validate(obj);

    if (error) {
      throw error;
    }
    return value;
  };
}
