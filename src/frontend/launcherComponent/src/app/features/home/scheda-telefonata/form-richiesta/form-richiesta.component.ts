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
import { ClearClipboard } from '../../store/actions/scheda-telefonata/clipboard.actions';
import { ReducerSchedaTelefonata, StartChiamata } from '../../store/actions/scheda-telefonata/chiamata.actions';
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
import { ToggleChiamata } from '../../store/actions/view/view.actions';
import { ClearRichiestaModifica } from '../../store/actions/scheda-telefonata/richiesta-modifica.actions';
import { DettaglioTipologia } from '../../../../shared/interface/dettaglio-tipologia.interface';

@Component({
    selector: 'app-form-richiesta',
    templateUrl: './form-richiesta.component.html',
    styleUrls: ['./form-richiesta.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class FormRichiestaComponent implements OnInit, OnDestroy, OnChanges {

    @Input() tipologie: Tipologia[];
    @Input() dettagliTipologie: DettaglioTipologia[];
    @Input() operatore: Utente;
    @Input() competenze: Sede[];
    @Input() countInterventiProssimita: number;
    @Input() interventiProssimita: SintesiRichiesta[];
    @Input() enti: Ente[];
    @Input() codiceSchedaContatto: string;
    @Input() disabledInviaPartenza = false;
    @Input() loading: boolean;
    @Input() doubleMonitor: boolean;
    @Input() resetChiamata: boolean;
    @Input() schedaContatto: SchedaContatto;

    // Modifica
    @Input() modifica: boolean;
    @Input() richiestaModifica: SintesiRichiesta;

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
    listaEnti: Ente[];
    scorciatoieTelefono = {
        112: false,
        113: false,
        118: false,
        'VV.UU.': false,
    };

    // TODO: Rimuovere (fake triage)
    visualizzaSuggerimentiTriage: boolean;

    private subscription = new Subscription();

    constructor(private formBuilder: FormBuilder,
                private store: Store,
                private modalService: NgbModal) {
        this.store.dispatch(new StartChiamata());
        this.ngxGooglePlacesOptions = new Options({
            bounds: this.store.selectSnapshot(HomeState.bounds) as unknown as LatLngBounds,
            componentRestrictions: GOOGLEPLACESOPTIONS.componentRestrictions as unknown as ComponentRestrictions
        });
        this.chiamataForm = this.createAndGetForm();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes) {
            if (changes.operatore && changes.operatore.currentValue) {
                const operatore = changes.operatore.currentValue;
                this.idChiamata = makeIdChiamata(operatore);
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
            if (changes.richiestaModifica && changes.richiestaModifica.currentValue) {
                const richiestaModifica = changes.richiestaModifica.currentValue;
                if (richiestaModifica) {
                    this.modifica = true;
                }
            }

            function makeIdChiamata(operatore: Utente): string {
                return `${operatore.sede.codice}-${operatore.id}-${makeID(8)}`;
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
        this.reducerSchedaTelefonata('reset');
        this.store.dispatch(new DelChiamataMarker(this.idChiamata));
    }

    createAndGetForm(): FormGroup {
        return this.formBuilder.group({
            tipologie: [null, Validators.required],
            dettaglioTipologia: [null],
            istanteRicezioneRichiesta: [new Date(new Date().getTime() + OFFSET_SYNC_TIME[0])],
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
            listaEnti: [null],
            stato: [StatoRichiesta.Chiamata],
            emergenza: [false]
        });
    }

    get f(): any {
        return this.chiamataForm.controls;
    }

    getNuovaRichiesta(): SintesiRichiesta {
        const f = this.f;
        const tipologia = this.tipologie.filter((t: Tipologia) => t.codice === f.tipologie.value)[0];
        return new SintesiRichiesta(
            null,
            null,
            null,
            this.operatore,
            f.istanteRicezioneRichiesta.value,
            f.stato.value,
            f.prioritaRichiesta.value,
            [tipologia],
            null, // f.dettaglioTipologia.value,
            f.dettaglioTipologia.value ? f.dettaglioTipologia.value.descrizione : (f.tipologie.length > 0 ? f.tipologie[0].descrizione : null),
            new Richiedente(f.telefono.value, f.nominativo.value),
            {
                indirizzo: f.indirizzo.value,
                piano: f.piano.value,
                palazzo: f.palazzo.value,
                scala: f.scala.value,
                interno: f.interno.value,
                contatto: f.contatto.value,
                note: f.noteIndirizzo.value,
                coordinate: {
                    longitudine: f.longitudine.value,
                    latitudine: f.latitudine.value
                },
            },
            null,
            null,
            null,
            null,
            f.rilevanzaGrave.value,
            this.idSchedaContatto ? this.idSchedaContatto : null,
            f.zoneEmergenza.value ? f.zoneEmergenza.value.split(' ') : null,
            null,
            null,
            (f.etichette.value && f.etichette.value.length) ? f.etichette.value : null,
            f.notePubbliche.value,
            f.notePrivate.value,
            null,
            null,
            null,
            null,
            (f.listaEnti.value && f.listaEnti.value.length) ? f.listaEnti.value : null,
            null,
            null,
            f.rilevanzaStArCu.value,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            f.emergenza.value
        );
    }

    onChangeTipologia(codTipologia: string): void {
        if (codTipologia) {
            this.openTriage();
        }
    }

    clearTipologieSelezionate(): void {
        this.f.tipologie.patchValue(null);
    }

    checkTipologie(): boolean {
        return !!!(this.f.tipologie.value && (this.f.tipologie.value.length > 0));
    }

    onAddEnti(ente: any): void {
        if (!this.nuovaRichiesta.listaEnti) {
            this.listaEnti = [];
            this.onAddEnti(ente);
        } else {
            this.listaEnti.push(ente);
        }
    }

    onRemoveEnti(ente: any): void {
        this.listaEnti.splice(this.listaEnti.indexOf(ente.codice), 1);
    }

    onAggiungiNuovoEnte(): void {
        this.aggiungiNuovoEnte.emit();
    }

    clearEntiSelezionati(): void {
        this.f.listaEnti.patchValue([]);
        this.listaEnti = [];
    }

    checkEnti(): boolean {
        return !!!(this.nuovaRichiesta.listaEnti && (this.nuovaRichiesta.listaEnti.length > 0));
    }

    onCopiaIndirizzo(): void {
        this.reducerSchedaTelefonata('copiaIndirizzo');
    }

    onCercaIndirizzo(result: Address): void {
        const lat = roundToDecimal(result.geometry.location.lat(), 6);
        const lng = roundToDecimal(result.geometry.location.lng(), 6);
        this.coordinate = new Coordinate(lat, lng);
        this.chiamataMarker = new ChiamataMarker(this.idChiamata, `${this.operatore.nome} ${this.operatore.cognome}`, `${this.operatore.sede.codice}`,
            new Localita(this.coordinate ? this.coordinate : null, result.formatted_address), null
        );
        this.f.indirizzo.patchValue(result.formatted_address);
        this.f.latitudine.patchValue(lat);
        this.f.longitudine.patchValue(lng);
        this.reducerSchedaTelefonata('cerca');
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

    openTriage(): void {
        const codTipologia = this.f.tipologie.value;
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
        this.getNuovaRichiesta();
        const triageModal = this.modalService.open(TriageModalComponent, modalOptions);
        triageModal.componentInstance.tipologiaSelezionata = this.tipologie.filter((t: Tipologia) => t.codice === codTipologia)[0];
        triageModal.componentInstance.dettagliTipologie = this.dettagliTipologie.filter((d: DettaglioTipologia) => d.codiceTipologia === +codTipologia);
        triageModal.componentInstance.nuovaRichiesta = this.getNuovaRichiesta();
        triageModal.componentInstance.chiamataMarker = this.chiamataMarker;
        triageModal.componentInstance.disableEmergenza = this.formIsInvalid(true);
        triageModal.result.then((res: any) => {
            switch (res.type) {
                case 'salvaDettaglio':
                    this.f.dettaglioTipologia.patchValue(res.result);
                    this.visualizzaSuggerimentiTriage = true;
                    break;
            }
        });
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
        // TODO: rimuovere
        // this.nuovaRichiesta.localita = new Localita(this.coordinate ? this.coordinate : null, scheda.localita.indirizzo, null);
        this.f.latitudine.patchValue(lat);
        this.f.longitudine.patchValue(lng);
        this.reducerSchedaTelefonata('cerca');
    }

    countErrorForm(): string[] {
        let error = '';
        error += this.f.tipologie.errors ? 'Tipologia;' : '';
        error += this.f.nominativo.errors ? 'Nominativo;' : '';
        error += this.f.telefono.errors ? 'Telefono;' : '';
        error += this.f.indirizzo.errors ? 'Indirizzo;' : '';
        return error.split(/\s*(?:;|$)\s*/);
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
        if (this.scorciatoieTelefono[key]) {
            this.scorciatoieTelefono[key] = false;
            f.telefono.patchValue('');
        } else {
            Object.keys(this.scorciatoieTelefono).forEach(x => this.scorciatoieTelefono[x] = x === key);
            f.telefono.patchValue(key);
        }
    }

    setEmergenza(): void {
        if (this.checkSubmit() && !this.f.emergenza.value) {
            this.f.emergenza.value = !this.f.emergenza.value;
            this.onSubmit(AzioneChiamataEnum.MettiInCoda);
        }
    }

    onChiudiModifica(): void {
        this.store.dispatch([
            new ClearRichiestaModifica(),
            new ToggleChiamata()
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
                        this.coordinate = null;
                        this.chiamataForm.reset();
                        this.store.dispatch([
                            new ClearClipboard(),
                            new DelChiamataMarker(this.idChiamata)
                        ]);
                        this.clearTipologieSelezionate();
                        this.clearEntiSelezionati();
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
                            this.reducerSchedaTelefonata('annullata');
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
            this.reducerSchedaTelefonata('annullata');
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

    impostaAzioneChiamata(azioneChiamata: AzioneChiamataEnum): void {
        // if (azioneChiamata === AzioneChiamataEnum.InviaPartenza || azioneChiamata === AzioneChiamataEnum.MettiInCoda) {
        //     this.nuovaRichiesta.azione = azioneChiamata;
        // } else {
        //     this.nuovaRichiesta.azione = azioneChiamata;
        //     this.nuovaRichiesta.stato = StatoRichiesta.Chiusa;
        // }
        this.onSubmit(azioneChiamata);
    }

    formIsInvalid(onlyBool?: boolean): boolean {
        if (!onlyBool) {
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
        }
        return !!this.chiamataForm.invalid;
    }

    checkSubmit(): boolean {
        return (!this.formIsInvalid() && !!this.coordinate);
    }

    onSubmit(azione?: AzioneChiamataEnum): void {
        this.submitted = true;
        if (this.checkSubmit()) {
            if (!this.modifica) {
                this.reducerSchedaTelefonata('inserita', azione);
            } else if (this.modifica) {
                this.reducerSchedaTelefonata('modificata', azione);
            }
        }
    }

    reducerSchedaTelefonata(tipo: string, azione?: AzioneChiamataEnum): void {
        const schedaTelefonata: SchedaTelefonataInterface = {
            tipo,
            nuovaRichiesta: this.getNuovaRichiesta(),
            markerChiamata: this.chiamataMarker
        };
        if (azione) {
            schedaTelefonata.azioneChiamata = azione;
            schedaTelefonata.nuovaRichiesta.azione = azione;
        }
        this.store.dispatch(new ReducerSchedaTelefonata(schedaTelefonata));
    }
}
