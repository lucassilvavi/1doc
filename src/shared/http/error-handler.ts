import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { AppError } from '../domain/errors.js';

export function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply,
) {
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      statusCode: error.statusCode,
      error: error.code,
      message: error.message,
    });
  }

  if (error.validation) {
    return reply.status(400).send({
      statusCode: 400,
      error: 'BAD_REQUEST',
      message: error.message,
    });
  }

  request.log.error(error);

  return reply.status(500).send({
    statusCode: 500,
    error: 'INTERNAL_SERVER_ERROR',
    message: 'Internal Server Error',
  });
}
