import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'replace' })

export class ReplacePipe implements PipeTransform {
    transform(value: string, arg1: string, arg2: string): string {
        return value.replace(arg1, arg2);
    }
}
