import { JSONSchemaType } from "ajv";

interface FilesPutSchema {
  body: {
    expiredAt: string;
  };
}

const filesPutReqSchema: JSONSchemaType<FilesPutSchema> = {
  type: 'object',
  properties: {
    body: {
      type: 'object',
      properties: {
        expiredAt: { type: 'string', format: 'date-time' },
      },
      required: ['expiredAt'],
    },
  },
  required: ['body'],
  additionalProperties: false,
};

export default filesPutReqSchema;
