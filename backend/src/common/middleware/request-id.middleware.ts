import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (!req.headers['x-request-id']) {
      req.headers['x-request-id'] = `req_${randomUUID()}`;
    }
    res.setHeader('x-request-id', req.headers['x-request-id'] as string);
    next();
  }
}
