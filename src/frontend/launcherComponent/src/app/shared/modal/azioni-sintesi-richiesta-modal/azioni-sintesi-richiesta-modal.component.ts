import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Select, Store } from '@ngxs/store';
import { Utente } from '../../model/utente.model';
import { AuthState } from '../../../features/auth/store/auth.state';
import { SintesiRichiesta } from '../../model/sintesi-richiesta.model';
import { StatoRichiestaActions } from '../../enum/stato-richiesta-actions.enum';
import { ActionRichiestaModalComponent } from '../action-richiesta-modal/action-richiesta-modal.component';
import { ActionRichiesta, AllertaSede, ModificaStatoFonogramma } from '../../../features/home/store/actions/richieste/richieste.actions';
import { TrasferimentoChiamataModalComponent } from '../trasferimento-chiamata-modal/trasferimento-chiamata-modal.component';
import { ClearFormTrasferimentoChiamata, RequestAddTrasferimentoChiamata } from '../../store/actions/trasferimento-chiamata-modal/trasferimento-chiamata-modal.actions';
import { AllertaSedeModalComponent } from '../allerta-sede-modal/allerta-sede-modal.component';
import { ModificaEntiModalComponent } from '../modifica-enti-modal/modifica-enti-modal.component';
import { ModificaFonogrammaModalComponent } from '../modifica-fonogramma-modal/modifica-fonogramma-modal.component';
import { ClearEventiRichiesta, SetIdRichiestaEventi } from '../../../features/home/store/actions/eventi-richiesta/eventi-richiesta.actions';
import { EventiRichiestaComponent } from '../../../features/home/eventi/eventi-richiesta.component';
import { PatchEntiIntervenutiRichiesta, PatchRichiesta } from '../../../features/home/store/actions/form-richiesta/richiesta-modifica.actions';
import { calcolaActionSuggeritaRichiesta, statoRichiestaActionsEnumToStringArray, statoRichiestaColor, defineChiamataIntervento } from '../../helper/function-richieste';
import { RubricaState } from '../../../features/rubrica/store/states/rubrica/rubrica.state';
import { Ente } from '../../interface/ente.interface';
import { StatoRichiesta } from '../../enum/stato-richiesta.enum';
import { EntiState } from '../../store/states/enti/enti.state';
import { RichiestaActionInterface } from '../../interface/richiesta-action.interface';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { StampaRichiestaService } from '../../../core/service/stampa-richieste/stampa-richiesta.service';
import { HttpEventType } from '@angular/common/http';

@Component({
    selector: 'app-azioni-sintesi-richiesta-modal',
    templateUrl: './azioni-sintesi-richiesta-modal.component.html',
    styleUrls: ['./azioni-sintesi-richiesta-modal.component.css']
})

export class AzioniSintesiRichiestaModalComponent implements OnInit, OnDestroy {

    @Select(AuthState.currentUser) user$: Observable<Utente>;
    utente: Utente;

    @Select(RubricaState.vociRubrica) vociRubrica$: Observable<Ente[]>;

    subscription: Subscription = new Subscription();

    richiesta: SintesiRichiesta;
    statoRichiestaString: Array<StatoRichiestaActions>;


    constructor(private modal: NgbActiveModal,
                private store: Store,
                private modalService: NgbModal,
                private stampaRichiestaService: StampaRichiestaService) {
        this.getUtente();
    }

