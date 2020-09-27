import type { Request, Response } from 'express';

export interface HTTPRequest<Params = unknown, ReqBody = unknown> {
  body: ReqBody;
  query: unknown;
  params: Params;
  ip: string;
  method: string;
  path: string;
  headers: {
    'Content-Type': string | undefined;
    Referer: string | undefined;
    'User-Agent': string | undefined;
  };
}

export interface HTTPResponse<ResBody = unknown> {
  headers?: Record<string, unknown>;
  statusCode: number;
  body: ResBody;
}

export type HTTPController<
  Params = unknown,
  ReqBody = unknown,
  ResBody = unknown
> = (request: HTTPRequest<Params, ReqBody>) => Promise<HTTPResponse<ResBody>>;

export default function makeExpressCallback(controller: HTTPController) {
  return async function expressCallback(req: Request, res: Response) {
    const httpRequest: HTTPRequest = {
      body: req.body,
      query: req.query,
      params: req.params,
      ip: req.ip,
      method: req.method,
      path: req.path,

      headers: {
        Referer: req.get('referer'),
        'Content-Type': req.get('Content-Type'),
        'User-Agent': req.get('User-Agent'),
      },
    };

    try {
      const { headers, statusCode, body } = await controller(httpRequest);

      res.header({
        'Content-Type': 'application/json',
      });
      if (headers) {
        res.header(headers);
      }

      res.status(statusCode).send(body);
    } catch (error) {
      // TODO: Error logging
      console.trace(error);

      res.status(500).send({
        error: 'An unkown error occurred',
      });
    }
  };
}
