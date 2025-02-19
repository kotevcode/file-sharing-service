import { Request, Response, NextFunction } from 'express';

import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv({ coerceTypes: true, useDefaults: true, removeAdditional: true });
addFormats(ajv);

const validateRequest = (reqSchema) => {
  const reqValidator = ajv.compile(reqSchema);

  return async (req: Request, res: Response, next: NextFunction) => {
    if (reqValidator) {
      const isValid = reqValidator({
        query: req.query,
        body: req.body,
        params: req.params,
        headers: req.headers,
      });
      if (!isValid && reqValidator.errors) {
        console.log(reqValidator.errors);
        const [error] = reqValidator.errors;
        return next(error);
      }
    }
    next();
  };
};

export default validateRequest;
