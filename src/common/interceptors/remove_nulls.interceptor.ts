import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { map } from 'rxjs';

export class RemoveNullsInterceptor implements NestInterceptor {
  private _remove_nulls(data: any) {
    if (Array.isArray(data)) return data.map(this._remove_nulls.bind(this));
    else if (
      data !== null &&
      typeof data === 'object' &&
      !(data instanceof Date)
    ) {
      return Object.fromEntries(
        Object.entries(data).map(([key, value]) => [
          key,
          this._remove_nulls(value),
        ]),
      );
    } else if (data !== null) return data;
  }
  intercept(_: ExecutionContext, next: CallHandler<any>) {
    return next.handle().pipe(map((resp) => this._remove_nulls(resp)));
  }
}
