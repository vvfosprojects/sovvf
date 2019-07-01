import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AuthenticationService } from '../../auth/_services';
import { Utente } from '../../../shared/model/utente.model';
import { Store } from '@ngxs/store';
import { SintesiRichiesta } from '../../../shared/model/sintesi-richiesta.model';
import { AttivitaUtente } from '../../../shared/model/attivita-utente.model';
import { UpdateRichiesta } from '../../../features/home/store/actions/richieste/richieste.actions';
import { makeCopy } from '../../../shared/helper/function';

@Injectable()
export class AttivitaUtenteServiceFake {

    currentUser: Utente;

    constructor(private authenticationService: AuthenticationService, private store: Store) {
        this.currentUser = this.authenticationService.currentUserValue;
    }

    public addInLavorazione(sintesiRichiesta: SintesiRichiesta): Observable<any> {
        if (sintesiRichiesta) {
            const newSintesiRichiesta = makeCopy(sintesiRichiesta);
            if (newSintesiRichiesta.listaUtentiInLavorazione && newSintesiRichiesta.listaUtentiInLavorazione.length > 0) {
                newSintesiRichiesta.listaUtentiInLavorazione.push(makeAttivitaUtente(this.currentUser));
            } else {
                newSintesiRichiesta.listaUtentiInLavorazione = [(makeAttivitaUtente(this.currentUser))];
            }
            this.dispatchModify(newSintesiRichiesta);
        }
        return of();
    }

    public deleteInLavorazione(sintesiRichiesta: SintesiRichiesta): Observable<any> {
        if (sintesiRichiesta && sintesiRichiesta.listaUtentiInLavorazione && sintesiRichiesta.listaUtentiInLavorazione.length > 0) {
            const newSintesiRichiesta = makeCopy(sintesiRichiesta);
            const listaUtentiInLavorazione = newSintesiRichiesta.listaUtentiInLavorazione.filter( attivita => attivita.nominativo !== makeAttivitaUtente(this.currentUser).nominativo);
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

}

export function makeAttivitaUtente(utente: Utente): AttivitaUtente {
    const attivitaUtente = {} as AttivitaUtente;
    attivitaUtente.nominativo = `${utente.nome} ${utente.cognome}`;
    attivitaUtente.dataInizioAttivita = new Date();
    return attivitaUtente;
}
