import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { Localita } from 'src/app/shared/model/localita.model';
import { Coordinate } from 'src/app/shared/model/coordinate.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { SchedaTelefonataInterface } from '../../../../shared/interface/scheda-telefonata.interface';
import { ChiamataMarker } from '../../maps/maps-model/chiamata-marker.model';
import { makeID, roundToDecimal } from '../../../../shared/helper/function';
import { AzioneChiamataEnum } from '../../../../shared/enum/azione-chiamata.enum';
import { Store } from '@ngxs/store';
import { ShowToastr } from '../../../../shared/store/actions/toastr/toastr.actions';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Utente } from '../../../../shared/model/utente.model';
import { ClearClipboard } from '../../store/actions/chiamata/clipboard.actions';
import { ReducerSchedaTelefonata, StartChiamata } from '../../store/actions/chiamata/scheda-telefonata.actions';
import { Richiedente } from '../../../../shared/model/richiedente.model';
import { StatoRichiesta } from '../../../../shared/enum/stato-richiesta.enum';
import { OFFSET_SYNC_TIME } from '../../../../core/settings/referral-time';
import { ToastrType } from '../../../../shared/enum/toastr';
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
import { TriageModalComponent } from '../../../../shared/modal/triage-modal/triage-modal.component';

@Component({
    selector: 'app-scheda-telefonata',
    templateUrl: './scheda-telefonata.component.html',
    styleUrls: ['./scheda-telefonata.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SchedaTelefonataComponent implements OnInit, OnDestroy, OnChanges {

    @Input() tipologie: Tipologia[];
    @Input() operatore: Utente;
    @Input() competenze: Sede[];
    @Input() countInterventiVicinanze: number;
    @Input() interventiVicinanze: SintesiRichiesta[];
    @Input() enti: Ente[];
    @Input() codiceSchedaContatto: string;
    @Input() disabledInviaPartenza = false;
    @Input() loading: boolean;
    @Input() doubleMonitor: boolean;
    @Input() resetChiamata: boolean;
    @Input() schedaContatto: SchedaContatto;

    @Output() aggiungiNuovoEnte: EventEmitter<boolean> = new EventEmitter<boolean>();

    ngxGooglePlacesOptions: Options;

    chiamataMarker: ChiamataMarker;
    chiamataForm: FormGroup;
    coordinate: Coordinate;
    submitted = false;

    idChiamata: string;

    AzioneChiamataEnum = AzioneChiamataEnum;

    nuovaRichiesta: SintesiRichiesta;
    idSchedaContatto: string;
    prefix: {} = {
        112: false,
        113: false,
        118: false,
        'VV.UU.': false,
    };

    private subscription = new Subscription();

    constructor(private formBuilder: FormBuilder,
                private store: Store,
                private modalService: NgbModal) {
        this.store.dispatch(new StartChiamata());
        this.ngxGooglePlacesOptions = new Options({
            bounds: this.store.selectSnapshot(HomeState.bounds) as unknown as LatLngBounds,
            componentRestrictions: GOOGLEPLACESOPTIONS.componentRestrictions as unknown as ComponentRestrictions
        });
        this.chiamataForm = this.createForm();
        this.initNuovaRichiesta();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes) {
            if (changes.operatore && changes.operatore.currentValue) {
                const operatore = changes.operatore.currentValue;
                this.nuovaRichiesta.operatore = new Utente(
                    operatore.id,
                    operatore.nome,
                    operatore.cognome,
                    operatore.codiceFiscale,
                    operatore.sede,
                    operatore.username
                );
                this.idChiamata = this.makeIdChiamata();
            }
            if (changes.codiceSchedaContatto && changes.codiceSchedaContatto.currentValue) {
                this.f.contatto.patchValue(changes.codiceSchedaContatto.currentValue);
            }
            if (changes.resetChiamata && changes.resetChiamata.currentValue) {
                const reset = changes.resetChiamata.currentValue;
                if (reset) {
                    this.chiamataForm.reset();
                }
            }
            if (changes.schedaContatto && changes.schedaContatto.currentValue) {
                const schedaContatto = changes.schedaContatto.currentValue;
                if (schedaContatto && schedaContatto.codiceScheda) {
                    if (!this.idSchedaContatto) {
                        this.setSchedaContatto(schedaContatto);
                        this.idSchedaContatto = schedaContatto.codiceScheda;
                    }
                }
            }
        }
    }

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
        this.clearFormDisconnection();
    }

    clearFormDisconnection(): void {
        this.submitted = false;
        this.chiamataForm.reset();
        this.clearTipologieSelezionate();
        this.coordinate = null;
        this.store.dispatch(new ClearClipboard());
        this._statoChiamata('reset');
        this.store.dispatch(new DelChiamataMarker(this.idChiamata));
    }

    createForm(): FormGroup {
        return this.formBuilder.group({
            tipologie: [null, Validators.required],
            dettaglioTipologia: [null],
            nominativo: [null, Validators.required],
            telefono: [null, [Validators.required, Validators.pattern('^(\\+?)[0-9]+$')]],
            indirizzo: [null, Validators.required],
            latitudine: [null, [Validators.required, Validators.pattern('^(\\-?)([0-9]+)(\\.)([0-9]+)$')]],
            longitudine: [null, [Validators.required, Validators.pattern('^(\\-?)([0-9]+)(\\.)([0-9]+)$')]],
            piano: [null],
            palazzo: [null],
            scala: [null],
            interno: [null],
            contatto: [null],
            etichette: [null],
            noteIndirizzo: [null],
            rilevanzaGrave: [false],
            rilevanzaStArCu: [false],
            notePrivate: [null],
            notePubbliche: [null],
            descrizione: [null],
            zoneEmergenza: [null],
            prioritaRichiesta: [3, Validators.required],
            listaEnti: [null]
        });
    }

    get f(): any {
        return this.chiamataForm.controls;
    }

    initNuovaRichiesta(): void {
        this.nuovaRichiesta = new SintesiRichiesta(
            null,
            null,
            null,
            null,
            null,
            StatoRichiesta.Chiamata,
            0,
            null,
            null,
            null,
            null,
            null,
            null,
            null
        );
        this.nuovaRichiesta.rilevanteStArCu = false;
        this.nuovaRichiesta.rilevanteGrave = false;
        this.nuovaRichiesta.istanteRicezioneRichiesta = new Date(new Date().getTime() + OFFSET_SYNC_TIME[0]);
    }

    getChiamataForm(): void {
        const f = this.f;
        const tipologia = this.tipologie.filter((t: Tipologia) => t.codice === f.tipologie.value)[0];
        this.nuovaRichiesta.tipologie = [tipologia];
        this.nuovaRichiesta.dettaglioTipologia = f.dettaglioTipologia.value;
        this.nuovaRichiesta.richiedente = new Richiedente(f.telefono.value, f.nominativo.value);
        this.nuovaRichiesta.localita.note = f.noteIndirizzo.value;
        this.nuovaRichiesta.localita.coordinate.longitudine = f.longitudine.value;
        this.nuovaRichiesta.localita.coordinate.latitudine = f.latitudine.value;
        this.nuovaRichiesta.tags = (f.etichette.value && f.etichette.value.length) ? f.etichette.value : null;
        this.nuovaRichiesta.descrizione = f.dettaglioTipologia.value ? f.dettaglioTipologia.value.descrizione : tipologia.descrizione;
        this.nuovaRichiesta.zoneEmergenza = f.zoneEmergenza.value ? f.zoneEmergenza.value.split(' ') : null;
        this.nuovaRichiesta.notePrivate = f.notePrivate.value;
        this.nuovaRichiesta.notePubbliche = f.notePubbliche.value;
        this.nuovaRichiesta.prioritaRichiesta = f.prioritaRichiesta.value;
        this.nuovaRichiesta.localita.piano = f.piano.value;
        this.nuovaRichiesta.localita.palazzo = f.palazzo.value;
        this.nuovaRichiesta.localita.scala = f.scala.value;
        this.nuovaRichiesta.localita.interno = f.interno.value;
        this.nuovaRichiesta.localita.contatto = f.contatto.value;
        this.nuovaRichiesta.codiceSchedaNue = this.idSchedaContatto ? this.idSchedaContatto : null;
        this.nuovaRichiesta.listaEnti = (f.listaEnti.value && f.listaEnti.value.length) ? f.listaEnti.value : null;
        console.log('Nuova Richiesta', this.nuovaRichiesta);
    }

    onChangeTipologia(codTipologia: string): void {
        if (codTipologia) {
            this.openTriage();
        }
    }

    openTriage(): void {
        const codTipologia = this.f.tipologie.value;
        let modalOptions: any;
        if (this.doubleMonitor) {
            modalOptions = {
                windowClass: 'modal-holder modal-left',
                backdropClass: 'light-blue-backdrop',
                centered: true,
                size: 'xl'
            };
        } else {
            modalOptions = {
                windowClass: 'modal-holder',
                backdropClass: 'light-blue-backdrop',
                centered: true,
                size: 'xl'
            };
        }
        const triageModal = this.modalService.open(TriageModalComponent, modalOptions);
        triageModal.componentInstance.tipologiaSelezionata = this.tipologie.filter((t: Tipologia) => t.codice === codTipologia)[0];
        triageModal.result.then((res: any) => {
            switch (res.type) {
                case 'salvaDettaglio':
                    this.f.dettaglioTipologia.patchValue(res.result);
                    break;
            }
        });
    }

    // todo: rimuovere (inutilizzato)
    onAddTipologia(tipologia: any): void {
        if (!this.nuovaRichiesta.tipologie) {
            this.nuovaRichiesta.tipologie = [];
            this.onAddTipologia(tipologia);
        } else {
            this.nuovaRichiesta.tipologie.push(tipologia);
        }
    }

    // todo: rimuovere (inutilizzato)
    onRemoveTipologia(tipologia: any): void {
        this.nuovaRichiesta.tipologie.splice(this.nuovaRichiesta.tipologie.indexOf(tipologia.codice), 1);
    }

    onAddEnti(ente: any): void {
        if (!this.nuovaRichiesta.listaEnti) {
            this.nuovaRichiesta.listaEnti = [];
            this.onAddEnti(ente);
        } else {
            this.nuovaRichiesta.listaEnti.push(ente);
        }
    }

    onRemoveEnti(ente: any): void {
        this.nuovaRichiesta.listaEnti.splice(this.nuovaRichiesta.listaEnti.indexOf(ente.codice), 1);
    }

    checkTipologie(): boolean {
        return !!!(this.f.tipologie.value && (this.f.tipologie.value.length > 0));
    }

    checkEnti(): boolean {
        return !!!(this.nuovaRichiesta.listaEnti && (this.nuovaRichiesta.listaEnti.length > 0));
    }

    clearTipologieSelezionate(): void {
        this.f.tipologie.patchValue(null);
        this.nuovaRichiesta.tipologie = null;
    }

    onAggiungiNuovoEnte(): void {
        this.aggiungiNuovoEnte.emit();
    }

    clearEntiSelezionati(): void {
        this.f.listaEnti.patchValue([]);
        this.nuovaRichiesta.listaEnti = [];
    }

    openModalSchedeContatto(): void {
        let modalOptions: any;
        if (this.doubleMonitor) {
            modalOptions = {
                windowClass: 'modal-holder modal-left',
                backdropClass: 'light-blue-backdrop',
                centered: true,
                size: 'xl'
            };
        } else {
            modalOptions = {
                windowClass: 'modal-holder',
                backdropClass: 'light-blue-backdrop',
                centered: true,
                size: 'xl'
            };
        }
        this.modalService.open(ListaSchedeContattoModalComponent, modalOptions);
    }

    onAnnullaChiamata(): void {
        if (!this.checkNessunCampoModificato()) {
            const modalConfermaAnnulla = this.modalService.open(ConfirmModalComponent, {
                windowClass: 'modal-holder',
                backdropClass: 'light-blue-backdrop',
                centered: true
            });
            modalConfermaAnnulla.componentInstance.icona = { descrizione: 'trash', colore: 'danger' };
            modalConfermaAnnulla.componentInstance.titolo = 'Annulla Chiamata';
            modalConfermaAnnulla.componentInstance.messaggio = 'Sei sicuro di voler annullare la chiamata?';
            modalConfermaAnnulla.componentInstance.messaggioAttenzione = 'Tutti i dati inseriti saranno eliminati.';
            modalConfermaAnnulla.componentInstance.bottoni = [
                { type: 'ko', descrizione: 'Annulla', colore: 'secondary' },
                { type: 'ok', descrizione: 'Conferma', colore: 'danger' },
            ];

            modalConfermaAnnulla.result.then(
                (val) => {
                    switch (val) {
                        case 'ok':
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
        } else {
            this._statoChiamata('annullata');
        }
    }

    checkNessunCampoModificato(): boolean {
        let campiModificati = false;
        if (!this.f.tipologie.value && !this.f.nominativo.value && !this.f.telefono.value
            && !this.f.indirizzo.value && !this.f.latitudine.value && !this.f.longitudine.value
            && !this.f.piano.value && !this.f.etichette.value && !this.f.noteIndirizzo.value && !this.f.listaEnti.value
            && !this.f.notePrivate.value && !this.f.notePubbliche.value && !this.f.descrizione.value && !this.f.zoneEmergenza.value
            && this.f.prioritaRichiesta.value === 3) {
            campiModificati = true;
        }
        return campiModificati;
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
                        this.chiamataForm.reset();
                        this.clearTipologieSelezionate();
                        this.clearEntiSelezionati();
                        this.coordinate = null;
                        this.store.dispatch(new ClearClipboard());
                        this._statoChiamata('reset');
                        this.store.dispatch(new DelChiamataMarker(this.idChiamata));
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
        const lat = roundToDecimal(result.geometry.location.lat(), 6);
        const lng = roundToDecimal(result.geometry.location.lng(), 6);
        this.coordinate = new Coordinate(lat, lng);
        this.chiamataMarker = new ChiamataMarker(this.idChiamata, `${this.operatore.nome} ${this.operatore.cognome}`, `${this.operatore.sede.codice}`,
            new Localita(this.coordinate ? this.coordinate : null, result.formatted_address), null
        );
        this.nuovaRichiesta.localita = new Localita(this.coordinate ? this.coordinate : null, result.formatted_address, null);
        this.f.latitudine.patchValue(lat);
        this.f.longitudine.patchValue(lng);
        this._statoChiamata('cerca');
    }

    onMsgIndirizzo(): string {
        let msg = '';
        if (this.f.indirizzo.errors && !this.coordinate) {
            msg = 'L\'indirizzo è richiesto';
        } else if (this.f.indirizzo.errors) {
            msg = 'L\'indirizzo è richiesto';
        } else if (!this.coordinate) {
            msg = 'È necessario selezionare un indirizzo dall\'elenco';
        } else {
            return null;
        }
        return msg;
    }

    formIsValid(): boolean {
        const messageArr: string[] = this.countErrorForm();
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

    countErrorForm(): string[] {
        let error = '';
        error += this.f.tipologie.errors ? 'Tipologia;' : '';
        error += this.f.nominativo.errors ? 'Nominativo;' : '';
        error += this.f.telefono.errors ? 'Telefono;' : '';
        error += this.f.indirizzo.errors ? 'Indirizzo;' : '';
        return error.split(/\s*(?:;|$)\s*/);
    }

    impostaAzioneChiamata($event: AzioneChiamataEnum): void {
        if ($event === AzioneChiamataEnum.InviaPartenza || $event === AzioneChiamataEnum.MettiInCoda) {
            this.nuovaRichiesta.azione = $event;
        } else {
            this.nuovaRichiesta.azione = $event;
            this.nuovaRichiesta.stato = StatoRichiesta.Chiusa;
        }
        this.onSubmit($event);
    }

    checkSubmit(): boolean {
        return (!this.formIsValid() && !!this.coordinate);
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

    onCheckScorciatoiaNumero(key: string): void {
        const f = this.f;
        if (this.prefix[key]) {
            this.prefix[key] = false;
            f.telefono.patchValue('');
        } else {
            Object.keys(this.prefix).forEach(x => this.prefix[x] = x === key);
            f.telefono.patchValue(key);
        }
    }

    setSchedaContatto(scheda: SchedaContatto): void {
        const f = this.f;

        f.nominativo.patchValue(scheda.richiedente.nominativo);
        f.telefono.patchValue(scheda.richiedente.telefono);
        f.indirizzo.patchValue(scheda.localita.indirizzo);

        const lat = scheda.localita.coordinate.latitudine;
        const lng = scheda.localita.coordinate.longitudine;
        this.coordinate = new Coordinate(lat, lng);
        this.chiamataMarker = new ChiamataMarker(this.idChiamata, `${this.operatore.nome} ${this.operatore.cognome}`, `${this.operatore.sede.codice}`,
            new Localita(this.coordinate ? this.coordinate : null, scheda.localita.indirizzo), null
        );
        this.nuovaRichiesta.localita = new Localita(this.coordinate ? this.coordinate : null, scheda.localita.indirizzo, null);
        this.f.latitudine.patchValue(lat);
        this.f.longitudine.patchValue(lng);
        this._statoChiamata('cerca');
    }

    onSubmit(azione?: AzioneChiamataEnum): void {
        this.submitted = true;
        if (this.checkSubmit()) {
            this.getChiamataForm();
            this._statoChiamata('inserita', azione);
        }
    }

    _statoChiamata(tipo: string, azione?: AzioneChiamataEnum): void {
        const schedaTelefonata: SchedaTelefonataInterface = {
            tipo,
            nuovaRichiesta: this.nuovaRichiesta,
            markerChiamata: this.chiamataMarker
        };
        if (azione) {
            schedaTelefonata.azioneChiamata = azione;
        }
        this.store.dispatch(new ReducerSchedaTelefonata(schedaTelefonata));
    }

    makeIdChiamata(): string {
        return `${this.operatore.sede.codice}-${this.operatore.id}-${makeID(8)}`;
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
        modalInterventiProssimita.componentInstance.interventiVicinanze = this.interventiVicinanze;
        modalInterventiProssimita.componentInstance.countInterventiVicinanze = this.countInterventiVicinanze;
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
}
