import {
  Injectable,
  NestInterceptor,
  CallHandler,
  ExecutionContext,
} from '@nestjs/common';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
interface Response<T> {
  data: T;
}
@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<Response<T>> {
    const ctx = context.switchToHttp();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const response = ctx.getResponse();

    return next.handle().pipe(
      tap(() => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        response.status(200);
      }),
      map((data) => {
        return {
          data,
          code: 0,
          message: 'success',
        };
      }),
    );
  }
}
