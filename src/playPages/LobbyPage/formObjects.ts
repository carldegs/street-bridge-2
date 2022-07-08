import Joi from 'joi';

import { FormObject } from '../../formHandlers/FormObject';

export const createRoomFormObject = new FormObject(
  {
    name: '',
  },
  {
    name: Joi.string().min(4).max(16).alphanum().required(),
  }
);

export const joinRoomFormObject = new FormObject(
  {
    ...createRoomFormObject.defaultValues,
    code: '',
  },
  {
    ...createRoomFormObject.schema,
    code: Joi.string().min(8).max(8).alphanum().required(),
  }
);
