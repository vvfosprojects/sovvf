import { Injectable } from '@angular/core';
import { of, Observable, Subject } from 'rxjs';
import { PreAccoppiato } from 'src/app/composizione-partenza/model/pre-accoppiato.model';
import { CompPartenzaService } from '../../service/comp-partenza-service/comp-partenza.service';


@Injectable({
    providedIn: 'root'
})
export class DispatcherCompPartenzaFakeService {
    private updateRichiesta$ = new Subject<CompPartenzaService>();

    preAccoppiati: PreAccoppiato[];

    constructor(private preaccoppiatiService: CompPartenzaService) {
    }

    onNewPreAccoppiatiList(): Observable<PreAccoppiato[]> {
        this.preaccoppiatiService.getPreAccoppiati().subscribe((preAcc: PreAccoppiato[]) => {
            this.preAccoppiati = preAcc;
        });
        return of(this.preAccoppiati);
    }
}
