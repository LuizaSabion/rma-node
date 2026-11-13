import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { NaoEncontradoError, RegraNegocioError } from '../domain/errors/domain.errors';

@Catch(RegraNegocioError, NaoEncontradoError)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(erro: Error, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();
    const status = erro instanceof NaoEncontradoError ? HttpStatus.NOT_FOUND : HttpStatus.BAD_REQUEST;

    res.status(status).json({ statusCode: status, message: erro.message });
  }
}
