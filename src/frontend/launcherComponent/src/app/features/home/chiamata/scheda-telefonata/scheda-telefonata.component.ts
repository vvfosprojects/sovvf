import { ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Localita } from 'src/app/shared/model/localita.model';
import { Coordinate } from 'src/app/shared/model/coordinate.model';
import { FormChiamataModel } from '../model/form-scheda-telefonata.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { TipologieInterface } from '../../../../shared/interface/tipologie';
import { SchedaTelefonataInterface } from '../model/scheda-telefonata.interface';
import { ChiamataMarker } from '../../maps/maps-model/chiamata-marker.model';
import { makeCopy, makeID } from '../../../../shared/helper/function';
import { AzioneChiamataEnum } from '../../../../shared/enum/azione-chiamata.enum';
import { Select, Store } from '@ngxs/store';
import { ShowToastr } from '../../../../shared/store/actions/toastr/toastr.actions';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from '../../../../shared/modal/confirm-modal/confirm-modal.component';
import { Utente } from '../../../../shared/model/utente.model';
import { ClearClipboard } from '../../store/actions/chiamata/clipboard.actions';
import { ReducerSchedaTelefonata, StartChiamata } from '../../store/actions/chiamata/scheda-telefonata.actions';
import { Richiedente } from '../../../../shared/model/richiedente.model';
import { StatoRichiesta } from '../../../../shared/enum/stato-richiesta.enum';
import { OFFSET_SYNC_TIME } from '../../../../core/settings/referral-time';
import { ToastrType } from '../../../../shared/enum/toastr';
import { SintesiRichiesta } from '../../../../shared/model/sintesi-richiesta.model';
import { UtenteState } from '../../../navbar/store/states/operatore/utente.state';
import { Observable } from 'rxjs';
import { SchedaTelefonataState } from '../../store/states/chiamata/scheda-telefonata.state';

