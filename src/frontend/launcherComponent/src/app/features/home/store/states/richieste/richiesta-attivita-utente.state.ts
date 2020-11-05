import { Action, State } from '@ngxs/store';
import { AttivitaUtenteService } from '../../../../../core/service/attivita-utente-service/attivita-utente.service';
import { AddInLavorazione, AddPresaInCarico, DeleteInLavorazione, DeletePresaInCarico } from '../../actions/richieste/richiesta-attivita-utente.actions';
import { Injectable } from '@angular/core';

@Injectable()
@State({
    name: 'richiestaAttivitaUtente'
})
export class RichiestaAttivitaUtenteState {

    constructor(private attivitaUtenteService: AttivitaUtenteService) {
    }

    @Action(AddInLavorazione)
    addInLavorazione({ dispatch }, action: AddInLavorazione): void {
        this.attivitaUtenteService.addInLavorazione(action.sintesiRichiesta).subscribe(() => {
        });
    }

    @Action(DeleteInLavorazione)
    deleteInLavorazione({ dispatch }, action: DeleteInLavorazione): void {
        this.attivitaUtenteService.deleteInLavorazione(action.sintesiRichiesta).subscribe(() => {
        });
    }

    @Action(AddPresaInCarico)
    addPresaInCarico({ dispatch }, action: AddPresaInCarico): void {
        this.attivitaUtenteService.addPresaInCarico(action.sintesiRichiesta).subscribe(() => {
        });
    }

    @Action(DeletePresaInCarico)
    deletePresaInCarico({ dispatch }, action: DeletePresaInCarico): void {
        this.attivitaUtenteService.deletePresaInCarico(action.sintesiRichiesta).subscribe(() => {
        });
    }

}
