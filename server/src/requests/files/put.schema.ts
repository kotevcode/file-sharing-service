import { JSONSchemaType } from "ajv";

interface FilesPutSchema {
  body: {
    expiresAt: string;
  };
}

const filesPutReqSchema: JSONSchemaType<FilesPutSchema> = {
  type: 'object',
  properties: {
    body: {
      type: 'object',
      properties: {
        expiresAt: { type: 'string' },
      },
      required: ['expiresAt'],
    },
  },
  required: ['body'],
  additionalProperties: false,
};

export default filesPutReqSchema;
