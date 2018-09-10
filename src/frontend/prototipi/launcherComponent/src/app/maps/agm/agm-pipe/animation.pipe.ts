import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'animation'
})
export class AnimationPipe implements PipeTransform {

    transform(value: boolean, args?: number): string {

        if (!args) {
            return value ? 'BOUNCE' : null;
        } else if (args > 0) {
            return value ? 'DROP' : null;
        }

        /* test provvisorio, effetto drop all'aggiunta di un marker */
        // if (!value) {
        //     return 'DROP';
        // } else {
        //     return 'BOUNCE';
        // }
    }
}