@Component({
    selector: 'app-scheda-telefonata',
    templateUrl: './scheda-telefonata.component.html',
    styleUrls: ['./scheda-telefonata.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SchedaTelefonataComponent implements OnInit {

    options = {
        componentRestrictions: { country: ['IT', 'FR', 'AT', 'CH', 'SI'] }
    };
    chiamataCorrente: FormChiamataModel;
    chiamataMarker: ChiamataMarker;
    chiamataForm: FormGroup;
    coordinate: Coordinate;
    submitted = false;
    idChiamata: string;

    AzioneChiamataEnum = AzioneChiamataEnum;

    @Input() tipologie: TipologieInterface[];
    @Input() operatore: Utente;

    nuovaRichiesta: SintesiRichiesta;
    tipologiaRichiedente: string;
    isCollapsed = true;

    @Select(SchedaTelefonataState.resetChiamata) resetChiamata$: Observable<boolean>;

    constructor(private formBuilder: FormBuilder,
                private cdRef: ChangeDetectorRef,
                private store: Store,
                private modalService: NgbModal) {
        this.store.dispatch(new StartChiamata());
    }

    ngOnInit() {
        this.idChiamata = `${this.operatore.sede.codice}-${this.operatore.id}-${makeID(8)}`;
        this.chiamataForm = this.createForm();
        this.initNuovaRichiesta();
        this.cambiaTipologiaRichiedente('Nome-Cognome');
        this.nuovaRichiesta.istanteRicezioneRichiesta = new Date(new Date().getTime() + OFFSET_SYNC_TIME[0]);

        this.resetChiamata$.subscribe((reset: boolean) => {
            if (reset) {
                this.chiamataForm.reset();
            }
        });
    }

    createForm(): FormGroup {
        return this.formBuilder.group({
            selectedTipologie: [],
            nome: [null],
            cognome: [null],
            ragioneSociale: [null],
            telefono: [null, Validators.required],
            indirizzo: [null, Validators.required],
            etichette: [null],
            noteIndirizzo: [null],
            rilevanza: [null],
            notePrivate: [null],
            notePubbliche: [null],
            // descrizione: [null, Validators.required],
            descrizione: [null],
            zoneEmergenza: [null],
        });
    }

    get f() {
        return this.chiamataForm.controls;
    }

    initNuovaRichiesta() {
        this.nuovaRichiesta = new SintesiRichiesta(
            null,
            null,
            null,
            this.operatore,
            null,
            StatoRichiesta.Chiamata,
            0,
            null,
            null,
            null,
            null,
            null,
            null
        );
    }

    cambiaTipologiaRichiedente(tipologia: string) {
        this.tipologiaRichiedente = tipologia;
        if (tipologia === 'Nome-Cognome') {
            this.f.nome.setValidators(Validators.required);
            this.f.cognome.setValidators(Validators.required);
            this.f.ragioneSociale.clearValidators();
            this.f.ragioneSociale.reset();
        } else if (tipologia === 'RagioneSociale') {
            this.f.ragioneSociale.setValidators(Validators.required);
            this.f.nome.clearValidators();
            this.f.cognome.clearValidators();
            this.f.nome.reset();
            this.f.cognome.reset();
        }
        this.cdRef.detectChanges();
        // console.log(this.f);
    }

    setRilevanza() {
        if (this.f.rilevanza.value !== null) {
            this.f.rilevanza.setValue(null);
        } else {
            const date = new Date(new Date().getTime() + OFFSET_SYNC_TIME[0]).toDateString() + ' ' + new Date(new Date().getTime() + OFFSET_SYNC_TIME[0]).toTimeString().split(' ')[0];
            this.f.rilevanza.setValue(date);
        }
    }

    getChiamataForm() {
        console.log(this.f.descrizione.value);
        // Set form data
        const f = this.f;
        if (this.tipologiaRichiedente === 'Nome-Cognome') {
            this.nuovaRichiesta.richiedente = new Richiedente(f.telefono.value, f.nome.value, f.cognome.value, '');
        } else if (this.tipologiaRichiedente === 'RagioneSociale') {
            this.nuovaRichiesta.richiedente = new Richiedente(f.telefono.value, '', '', f.ragioneSociale.value);
        }
        // this.nuovaRichiesta.localita = new Localita(this.coordinate ? this.coordinate : null, f.indirizzo.value, f.noteIndirizzo.value);
        this.nuovaRichiesta.localita.note = f.noteIndirizzo.value;
        this.nuovaRichiesta.etichette = f.etichette.value ? f.etichette.value.split(' ') : null;
        this.nuovaRichiesta.rilevanza = f.rilevanza.value;
        this.nuovaRichiesta.descrizione = f.descrizione.value;
        this.nuovaRichiesta.zoneEmergenza = f.zoneEmergenza.value;
        this.nuovaRichiesta.notePrivate = f.notePrivate.value;
        this.nuovaRichiesta.notePubbliche = f.notePubbliche.value;
        this.nuovaRichiesta.istantePresaInCarico = new Date(new Date().getTime() + OFFSET_SYNC_TIME[0]);

        if (this.coordinate) {
            const marker: ChiamataMarker = makeCopy(this.chiamataMarker);
            if (marker.localita) {
                marker.localita.note = f.noteIndirizzo.value;
            }
        }
    }

    onAddTipologia(tipologia: any) {
        if (!this.nuovaRichiesta.tipologie) {
            this.nuovaRichiesta.tipologie = [];
            this.onAddTipologia(tipologia);
        } else {
            this.nuovaRichiesta.tipologie.push(tipologia);
        }
    }

    onRemoveTipologia(tipologia: any) {
        this.nuovaRichiesta.tipologie.splice(this.nuovaRichiesta.tipologie.indexOf(tipologia.codice), 1);
    }

    clearTipologieSelezionate() {
        this.f.selectedTipologie.patchValue([]);
        this.nuovaRichiesta.tipologie = [];
    }

    onAnnullaChiamata(): void {
        const modalConfermaAnnulla = this.modalService.open(ConfirmModalComponent, { backdropClass: 'light-blue-backdrop', centered: true });
        modalConfermaAnnulla.componentInstance.icona = { descrizione: 'trash', colore: 'danger' };
        modalConfermaAnnulla.componentInstance.titolo = 'Annulla Chiamata';
        modalConfermaAnnulla.componentInstance.messaggio = 'Sei sicuro di voler annullare la chiamata?';
        modalConfermaAnnulla.componentInstance.messaggioAttenzione = 'Tornerai alla lista eliminando tutti i dati inseriti.';
        modalConfermaAnnulla.componentInstance.bottoni = [
            { type: 'ko', descrizione: 'Annulla', colore: 'danger' },
            { type: 'ok', descrizione: 'Conferma', colore: 'dark' },
        ];

        modalConfermaAnnulla.result.then(
            (val) => {
                switch (val) {
                    case 'ok':
                        this.chiamataCorrente = null;
                        this.chiamataForm.reset();
                        this.nuovaRichiesta.tipologie = [];
                        this._statoChiamata('annullata');
                        break;
                    case 'ko':
                        console.log('Azione annullata');
                        break;
                }
                console.log('Modal chiusa con val ->', val);
            },
            (err) => console.error('Modal chiusa senza bottoni. Err ->', err)
        );
    }

    onResetChiamata(): void {
        const modalConfermaReset = this.modalService.open(ConfirmModalComponent, { backdropClass: 'light-blue-backdrop', centered: true });
        modalConfermaReset.componentInstance.icona = { descrizione: 'exclamation-triangle', colore: 'danger' };
        modalConfermaReset.componentInstance.titolo = 'Reset Chiamata';
        modalConfermaReset.componentInstance.messaggio = 'Sei sicuro di voler effettuare il reset della chiamata?';
        modalConfermaReset.componentInstance.messaggioAttenzione = 'Tutti i dati inseriti verranno eliminati.';
        modalConfermaReset.componentInstance.bottoni = [
            { type: 'ko', descrizione: 'Annulla', colore: 'danger' },
            { type: 'ok', descrizione: 'Conferma', colore: 'dark' },
        ];

        modalConfermaReset.result.then(
            (val) => {
                switch (val) {
                    case 'ok':
                        this.submitted = false;
                        this.chiamataForm.reset();
                        this.clearTipologieSelezionate();
                        this.coordinate = null;
                        this.store.dispatch(new ClearClipboard());
                        this._statoChiamata('reset');
                        break;
                    case 'ko':
                        console.log('Azione annullata');
                        break;
                }
                console.log('Modal chiusa con val ->', val);
            },
            (err) => console.error('Modal chiusa senza bottoni. Err ->', err)
        );
    }

    onCopiaIndirizzo(): void {
        this._statoChiamata('copiaIndirizzo');
    }

    onCercaIndirizzo(result: Address): void {
        this.coordinate = new Coordinate(result.geometry.location.lat(), result.geometry.location.lng());
        this.chiamataMarker = new ChiamataMarker(this.idChiamata, `${this.operatore.nome} ${this.operatore.cognome}`,
            new Localita(this.coordinate ? this.coordinate : null, result.formatted_address), null, true
        );
        this.nuovaRichiesta.localita = new Localita(this.coordinate ? this.coordinate : null, result.formatted_address, null);
        this._statoChiamata('cerca');
    }

    formIsValid(): boolean {
        let error = '';
        error += this.f.cognome.errors ? 'Cognome;' : '';
        error += this.f.nome.errors ? 'Nome;' : '';
        error += this.f.ragioneSociale.errors ? 'Ragione Sociale;' : '';
        error += this.f.telefono.errors ? 'Telefono;' : '';
        error += this.f.indirizzo.errors ? 'Indirizzo;' : '';

        const messageArr: string[] = error.split(/\s*(?:;|$)\s*/);
        let message = messageArr.join(', ');
        const title = messageArr.length > 1 ? 'Campi obbligatori:' : 'Campo obbligatorio:';
        if (messageArr.length > 0) {
            message = message.substring(0, message.length - 2);
            const type = ToastrType.Error;
            this.store.dispatch(new ShowToastr(ToastrType.Clear));
            this.store.dispatch(new ShowToastr(type, title, message));
        } else {
            this.store.dispatch(new ShowToastr(ToastrType.Clear));
        }
        return !!this.chiamataForm.invalid;
    }

    impostaAzioneChiamata($event) {
        this.onSubmit($event);
    }

    onSubmit(azione?: AzioneChiamataEnum) {
        this.submitted = true;
        if (this.formIsValid() || !this.coordinate) {
            console.error('Il form non è valido');
            return;
        }
        this.getChiamataForm();
        this._statoChiamata('inserita', azione);
    }

    _statoChiamata(tipo: string, azione?: AzioneChiamataEnum) {
        const schedaTelefonata: SchedaTelefonataInterface = {
            tipo: tipo,
            nuovaRichiesta: this.nuovaRichiesta,
            markerChiamata: this.chiamataMarker
        };
        if (azione) {
            schedaTelefonata.azioneChiamata = azione;
        }

        console.log('Scheda Telefonata', schedaTelefonata);
        this.store.dispatch(new ReducerSchedaTelefonata(schedaTelefonata));
    }
}