    ngOnInit(): void {
        const exceptStati = [this.richiesta.stato, StatoRichiestaActions.Riaperta, calcolaActionSuggeritaRichiesta(this.richiesta)];
        this.statoRichiestaString = statoRichiestaActionsEnumToStringArray(exceptStati);
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    getUtente(): void {
        this.subscription.add(
            this.user$.subscribe((user: Utente) => {
                this.utente = user;
            })
        );
    }

    onClick(stato: StatoRichiestaActions): void {
        const codiceRichiesta = this.richiesta.codiceRichiesta ? this.richiesta.codiceRichiesta : this.richiesta.codice;
        let modalConferma;
        const modalOptions = {
            windowClass: 'modal-holder',
            backdropClass: 'light-blue-backdrop',
            size: 'lg',
            centered: true
        };

        switch (stato) {
            case StatoRichiestaActions.Chiusa:
                if (this.richiesta.stato === StatoRichiesta.Chiamata) {
                    modalOptions.size = 'xl';
                } else {
                    modalOptions.size = 'lg';
                }
                break;
            case StatoRichiestaActions.Sospesa:
                modalOptions.size = 'lg';
                break;
            case StatoRichiestaActions.Riaperta:
                modalOptions.size = 'lg';
                break;
        }

        modalConferma = this.modalService.open(ActionRichiestaModalComponent, modalOptions);
        modalConferma.componentInstance.icona = { descrizione: 'trash', colore: 'danger' };

        switch (stato) {
            case StatoRichiestaActions.Chiusa:
                if (this.richiesta.stato === StatoRichiesta.Chiamata) {
                    modalConferma.componentInstance.titolo = 'Chiusura ' + defineChiamataIntervento(this.richiesta.codice, this.richiesta.codiceRichiesta) + ' ' + codiceRichiesta;
                    const enti = this.store.selectSnapshot(EntiState.enti) as Ente[];
                    modalConferma.componentInstance.chiusuraChiamata = true;
                    modalConferma.componentInstance.enti = enti;
                } else {
                    modalConferma.componentInstance.titolo = 'Chiusura ' + defineChiamataIntervento(this.richiesta.codice, this.richiesta.codiceRichiesta) + ' ' + codiceRichiesta;
                    modalConferma.componentInstance.chiusuraIntervento = true;
                    modalConferma.componentInstance.motivazioniChiusuraIntervento = ['Non più necessario', 'Falso Allarme', 'Concluso'];
                    modalConferma.componentInstance.messaggioAttenzione = 'Tutti i mezzi diventeranno "In Rientro"';
                }
                break;

            case StatoRichiestaActions.Riaperta:
                modalConferma.componentInstance.titolo = 'Riapertura ' + defineChiamataIntervento(this.richiesta.codice, this.richiesta.codiceRichiesta) + ' ' + codiceRichiesta;
                modalConferma.componentInstance.riapertura = true;
                modalConferma.componentInstance.messaggio = 'Sei sicuro di voler riaprire ' + defineChiamataIntervento(this.richiesta.codice, this.richiesta.codiceRichiesta) + ' ' + codiceRichiesta + '?';
                break;

            default:
                break;
        }

        const richiestaAction = {
            idRichiesta: null,
            stato,
            motivazione: null,
            entiIntervenuti: null
        } as RichiestaActionInterface;

        modalConferma.result.then(
            (val) => {
                switch (val.esito) {
                    case 'ok':
                        richiestaAction.idRichiesta = this.richiesta.id;
                        richiestaAction.motivazione = val?.motivazione;
                        richiestaAction.entiIntervenuti = val?.entiIntervenuti;
                        this.store.dispatch(new ActionRichiesta(richiestaAction));
                        this.modal.close({ status: 'ko' });
                        break;
                    case 'ko':
                        break;
                }
            }
        );
    }

    onAddTrasferimentoChiamata(codiceRichiesta: string): void {
        let addTrasferimentoChiamataModal;
        addTrasferimentoChiamataModal = this.modalService.open(TrasferimentoChiamataModalComponent, {
            windowClass: 'modal-holder',
            backdropClass: 'light-blue-backdrop',
            centered: true,
            size: 'lg'
        });
        addTrasferimentoChiamataModal.componentInstance.codRichiesta = codiceRichiesta;
        addTrasferimentoChiamataModal.result.then(
            (result: { success: boolean }) => {
                if (result.success) {
                    this.addTrasferimentoChiamata();
                    this.modal.close({ status: 'ko' });
                } else if (!result.success) {
                    this.store.dispatch(new ClearFormTrasferimentoChiamata());
                    console.log('Modal "addVoceTrasferimentoChiamata" chiusa con val ->', result);
                }
            },
            (err) => {
                this.store.dispatch(new ClearFormTrasferimentoChiamata());
                console.error('Modal chiusa senza bottoni. Err ->', err);
            }
        );
    }

    onAllertaSede(): void {
        let modalAllertaSede;
        modalAllertaSede = this.modalService.open(AllertaSedeModalComponent, {
            windowClass: 'modal-holder',
            backdropClass: 'light-blue-backdrop',
            centered: true,
            size: 'lg',
            keyboard: false,
        });
        modalAllertaSede.componentInstance.codRichiesta = this.richiesta.codice;
        modalAllertaSede.result.then((res: { status: string, result: any }) => {
            switch (res.status) {
                case 'ok' :
                    this.store.dispatch(new AllertaSede(res.result));
                    break;
                case 'ko':
                    break;
            }
        });
    }

    onStampaPDF(): void {
        let modalConfermaReset;
        modalConfermaReset = this.modalService.open(ConfirmModalComponent, {
            windowClass: 'modal-holder',
            backdropClass: 'light-blue-backdrop',
            centered: true
        });
        modalConfermaReset.componentInstance.icona = { descrizione: 'exclamation-triangle', colore: 'danger' };
        modalConfermaReset.componentInstance.titolo = !this.richiesta.codiceRichiesta ? 'STAMPA CHIAMATA' : 'STAMPA INTERVENTO';
        modalConfermaReset.componentInstance.messaggio = 'Sei sicuro di voler eseguire la stampa?';
        modalConfermaReset.componentInstance.messaggioAttenzione = 'Verrà effettuato il download automatico.';
        modalConfermaReset.componentInstance.stampa = true;

        modalConfermaReset.result.then(
            (val) => {
                switch (val.slice(0, 2)) {
                    case 'ok':
                        const obj = {
                            idRichiesta: this.richiesta.codiceRichiesta ? this.richiesta.codiceRichiesta : this.richiesta.codice,
                            contentType: val.slice(2, 5) === 'csv' ? 'text/' + val.slice(2, 5) : 'application/' + val.slice(2, 5),
                        };
                        this.stampaRichiestaService.getStampaRichiesta(obj).subscribe((data: any) => {
                            switch (data.type) {
                                case HttpEventType.DownloadProgress :
                                    break;
                                case HttpEventType.Response :
                                    const downloadedFile = new Blob([data.body], { type: data.body.type });
                                    const a = document.createElement('a');
                                    a.setAttribute('style', 'display:none;');
                                    document.body.appendChild(a);
                                    a.download = val.slice(2, 5) === 'csv' ? 'Stampa:' + obj.idRichiesta + '.csv' : 'Stampa:' + obj.idRichiesta;
                                    a.href = URL.createObjectURL(downloadedFile);
                                    a.target = '_blank';
                                    a.click();
                                    document.body.removeChild(a);
                                    break;
                            }
                        }, error => console.log('Errore Stampa ' + val.slice(2, 5).toUpperCase()));
                        break;
                    case 'ko':
                        break;
                }
                console.log('Modal chiusa con val ->', val);
            },
            (err) => console.error('Modal chiusa senza bottoni. Err ->', err)
        );
    }

    onModificaEntiIntervenuti(): void {
        let modalModificaEntiIntervenuti;
        modalModificaEntiIntervenuti = this.modalService.open(ModificaEntiModalComponent, {
            windowClass: 'modal-holder',
            backdropClass: 'light-blue-backdrop',
            centered: true
        });
        // modalModificaEntiIntervenuti.componentInstance.enti = this.richiesta.listaEnti ? this.richiesta.listaEnti : null;
        modalModificaEntiIntervenuti.componentInstance.listaEntiIntervenuti = this.richiesta?.codEntiIntervenuti?.length ? this.richiesta.codEntiIntervenuti : null;
        modalModificaEntiIntervenuti.result.then((res: { status: string, result: any }) => {
            switch (res.status) {
                case 'ok' :
                    const idRichiesta = this.richiesta.id;
                    const codEntiIntervenuti = res.result.listaEnti;
                    this.store.dispatch(new PatchEntiIntervenutiRichiesta(idRichiesta, codEntiIntervenuti));
                    this.chiudiModalAzioniSintesi('ok');
                    break;
                case 'ko':
                    break;
            }
        });
    }

    onModificaStatoFonogramma(): void {
        let modalModificaStatoFonogramma;
        modalModificaStatoFonogramma = this.modalService.open(ModificaFonogrammaModalComponent, {
            windowClass: 'modal-holder',
            backdropClass: 'light-blue-backdrop',
            centered: true
        });
        modalModificaStatoFonogramma.componentInstance.codiceRichiesta = this.richiesta.codiceRichiesta ? this.richiesta.codiceRichiesta : this.richiesta.codice;
        modalModificaStatoFonogramma.componentInstance.idRichiesta = this.richiesta.id;
        modalModificaStatoFonogramma.componentInstance.titolo = !this.richiesta.codiceRichiesta ? 'Chiamata' : 'Intervento';
        modalModificaStatoFonogramma.componentInstance.fonogramma = this.richiesta.fonogramma;
        modalModificaStatoFonogramma.result.then((res: { status: string, result: any }) => {
            switch (res.status) {
                case 'ok' :
                    this.store.dispatch(new ModificaStatoFonogramma(res.result));
                    break;
                case 'ko':
                    break;
            }
        });
    }

    addTrasferimentoChiamata(): void {
        this.store.dispatch(new RequestAddTrasferimentoChiamata());
    }

    visualizzaEventiRichiesta(codice: string): void {
        this.store.dispatch(new SetIdRichiestaEventi(codice));
        let modal;
        modal = this.modalService.open(EventiRichiestaComponent, {
            windowClass: 'xlModal',
            backdropClass: 'light-blue-backdrop',
            centered: true,
            backdrop: true
        });
        modal.result.then(() => {},
            () => this.store.dispatch(new ClearEventiRichiesta()));
    }

    chiudiModalAzioniSintesi(closeRes: string): void {
        if (closeRes) {
            this.modal.close({ status: 'ko' });
        }
    }

    calcolaActionSuggeritaRichiesta(richiesta: SintesiRichiesta): StatoRichiestaActions {
        return calcolaActionSuggeritaRichiesta(richiesta);
    }

    statoRichiestaColor(richiesta: SintesiRichiesta): string {
        return statoRichiestaColor(richiesta.stato);
    }

    defineChiamataIntervento(codice: string, codiceRichiesta: string): string {
        return defineChiamataIntervento(codice, codiceRichiesta);
    }

}
