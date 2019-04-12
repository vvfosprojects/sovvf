import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TurnoExtra } from '../../../features/navbar/turno/turno-extra.model';
import * as moment from 'moment';


@Injectable({
    providedIn: 'root'
})
export class TurnoExtraServiceFake {

    private turniExtra: TurnoExtra = null;

    constructor() {
    }

    public getTurni(): Observable<TurnoExtra> {
        // this.turniExtra = new TurnoExtra('Eme',
        //     'Emergenza',
        //     new Date().toISOString(),
        //     moment().add(24, 'hours').toDate().toISOString(),
        //     );
        this.turniExtra = null;
        return of(this.turniExtra);
    }

}
