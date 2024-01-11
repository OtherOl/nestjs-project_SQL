import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    if (status === 401) {
      response.status(status).json();
    }

    if (status === 400) {
      const errorsResponse = {
        errorsMessages: [] as any[],
      };
      const responseBody: any = exception.getResponse();

      responseBody.message.forEach((e: any) => errorsResponse.errorsMessages.push(e));

      response.status(status).json(errorsResponse);
    } else {
      response.status(status).json();
    }
  }
}
