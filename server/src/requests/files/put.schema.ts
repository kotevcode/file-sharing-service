import { JSONSchemaType } from "ajv";

interface FilesPutSchema {
  headers: {
    'x-retention-time': string;
  };
}

const filesPutReqSchema: JSONSchemaType<FilesPutSchema> = {
  type: 'object',
  properties: {
    headers: {
      type: 'object',
      properties: {
        'x-retention-time': { type: 'string' },
      },
      required: ['x-retention-time'],
    },
  },
  required: ['headers'],
  additionalProperties: false,
};

export default filesPutReqSchema;
