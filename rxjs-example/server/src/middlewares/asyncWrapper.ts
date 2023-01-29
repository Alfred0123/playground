import { Request, Response, NextFunction } from "express";

const wrapper = (fn: Function) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    try {
      await fn(request, response, next);
    } catch (e) {
      const error = e as any;
      next(error);
    } finally {
    }
  };
};

export default wrapper;
