import { Pipe, PipeTransform } from '@angular/core';
import { TipoConcorrenzaEnum } from '../enum/tipo-concorrenza.enum';
import { LockedConcorrenzaService } from '../../core/service/concorrenza-service/locked-concorrenza.service';

@Pipe({
    name: 'checkConcorrenzaLocked',
    pure: false
})
export class ConcorrenzaLockedPipe implements PipeTransform {

    constructor(private lockedConcorrenzaService: LockedConcorrenzaService) {
    }

    transform(type: TipoConcorrenzaEnum, value: string[]): any {
        return this.lockedConcorrenzaService.getLockedConcorrenza(type, value);
    }

}
