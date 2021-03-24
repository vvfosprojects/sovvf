import { Component, Input, OnChanges, OnDestroy, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { Localita } from 'src/app/shared/model/localita.model';
import { Coordinate } from 'src/app/shared/model/coordinate.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { SchedaTelefonataInterface } from '../../../../shared/interface/scheda-telefonata.interface';
import { ChiamataMarker } from '../../maps/maps-model/chiamata-marker.model';
import { makeID, roundToDecimal } from '../../../../shared/helper/function';
import { AzioneChiamataEnum } from '../../../../shared/enum/azione-chiamata.enum';
import { Store } from '@ngxs/store';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Utente } from '../../../../shared/model/utente.model';
import { ClearClipboard } from '../../store/actions/form-richiesta/clipboard.actions';
import { ReducerSchedaTelefonata, StartChiamata } from '../../store/actions/form-richiesta/scheda-telefonata.actions';
import { StatoRichiesta } from '../../../../shared/enum/stato-richiesta.enum';
import { OFFSET_SYNC_TIME } from '../../../../core/settings/referral-time';
import { SintesiRichiesta } from '../../../../shared/model/sintesi-richiesta.model';
import { Subscription } from 'rxjs';
import { DelChiamataMarker } from '../../store/actions/maps/chiamate-markers.actions';
import { Tipologia } from '../../../../shared/model/tipologia.model';
import { SchedaContatto } from 'src/app/shared/interface/scheda-contatto.interface';
import { HomeState } from '../../store/states/home.state';
import { Options } from 'ngx-google-places-autocomplete/objects/options/options';
import { LatLngBounds } from 'ngx-google-places-autocomplete/objects/latLngBounds';
import { ComponentRestrictions } from 'ngx-google-places-autocomplete/objects/options/componentRestrictions';
import { GOOGLEPLACESOPTIONS } from '../../../../core/settings/google-places-options';
import { Ente } from 'src/app/shared/interface/ente.interface';
import { ConfirmModalComponent } from '../../../../shared/modal/confirm-modal/confirm-modal.component';
import { ListaSchedeContattoModalComponent } from '../../../../shared/modal/lista-schede-contatto-modal/lista-schede-contatto-modal.component';
import { InterventiProssimitaModalComponent } from '../../../../shared/modal/interventi-prossimita-modal/interventi-prossimita-modal.component';
import { Sede } from '../../../../shared/model/sede.model';
import { TriageChiamataModalComponent } from '../../../../shared/modal/triage-chiamata-modal/triage-chiamata-modal.component';
import { ToggleModifica } from '../../store/actions/view/view.actions';
import { ChiudiRichiestaModifica, ClearRichiestaModifica, ModificaIndirizzo } from '../../store/actions/form-richiesta/richiesta-modifica.actions';
import {
    ClearDettaglioTipologiaTriageChiamata,
    ClearDettagliTipologie,
    ClearTipologiaTriageChiamata,
    ClearTriageChiamata,
    GetDettagliTipologieByCodTipologia
} from '../../../../shared/store/actions/triage-modal/triage-modal.actions';
import { DettaglioTipologia } from '../../../../shared/interface/dettaglio-tipologia.interface';
import { TriageSummary } from '../../../../shared/interface/triage-summary.interface';
import { ClearTriageSummary, SetTriageSummary } from '../../../../shared/store/actions/triage-summary/triage-summary.actions';
import { getPrioritaTriage } from '../../../../shared/helper/function-triage';
import { ClearRichiestaMarkerModifica } from '../../store/actions/maps/richieste-markers.actions';
import { CheckboxInterface } from '../../../../shared/interface/checkbox.interface';
import { UpdateFormValue } from '@ngxs/form-plugin';

