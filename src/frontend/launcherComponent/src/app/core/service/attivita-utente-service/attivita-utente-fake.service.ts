import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Store } from '@ngxs/store';
import { SintesiRichiesta } from '../../../shared/model/sintesi-richiesta.model';
import { AttivitaUtente } from '../../../shared/model/attivita-utente.model';
import { UpdateRichiesta } from '../../../features/home/store/actions/richieste/richieste.actions';
import { makeCopy } from '../../../shared/helper/function';
import { UtenteState } from '../../../features/navbar/store/states/operatore/utente.state';

@Injectable()
export class AttivitaUtenteServiceFake {

    constructor(private store: Store) {
    }

    public addInLavorazione(sintesiRichiesta: SintesiRichiesta): Observable<any> {
        if (sintesiRichiesta) {
            const newSintesiRichiesta = makeCopy(sintesiRichiesta);
            if (newSintesiRichiesta.listaUtentiInLavorazione && newSintesiRichiesta.listaUtentiInLavorazione.length > 0) {
                newSintesiRichiesta.listaUtentiInLavorazione.push(this.makeAttivitaUtente());
            } else {
                newSintesiRichiesta.listaUtentiInLavorazione = [(this.makeAttivitaUtente())];
            }
            this.dispatchModify(newSintesiRichiesta);
        }
        return of();
    }

    public deleteInLavorazione(sintesiRichiesta: SintesiRichiesta): Observable<any> {
        if (sintesiRichiesta && sintesiRichiesta.listaUtentiInLavorazione && sintesiRichiesta.listaUtentiInLavorazione.length > 0) {
            const newSintesiRichiesta = makeCopy(sintesiRichiesta);
            const listaUtentiInLavorazione = newSintesiRichiesta.listaUtentiInLavorazione.filter( (attivita: AttivitaUtente) => attivita.idUtente !== this.makeAttivitaUtente().idUtente);
            newSintesiRichiesta.listaUtentiInLavorazione = listaUtentiInLavorazione;
            this.dispatchModify(newSintesiRichiesta);
        }
        return of();
    }

    public addPresaInCarico(sintesiRichiesta: SintesiRichiesta): Observable<any> {
        /**
         * da fare
         */
        return of();
    }

    public deletePresaInCarico(sintesiRichiesta: SintesiRichiesta): Observable<any> {
        /**
         * da fare
         */
        return of();
    }

    private dispatchModify(richiesta: SintesiRichiesta): void {
        this.store.dispatch(new UpdateRichiesta(richiesta));
    }

    private makeAttivitaUtente(): AttivitaUtente {
        const currentUser = this.store.selectSnapshot(UtenteState.utente);
        const attivitaUtente = {} as AttivitaUtente;
        attivitaUtente.idUtente = currentUser.id;
        attivitaUtente.nominativo = `${currentUser.nome} ${currentUser.cognome}`;
        attivitaUtente.dataInizioAttivita = new Date();
        return attivitaUtente;
    }

}
