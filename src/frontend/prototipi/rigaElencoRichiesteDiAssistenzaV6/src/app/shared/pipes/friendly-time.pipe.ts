import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'friendlyTime'
})
export class FriendlyTimePipe implements PipeTransform {

    transform(time: any, args?: any): string {

        time.map(res => {
            if (res > 20) {
                return 'piu di 20 minuti';
            }

            if (res > 30) {
                return 'piu di 30 minuti';
            }

            if (res === 0) {
                return 'piu di 30 minuti';
            }
        });

        return 'default';
    }
}
