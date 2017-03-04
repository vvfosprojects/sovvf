import { Pipe } from '@angular/core';

@Pipe({name: 'truncate'})
export class TruncatePipe {
  transform(value: string, arg1?: number, arg2?: string) : string {
    let limit = arg1 ? arg1 : 10;
    let trail = !!arg2 ? arg2 : '...';

    return value.length > limit ? value.substring(0, limit).trim() + trail : value;
  }
}