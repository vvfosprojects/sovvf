import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Sede } from '../../../shared/model/sede.model';
import { LivelliSedi } from '../unita-operativa-treeview-service/treeview.interface';

@Injectable({
    providedIn: 'root'
})
export class UnitaAttualeService {

    private unitaAttuale = new Subject<Sede[]>();
    private statoTreeView = new Subject<boolean>();
    private unitaOperativeCopy: Sede [];
    private livelliSedi: LivelliSedi;
    startCount = 0;
    preLoader: boolean;
    unitaSelezionata: Sede[] = [];
    unitaSelezionataString: string = null;

    constructor() {
        this.preLoader = true;
    }

    set unitaOC(value) {
        if (!this.unitaOperativeCopy) {
            this.unitaOperativeCopy = value;
        }
    }

    set livelli(value) {
        if (!this.livelliSedi) {
            this.livelliSedi = value;
        }
    }

    sendUnitaOperativaAttuale(sede: Sede[]) {
        console.log(sede);
        this.unitaAttuale.next(sede);
        this.startPreloading();
    }

    sendUnitaOperativaAttualeMaps(sede: Sede) {
        const sedeTipo = sede.tipo.toLowerCase();
        let sedeAttuale = [];
        if (!this.livelliSedi.terzo.includes(sedeTipo)) {
            if (this.livelliSedi.secondo.includes(sedeTipo)) {
                // console.log('comando');
                const comando: Sede[] = [];
                this.unitaOperativeCopy.forEach((r: Sede) => {
                    if (r.provincia === sede.provincia) {
                        comando.push(r);
                    }
                });
                sedeAttuale = comando;
            } else {
                // console.log('direzione');
                const direzione: Sede[] = [];
                this.unitaOperativeCopy.forEach((r: Sede) => {
                    if (r.regione === sede.regione) {
                        direzione.push(r);
                    }
                });
                sedeAttuale = direzione;
            }
        } else if (this.livelliSedi.terzo.includes(sedeTipo)) {
            // console.log('distaccamento');
            sedeAttuale.push(sede);
        } else {
            // console.log('CON');
            sedeAttuale = this.unitaOperativeCopy;
        }
        console.log(sedeAttuale);
        this.unitaAttuale.next(sedeAttuale);
        this.startPreloading();
    }

    annullaTreeView() {
        this.statoTreeView.next(true);
    }

    getUnitaOperativaAttuale(): Observable<Sede[]> {
        return this.unitaAttuale.asObservable();
    }

    getAnnullaTreeView(): Observable<boolean> {
        return this.statoTreeView.asObservable();
    }

    startPreloading() {
        if (this.startCount > 0) {
            this.preloading();
        }
    }

    preloading() {
        /**
         * preloader fake, simula il ricaricamento dell'applicazione
         */
        this.preLoader = false;
        // console.log('inizio riavvio applicazione(fake)');
        setTimeout(() => {
            this.preLoader = true;
            // console.log('fine riavvio applicazione(fake)');
        }, 1000);
    }

}
