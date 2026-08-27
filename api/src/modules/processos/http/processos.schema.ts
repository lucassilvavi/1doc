import type { StatusProcesso } from '../domain/processo.js';

export const listProcessosSchema = {
  headers: {
    type: 'object',
    required: ['x-tenant-id'],
    properties: {
      'x-tenant-id': { type: 'string', minLength: 1 },
    },
  },
  querystring: {
    type: 'object',
    additionalProperties: false,
    properties: {
      status: {
        type: 'string',
        enum: ['em_andamento', 'concluido'],
      },
      page: { type: 'integer', minimum: 1, default: 1 },
    },
  },
  response: {
    200: {
      type: 'object',
      required: ['data', 'total', 'page'],
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            required: ['id', 'tenantId', 'titulo', 'status'],
            properties: {
              id: { type: 'string' },
              tenantId: { type: 'string' },
              titulo: { type: 'string' },
              status: {
                type: 'string',
                enum: ['em_andamento', 'concluido'],
              },
            },
          },
        },
        total: { type: 'number' },
        page: { type: 'number' },
      },
    },
  },
} as const;

export type ListProcessosQuery = {
  status?: StatusProcesso;
  page?: number;
};