@Component({
    selector: 'app-form-richiesta',
    templateUrl: './form-richiesta.component.html',
    styleUrls: ['./form-richiesta.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class FormRichiestaComponent implements OnChanges, OnDestroy {

    @Input() tipologie: Tipologia[];
    @Input() operatore: Utente;
    @Input() competenze: Sede[];
    @Input() countInterventiProssimita: number;
    @Input() interventiProssimita: SintesiRichiesta[];
    @Input() enti: Ente[];
    @Input() disabledInviaPartenza = false;
    @Input() doubleMonitor: boolean;
    @Input() resetChiamata: boolean;
    @Input() schedaContatto: SchedaContatto;

    // Modifica
    @Input() modifica: boolean;
    @Input() richiestaModifica: SintesiRichiesta;

    // Triage Summary
    @Input() triageSummary: TriageSummary[];

    ngxGooglePlacesOptions: Options;

    chiamataMarker: ChiamataMarker;
    idChiamata: string;
    AzioneChiamataEnum = AzioneChiamataEnum;

    nuovaRichiesta: SintesiRichiesta;

    listaEnti: Ente[];
    scorciatoieTelefono = {
        112: false,
        113: false,
        118: false,
        'VV.UU.': false,
    };

    richiestaForm: FormGroup;
    submitted = false;

    private subscription = new Subscription();

    constructor(private formBuilder: FormBuilder,
                private store: Store,
                private modalService: NgbModal) {
        this.store.dispatch(new StartChiamata());
        this.ngxGooglePlacesOptions = new Options({
            bounds: this.store.selectSnapshot(HomeState.bounds) as unknown as LatLngBounds,
            componentRestrictions: GOOGLEPLACESOPTIONS.componentRestrictions as unknown as ComponentRestrictions
        });
        this.richiestaForm = this.createAndGetForm();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes) {
            if (changes.operatore?.currentValue) {
                const operatore = changes.operatore.currentValue;
                this.f.operatore.patchValue(operatore);
                this.idChiamata = makeIdChiamata(operatore);
            }
            if (changes.schedaContatto?.currentValue) {
                const schedaContatto = changes.schedaContatto.currentValue;
                if (schedaContatto && schedaContatto.codiceScheda) {
                    this.setSchedaContatto(schedaContatto);
                }
            }
            if (changes.resetChiamata?.currentValue) {
                const reset = changes.resetChiamata.currentValue;
                if (reset) {
                    this.richiestaForm.reset();
                }
            }
            if (changes.richiestaModifica?.currentValue) {
                const richiestaModifica = changes.richiestaModifica.currentValue;
                if (richiestaModifica) {
                    this.modifica = true;
                    this.patchForm();
                }
            }
            if (changes.triageSummary?.currentValue) {
                const triageSummary = changes.triageSummary.currentValue;
                if (triageSummary) {
                    setPrioritaByTriageSummary(this.f, triageSummary);
                }
            }

            function makeIdChiamata(operatore: Utente): string {
                return `${operatore.sede.codice}-${operatore.id}-${makeID(8)}`;
            }
        }
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
        this.clearFormDisconnection();
        if (this.richiestaModifica) {
            this.store.dispatch([
                new ClearRichiestaMarkerModifica(),
                new ChiudiRichiestaModifica()
            ]);
        }
        clearSummaryData(this.store);
    }

    clearFormDisconnection(): void {
        this.submitted = false;
        this.richiestaForm.reset();
        this.clearTipologieSelezionate();
        this.store.dispatch(new ClearClipboard());
        this.reducerSchedaTelefonata('reset');
        this.store.dispatch(new DelChiamataMarker(this.idChiamata));
    }

    createAndGetForm(): FormGroup {
        return this.formBuilder.group({
            id: [null],
            codice: [null],
            codiceRichiesta: [null],
            operatore: [null],
            codTipologia: [null, Validators.required],
            dettaglioTipologia: [null],
            istanteRicezioneRichiesta: [new Date(new Date().getTime() + OFFSET_SYNC_TIME[0])],
            nominativo: [null, Validators.required],
            telefono: [null, [Validators.required, Validators.pattern('^(\\+?)[0-9]+$')]],
            indirizzo: [null, Validators.required],
            latitudine: [null, [Validators.required, Validators.pattern('^(\\-?)([0-9]+)(\\.)([0-9]+)$')]],
            longitudine: [null, [Validators.required, Validators.pattern('^(\\-?)([0-9]+)(\\.)([0-9]+)$')]],
            codSchedaContatto: [{ value: null, disabled: true }],
            piano: [null],
            palazzo: [null],
            scala: [null],
            interno: [null],
            listaEnti: [null],
            etichette: [null],
            noteIndirizzo: [null],
            rilevanzaGrave: [false],
            rilevanzaStArCu: [false],
            notePrivate: [null],
            notePubbliche: [null],
            descrizione: [null],
            zoneEmergenza: [null],
            prioritaRichiesta: [3, Validators.required],
            stato: [StatoRichiesta.Chiamata],
            urgenza: [false]
        });
    }

    patchForm(): void {
        this.richiestaForm.patchValue({
            id: this.richiestaModifica.id,
            codice: this.richiestaModifica.codice,
            codiceRichiesta: this.richiestaModifica.codiceRichiesta,
            operatore: this.operatore,
            codTipologia: this.richiestaModifica.tipologie[0].codice,
            dettaglioTipologia: this.richiestaModifica.dettaglioTipologia,
            istanteRicezioneRichiesta: this.richiestaModifica.istanteRicezioneRichiesta,
            nominativo: this.richiestaModifica.richiedente.nominativo,
            telefono: this.richiestaModifica.richiedente.telefono,
            indirizzo: this.richiestaModifica.localita.indirizzo,
            latitudine: this.richiestaModifica.localita.coordinate.latitudine,
            longitudine: this.richiestaModifica.localita.coordinate.longitudine,
            codSchedaContatto: this.richiestaModifica.codiceSchedaNue,
            piano: this.richiestaModifica.localita.piano,
            palazzo: this.richiestaModifica.localita.palazzo,
            scala: this.richiestaModifica.localita.scala,
            interno: this.richiestaModifica.localita.interno,
            listaEnti: this.richiestaModifica.listaEnti,
            etichette: this.richiestaModifica.tags,
            noteIndirizzo: this.richiestaModifica.localita.note,
            rilevanzaGrave: this.richiestaModifica.rilevanteGrave,
            rilevanzaStArCu: this.richiestaModifica.rilevanteStArCu,
            notePrivate: this.richiestaModifica.notePrivate,
            notePubbliche: this.richiestaModifica.notePubbliche,
            descrizione: this.richiestaModifica.descrizione,
            zoneEmergenza: this.richiestaModifica.zoneEmergenza,
            prioritaRichiesta: this.richiestaModifica.prioritaRichiesta,
            stato: StatoRichiesta.Chiamata,
            urgenza: this.richiestaModifica.chiamataUrgente
        });
        this.f.codTipologia.disable();
        this.patchScorciatoiaNumero(this.richiestaModifica.richiedente.telefono);
    }

    get f(): any {
        return this.richiestaForm.controls;
    }

    onChangeTipologia(codTipologia: string): void {
        if (codTipologia && !this.richiestaModifica) {
            this.openTriage();
        }
    }

    clearTipologieSelezionate(): void {
        this.f.codTipologia.patchValue(null);
    }

    checkTipologie(): boolean {
        return !!(this.f.codTipologia.value);
    }

    getTipologia(codTipologia: string): Tipologia {
        return this.tipologie?.filter((t: Tipologia) => t.codice === codTipologia)[0];
    }

    onCopiaIndirizzo(): void {
        this.reducerSchedaTelefonata('copiaIndirizzo');
    }

    onCercaIndirizzo(result: Address): void {
        if (!this.richiestaModifica) {
            this.onSetIndirizzo(result);
        } else {
            this.onModificaIndirizzo(result);
        }
    }

    onSetIndirizzo(result: Address): void {
        const lat = roundToDecimal(result.geometry.location.lat(), 6);
        const lng = roundToDecimal(result.geometry.location.lng(), 6);
        const coordinate = new Coordinate(lat, lng);
        this.chiamataMarker = new ChiamataMarker(this.idChiamata, `${this.operatore.nome} ${this.operatore.cognome}`, `${this.operatore.sede.codice}`,
            new Localita(coordinate ? coordinate : null, result.formatted_address), null
        );
        this.f.indirizzo.patchValue(result.formatted_address);
        this.f.latitudine.patchValue(lat);
        this.f.longitudine.patchValue(lng);
        this.reducerSchedaTelefonata('cerca');
    }

    onModificaIndirizzo(result: Address): void {
        const coordinate = new Coordinate(roundToDecimal(result.geometry.location.lat(), 6), roundToDecimal(result.geometry.location.lng(), 6));
        this.f.latitudine.patchValue(coordinate.latitudine);
        this.f.longitudine.patchValue(coordinate.longitudine);
        this.f.indirizzo.patchValue(result.formatted_address);
        const nuovoIndirizzo = new Localita(coordinate ? coordinate : null, result.formatted_address);
        this.store.dispatch(new ModificaIndirizzo(nuovoIndirizzo));
    }

    modificaIndirizzo(): void {
        if (this.richiestaModifica) {
            const address = this.f.indirizzo;
            if (address.touched || address.dirty) {
                this.f.latitudine.patchValue(null);
                this.f.longitudine.patchValue(null);
            }
        }
    }

    onMsgIndirizzo(): string {
        let msg = '';
        const coordinate = new Coordinate(this.f.latitudine.value, this.f.longitudine.value);
        if (this.f.indirizzo.errors && !coordinate) {
            msg = 'L\'indirizzo è richiesto';
        } else if (this.f.indirizzo.errors) {
            msg = 'L\'indirizzo è richiesto';
        } else if (!coordinate) {
            msg = 'È necessario selezionare un indirizzo dall\'elenco';
        } else {
            return null;
        }
        return msg;
    }

    onShowInterventiProssimita(): void {
        let modalInterventiProssimita;
        if (this.doubleMonitor) {
            modalInterventiProssimita = this.modalService.open(InterventiProssimitaModalComponent, {
                windowClass: 'modal-holder modal-left',
                backdropClass: 'light-blue-backdrop',
                centered: true,
                size: 'xl',
            });
        } else {
            modalInterventiProssimita = this.modalService.open(InterventiProssimitaModalComponent, {
                windowClass: 'modal-holder',
                backdropClass: 'light-blue-backdrop',
                centered: true,
                size: 'xl',
            });
        }
        modalInterventiProssimita.componentInstance.interventiVicinanze = this.interventiProssimita;
        modalInterventiProssimita.componentInstance.countInterventiVicinanze = this.countInterventiProssimita;
        modalInterventiProssimita.componentInstance.doubleMonitor = this.doubleMonitor;
        modalInterventiProssimita.result.then(
            (val) => {
                switch (val) {
                    case 'ok':
                        console.log('Test Ok');
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

    openModalSchedeContatto(): void {
        let modalOptions: any;
        if (this.doubleMonitor) {
            modalOptions = {
                windowClass: 'xxlModal modal-holder modal-left',
                backdropClass: 'light-blue-backdrop',
                centered: true
            };
        } else {
            modalOptions = {
                windowClass: 'xxlModal modal-holder',
                backdropClass: 'light-blue-backdrop',
                centered: true
            };
        }
        const schedeContatto = this.modalService.open(ListaSchedeContattoModalComponent, modalOptions);
        schedeContatto.componentInstance.doubleMonitor = this.doubleMonitor;
    }

    openTriage(): void {
        const codTipologia = this.f.codTipologia.value;
        this.store.dispatch(new GetDettagliTipologieByCodTipologia(+codTipologia));
        let modalOptions: any;
        if (this.doubleMonitor) {
            modalOptions = {
                windowClass: 'modal-holder modal-left',
                backdropClass: 'light-blue-backdrop',
                centered: true,
                size: 'lg'
            };
        } else {
            modalOptions = {
                windowClass: 'modal-holder',
                backdropClass: 'light-blue-backdrop',
                centered: true,
                size: 'lg'
            };
        }
        const triageModal = this.modalService.open(TriageChiamataModalComponent, modalOptions);
        triageModal.componentInstance.tipologiaSelezionata = this.tipologie.filter((t: Tipologia) => t.codice === codTipologia)[0];
        triageModal.componentInstance.dettaglioTipologiaSelezionato = this.f.dettaglioTipologia.value;
        triageModal.componentInstance.chiamataMarker = this.chiamataMarker;
        triageModal.componentInstance.checkedUrgenza = !!(this.f.urgenza.value);
        triageModal.componentInstance.disableUrgenza = this.formIsInvalid() || !!(this.f.urgenza.value);
        triageModal.result.then((res: TriageModalResult) => {
            switch (res.type) {
                case 'success':
                    console.log('TriageModalResult', res);
                    if (res?.dettaglio) {
                        this.f.dettaglioTipologia.patchValue(res.dettaglio);
                        this.store.dispatch(new UpdateFormValue({
                            path: 'schedaTelefonata.richiestaForm',
                            value: {
                                dettaglioTipologia: res.dettaglio
                            }
                        }));
                    }
                    if (res?.triageSummary?.length) {
                        saveTriageSummary(this.store, res.triageSummary);
                    }
                    clearTriageChiamataModalData(this.store);
                    break;
                case 'dismiss':
                    console.log('TriageModalResult', res);
                    if (res?.dettaglio) {
                        this.f.dettaglioTipologia.patchValue(res.dettaglio);
                        this.store.dispatch(new UpdateFormValue({
                            path: 'schedaTelefonata.richiestaForm',
                            value: {
                                dettaglioTipologia: res.dettaglio
                            }
                        }));
                    } else {
                        this.f.dettaglioTipologia.patchValue(null);
                        this.store.dispatch(new UpdateFormValue({
                            path: 'schedaTelefonata.richiestaForm',
                            value: {
                                dettaglioTipologia: null
                            }
                        }));
                    }
                    resetPrioritaRichiesta(this.f);
                    clearTriageSummary(this.store);
                    clearTriageChiamataModalData(this.store);
                    break;
                default:
                    console.log('TriageModalResult: default');
                    this.f.dettaglioTipologia.patchValue(null);
                    resetPrioritaRichiesta(this.f);
                    clearTriageSummary(this.store);
                    clearTriageChiamataModalData(this.store);
                    break;
            }
        });

        interface TriageModalResult {
            type: string;
            dettaglio: DettaglioTipologia;
            triageSummary: TriageSummary[];
        }
    }

    setSchedaContatto(scheda: SchedaContatto): void {
        console.log('setSchedaContatto', scheda);
        const f = this.f;
        f.codSchedaContatto.patchValue(scheda.codiceScheda);
        f.nominativo.patchValue(scheda.richiedente.nominativo);
        f.telefono.patchValue(scheda.richiedente.telefono);
        f.indirizzo.patchValue(scheda.localita.indirizzo);

        const lat = scheda.localita.coordinate.latitudine;
        const lng = scheda.localita.coordinate.longitudine;
        const coordinate = new Coordinate(lat, lng);
        this.chiamataMarker = new ChiamataMarker(this.idChiamata, `${this.operatore.nome} ${this.operatore.cognome}`, `${this.operatore.sede.codice}`,
            new Localita(coordinate ? coordinate : null, scheda.localita.indirizzo), null
        );
        this.f.latitudine.patchValue(lat);
        this.f.longitudine.patchValue(lng);
        this.reducerSchedaTelefonata('cerca');
    }

    checkInputPattern(event: any, type: string): void {
        let regexp;
        switch (type) {
            case 'PHONE':
                regexp = /^[0-9\+]*$/;
                break;
            case 'LAT_LON':
                regexp = /^[0-9\.\-]$/;
                break;
        }

        let inputValue;
        if (event instanceof ClipboardEvent) {
            inputValue = event.clipboardData.getData('Text');
        } else {
            inputValue = event.key;
        }

        if (!regexp.test(inputValue)) {
            event.preventDefault();
        }
    }

    onCheckScorciatoiaNumero(scorciatoia: string): void {
        const f = this.f;
        if (this.scorciatoieTelefono[scorciatoia]) {
            this.scorciatoieTelefono[scorciatoia] = false;
            f.telefono.patchValue('');
            f.nominativo.patchValue('');
        } else {
            Object.keys(this.scorciatoieTelefono).forEach(x => this.scorciatoieTelefono[x] = x === scorciatoia);
            f.telefono.patchValue(scorciatoia);
            let nominativo = null;
            switch (scorciatoia) {
                case '112':
                    nominativo = 'Carabinieri';
                    break;
                case '113':
                    nominativo = 'Polizia';
                    break;
                case '118':
                    nominativo = 'Ambulanza';
                    break;
                case 'VV.UU.':
                    nominativo = 'Polizia Municipale';
                    break;
            }
            f.nominativo.patchValue(nominativo);
        }
    }

    patchScorciatoiaNumero(scorciatoia: string): void {
        this.scorciatoieTelefono[scorciatoia] = true;
    }

    getCheckboxUrgenzaState(): CheckboxInterface {
        const id = 'check-chiamata-emergenza';
        const status = this.f.urgenza.value;
        const label = this.f.urgenza.value ? 'URGENZA SEGNALATA' : 'SEGNALA URGENZA E CONDIVIDI IN GESTIONE';
        const disabled = this.f.urgenza.value || this.formIsInvalid() || (this.richiestaModifica && !this.f.urgenza.value);
        return { id, status, label, disabled };
    }

    setUrgenza(): void {
        if (this.checkSubmit() && !this.f.urgenza.value && !this.richiestaModifica) {
            this.f.urgenza.patchValue(true);
            this.onSubmit(AzioneChiamataEnum.MettiInCoda, { urgente: true });
        }
    }

    onInAttesa(): void {
        if (this.checkSubmit()) {
            this.onSubmit(AzioneChiamataEnum.InAttesa);
        }
    }

    onChiudiModifica(): void {
        this.store.dispatch([
            new ClearRichiestaModifica(),
            new ToggleModifica()
        ]);
    }

    onResetChiamata(): void {
        let modalConfermaReset;
        if (this.doubleMonitor) {
            modalConfermaReset = this.modalService.open(ConfirmModalComponent, {
                windowClass: 'modal-holder modal-left',
                backdropClass: 'light-blue-backdrop',
                centered: true
            });
        } else {
            modalConfermaReset = this.modalService.open(ConfirmModalComponent, {
                windowClass: 'modal-holder',
                backdropClass: 'light-blue-backdrop',
                centered: true
            });
        }
        modalConfermaReset.componentInstance.icona = { descrizione: 'exclamation-triangle', colore: 'danger' };
        modalConfermaReset.componentInstance.titolo = 'Reset Chiamata';
        modalConfermaReset.componentInstance.messaggio = 'Sei sicuro di voler effettuare il reset della chiamata?';
        modalConfermaReset.componentInstance.messaggioAttenzione = 'Tutti i dati inseriti verranno eliminati.';
        modalConfermaReset.componentInstance.bottoni = [
            { type: 'ko', descrizione: 'Annulla', colore: 'secondary' },
            { type: 'ok', descrizione: 'Conferma', colore: 'danger' },
        ];

        modalConfermaReset.result.then(
            (val) => {
                switch (val) {
                    case 'ok':
                        this.submitted = false;
                        this.richiestaForm.reset();
                        this.store.dispatch([
                            new ClearClipboard(),
                            new DelChiamataMarker(this.idChiamata)
                        ]);
                        this.clearTipologieSelezionate();
                        this.reducerSchedaTelefonata('reset');
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

    onAnnullaChiamata(): void {
        this.reducerSchedaTelefonata('annullata');
    }

    impostaAzioneChiamata(azioneChiamata: AzioneChiamataEnum): void {
        this.onSubmit(azioneChiamata);
    }

    formIsInvalid(): boolean {
        return !!this.richiestaForm.invalid;
    }

    checkSubmit(): boolean {
        const coordinate = new Coordinate(this.f.latitudine.value, this.f.longitudine.value);
        return (!this.formIsInvalid() && !!coordinate);
    }

    onSubmit(azione?: AzioneChiamataEnum, options?: { urgente?: boolean }): void {
        this.submitted = true;
        if (this.checkSubmit()) {
            if (!this.modifica) {
                const urgente = options?.urgente;
                this.reducerSchedaTelefonata('inserita', azione, { urgente });
            } else if (this.modifica) {
                this.reducerSchedaTelefonata('modificata', azione);
            }
        }
    }

    reducerSchedaTelefonata(tipo: string, azione?: AzioneChiamataEnum, options?: { urgente?: boolean }): void {
        const schedaTelefonata: SchedaTelefonataInterface = {
            tipo,
            markerChiamata: this.chiamataMarker
        };
        if (azione) {
            schedaTelefonata.azioneChiamata = azione;
        }
        const urgente = options?.urgente;
        this.store.dispatch(new ReducerSchedaTelefonata(schedaTelefonata, { urgente }));
    }
}

function setPrioritaByTriageSummary(formControls: any, triageSummary: TriageSummary[]): void {
    const prioritaConsigliata = getPrioritaTriage(triageSummary);
    if (prioritaConsigliata) {
        switch (prioritaConsigliata) {
            case 'Molto Bassa':
                formControls.prioritaRichiesta.patchValue(1);
                break;
            case 'Bassa':
                formControls.prioritaRichiesta.patchValue(2);
                break;
            case 'Media':
                formControls.prioritaRichiesta.patchValue(3);
                break;
            case 'Alta':
                formControls.prioritaRichiesta.patchValue(4);
                break;
        }
    } else {
        formControls.prioritaRichiesta.patchValue(3);
    }
}

function resetPrioritaRichiesta(formControls: any): void {
    formControls.prioritaRichiesta.patchValue(3);
}

function saveTriageSummary(store: Store, triageSummary: TriageSummary[]): void {
    store.dispatch([
        new SetTriageSummary(triageSummary)
    ]);
}

function clearTriageSummary(store: Store): void {
    store.dispatch([
        new ClearTriageSummary()
    ]);
}

function clearTriageChiamataModalData(store: Store): void {
    store.dispatch([
        new ClearDettagliTipologie(),
        new ClearTipologiaTriageChiamata(),
        new ClearDettaglioTipologiaTriageChiamata(),
        new ClearTriageChiamata()
    ]);
}

function clearSummaryData(store: Store): void {
    store.dispatch(new ClearTriageSummary());
}
