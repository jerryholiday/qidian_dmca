import { Request, Response, NextFunction } from 'express';

export function RequestLoggerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const startAt = process.hrtime();
  const method = req.method;
  const url = req.originalUrl;

  res.on('finish', () => {
    const statusCode = res.statusCode;
    const [sec, nanosec] = process.hrtime(startAt);
    const responseTime = (sec * 1000 + nanosec / 1000000).toFixed(2);

    console.log(
      `[${new Date().toISOString()}] ${method} ${url} ${statusCode} ${responseTime}ms`,
    );
  });

  next();
}
