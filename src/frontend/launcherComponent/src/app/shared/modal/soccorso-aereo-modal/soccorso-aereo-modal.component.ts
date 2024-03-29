import { Component, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Select, Store } from '@ngxs/store';
import { ComposizioneSoccorsoAereoState } from '../../../features/home/store/states/composizione-partenza/composizione-soccorso-aereo.state';
import { AuthState } from '../../../features/auth/store/auth.state';
import { Utente } from '../../model/utente.model';
import { SintesiRichiesta } from '../../model/sintesi-richiesta.model';
import { CompPartenzaService } from '../../../core/service/comp-partenza-service/comp-partenza.service';
import { makeCopy } from '../../helper/function-generiche';
import { ShowToastr } from '../../store/actions/toastr/toastr.actions';
import { ToastrType } from '../../enum/toastr';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-soccorso-aereo-modal',
    templateUrl: './soccorso-aereo-modal.component.html',
    styleUrls: ['./soccorso-aereo-modal.component.css']
})

export class SoccorsoAereoModalComponent implements OnDestroy {

    @Select(AuthState.currentUser) user$: Observable<Utente>;
    utente: Utente;
    @Select(ComposizioneSoccorsoAereoState.azioniRichieste) azioniRichiesta$: Observable<any>;
    azioniRichiesta: any[];

    richiesta: SintesiRichiesta;
    subscription: Subscription = new Subscription();
    tipologiaChecked = false;
    motivazione: string;

    loading: boolean;
    submitted: boolean;
    errorMsg: string;

    constructor(private modal: NgbActiveModal, private store: Store, private compPartenzaService: CompPartenzaService) {
        this.getUtente();
        this.getAzioniRichiesta();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    onCheck(i: number): void {
        this.azioniRichiesta[i].checked = !this.azioniRichiesta[i].checked;
        this.tipologiaChecked = !!this.azioniRichiesta.find(x => x.checked);
    }

    chiudiModalSoccorsoAereo(closeRes: string): void {
        const requestType = [];
        const requestTypeCode = [];
        if (closeRes === 'ok') {
            this.submitted = true;
            this.azioniRichiesta.forEach(x => x.checked ? requestType.push(x.descrizione) : null);
            this.azioniRichiesta.forEach(x => x.checked ? requestTypeCode.push(x.codice) : null);
            const obj: any = {
                description: this.motivazione ? this.motivazione : '',
                requestKey: this.richiesta.codice,
                requestType: requestType.join(', '),
                requestTypeCode: '',
                operatorName: this.utente.nome,
                operatorSurname: this.utente.cognome,
                operatorFiscalCode: this.utente.codiceFiscale,
                lat: this.richiesta.localita.coordinate.latitudine,
                lng: this.richiesta.localita.coordinate.longitudine,
            };
            this.loading = true;
            this.setErrorMsg();
            this.compPartenzaService.addSoccorsoAereo(obj).subscribe(() => {
                this.loading = false;
                this.store.dispatch(new ShowToastr(ToastrType.Success, 'Richiesta Soccorso Aereo', 'Richiesta avvenuta con successo'));
                this.modal.close({ status: 'ok' });
            }, (error: HttpErrorResponse) => {
                this.loading = false;
                this.submitted = false;
                this.setErrorMsg(error.error);
            });
        } else {
            this.modal.close({ status: 'ko' });
        }
    }

    setErrorMsg(errorMsg?: string): void {
        this.errorMsg = errorMsg;
    }

    getUtente(): void {
        this.subscription.add(
            this.user$.subscribe((user: Utente) => {
                this.utente = user;
            })
        );
    }

    getAzioniRichiesta(): void {
        this.subscription.add(
            this.azioniRichiesta$.subscribe((azioniRichiesta: any) => {
                this.azioniRichiesta = makeCopy(azioniRichiesta);
                if (this.azioniRichiesta) {
                    this.azioniRichiesta.forEach(x => x.checked = false);
                }
            })
        );
    }

}
