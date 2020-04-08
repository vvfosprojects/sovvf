import { Subject, Observable } from 'rxjs';
import { SintesiRichiesta } from 'src/app/shared/model/sintesi-richiesta.model';

export class ListaRichiesteSubjects {
    private richiestaHover = new Subject<SintesiRichiesta>();
    private richiestaFissata = new Subject<SintesiRichiesta>();
    private richiestaSelezionata = new Subject<SintesiRichiesta>();

    constructor() {
    }

    // Richiesta Hover
    sendRichiestaHover(richiesta) {
        this.richiestaHover.next(richiesta);
    }
    clearRichiestaHover() {
        this.richiestaHover.next();
    }
    getRichiestaHover(): Observable<any> {
        return this.richiestaHover.asObservable();
    }

    // Richiesta Fissata
    sendRichiestaFissata(richiesta) {
        this.richiestaFissata.next(richiesta);
    }
    clearRichiestaFissata() {
        this.richiestaFissata.next();
    }
    getRichiestaFissata(): Observable<any> {
        return this.richiestaFissata.asObservable();
    }

    // Richiesta Selezionata
    sendRichiestaSelezionata(richiesta) {
        this.richiestaSelezionata.next(richiesta);
    }
    clearRichiestaSelezionata() {
        this.richiestaSelezionata.next();
    }
    getRichiestaSelezionata(): Observable<any> {
        return this.richiestaSelezionata.asObservable();
    }
}
