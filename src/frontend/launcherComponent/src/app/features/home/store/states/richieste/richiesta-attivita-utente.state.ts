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
        }, () => dispatch(new ShowToastr(ToastrType.Error, 'Errore', 'Il server web non risponde', 5)));
    }

    @Action(DeleteInLavorazione)
    deleteInLavorazione({ dispatch }, action: DeleteInLavorazione) {
        this.attivitaUtenteService.deleteInLavorazione(action.sintesiRichiesta).subscribe(() => {
        }, () => dispatch(new ShowToastr(ToastrType.Error, 'Errore', 'Il server web non risponde', 5)));
    }

    @Action(AddPresaInCarico)
    addPresaInCarico({ dispatch }, action: AddPresaInCarico) {
        this.attivitaUtenteService.addPresaInCarico(action.sintesiRichiesta).subscribe(() => {
        }, () => dispatch(new ShowToastr(ToastrType.Error, 'Errore', 'Il server web non risponde', 5)));
    }

    @Action(DeletePresaInCarico)
    deletePresaInCarico({ dispatch }, action: DeletePresaInCarico) {
        this.attivitaUtenteService.deletePresaInCarico(action.sintesiRichiesta).subscribe(() => {
        }, () => dispatch(new ShowToastr(ToastrType.Error, 'Errore', 'Il server web non risponde', 5)));
    }

}
