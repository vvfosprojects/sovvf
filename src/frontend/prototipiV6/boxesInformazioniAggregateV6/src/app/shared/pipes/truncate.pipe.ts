import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'truncate'})

export class TruncatePipe implements PipeTransform {
    private readonly trail: string = '...';

    transform(value: string, arg1?: number, arg2?: string): string {
        if (!value) {
            return '';
        }
        const limit = arg1 ? arg1 : 10;
        const trail = !!arg2 ? arg2 : this.trail;

        return value.length > limit ? value.substring(0, limit).trim() + trail : value;
    }
}
