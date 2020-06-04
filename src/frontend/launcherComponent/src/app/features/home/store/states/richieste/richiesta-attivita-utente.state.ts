import { Action, State } from '@ngxs/store';
import { ShowToastr } from '../../../../../shared/store/actions/toastr/toastr.actions';
import { ToastrType } from '../../../../../shared/enum/toastr';
import { AttivitaUtenteService } from '../../../../../core/service/attivita-utente-service/attivita-utente.service';
import { AddInLavorazione, AddPresaInCarico, DeleteInLavorazione, DeletePresaInCarico } from '../../actions/richieste/richiesta-attivita-utente.actions';

@State({
    name: 'richiestaAttivitaUtente'
})
export class RichiestaAttivitaUtenteState {

    constructor(private attivitaUtenteService: AttivitaUtenteService) {
    }

    @Action(AddInLavorazione)
    addInLavorazione({ dispatch }, action: AddInLavorazione) {
        this.attivitaUtenteService.addInLavorazione(action.sintesiRichiesta).subscribe(() => {
        });
    }

    @Action(DeleteInLavorazione)
    deleteInLavorazione({ dispatch }, action: DeleteInLavorazione) {
        this.attivitaUtenteService.deleteInLavorazione(action.sintesiRichiesta).subscribe(() => {
        });
    }

    @Action(AddPresaInCarico)
    addPresaInCarico({ dispatch }, action: AddPresaInCarico) {
        this.attivitaUtenteService.addPresaInCarico(action.sintesiRichiesta).subscribe(() => {
        });
    }

    @Action(DeletePresaInCarico)
    deletePresaInCarico({ dispatch }, action: DeletePresaInCarico) {
        this.attivitaUtenteService.deletePresaInCarico(action.sintesiRichiesta).subscribe(() => {
        });
    }

}
