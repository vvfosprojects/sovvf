import { Pipe } from '@angular/core';

@Pipe({name: 'truncate'})
export class TruncatePipe {
  private readonly trail: string = '...';
  transform(value: string, arg1?: number, arg2?: string) : string {
    if (!value)
      return "";
    
    let limit = arg1 ? arg1 : 10;
    let trail = !!arg2 ? arg2 : this.trail;

    return value.length > limit ? value.substring(0, limit).trim() + trail : value;
  }
}