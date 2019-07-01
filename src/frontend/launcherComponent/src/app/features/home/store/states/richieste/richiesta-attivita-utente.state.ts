import { Action, State } from '@ngxs/store';
import { ShowToastr } from '../../../../../shared/store/actions/toastr/toastr.actions';
import { ToastrType } from '../../../../../shared/enum/toastr';
import { AttivitaUtenteService } from '../../../../../core/service/attivita-utente-service/attivita-utente.service';
import { AddInLavorazione, DeleteInLavorazione } from '../../actions/richieste/richiesta-attivita-utente.actions';

@State({
    name: 'richiestaAttivitaUtente'
})
export class RichiestaAttivitaUtenteState {

    constructor(private attivitaUtenteService: AttivitaUtenteService) {
    }

    @Action(AddInLavorazione)
    addInLavorazione({ dispatch }, action: AddInLavorazione) {
        this.attivitaUtenteService.addInLavorazione(action.sintesiRichiesta).subscribe(() => {
            console.log('addInLavorazione');
        }, () => dispatch(new ShowToastr(ToastrType.Error, 'Errore', 'Il server web non risponde', 5)));
    }

    @Action(DeleteInLavorazione)
    DeleteInLavorazione({ dispatch }, action: DeleteInLavorazione) {
        this.attivitaUtenteService.deleteInLavorazione(action.sintesiRichiesta).subscribe(() => {
            console.log('deleteInLavorazione');
        }, () => dispatch(new ShowToastr(ToastrType.Error, 'Errore', 'Il server web non risponde', 5)));
    }
}
