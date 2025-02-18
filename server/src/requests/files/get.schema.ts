import { JSONSchemaType } from "ajv";

interface FilesGetSchema {
  params: {
    id: string;
  };
}

const filesGetReqSchema: JSONSchemaType<FilesGetSchema> = {
  type: 'object',
  properties: {
    params: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
      },
      required: ['id'],
    },
  },
  required: ['params'],
  additionalProperties: false,
};

export default filesGetReqSchema;
