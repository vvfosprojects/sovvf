import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { SintesiRichiesta } from 'src/app/shared/model/sintesi-richiesta.model';

@Injectable({
    providedIn: 'root'
})
export class PartenzaService {
    private richiestaNuovaPartenza$ = new Subject<SintesiRichiesta>();
    private compPartenzaMode = new Subject<any>();
    compPartenzaModeIniziale = 'slower';

    nuovaPartenza(richiesta) {
        this.richiestaNuovaPartenza$.next(richiesta);
    }

    getRichiestaPartenza(): Observable<any> {
        return this.richiestaNuovaPartenza$.asObservable();
    }

    changeCompPartenzaMode(newMode) {
        this.compPartenzaMode.next(newMode);
    }

    getCompPartenzaMode(): Observable<any> {
        return this.compPartenzaMode.asObservable();
    }
}
