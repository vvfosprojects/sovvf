import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
    ViewEncapsulation
} from '@angular/core';
import { Localita } from 'src/app/shared/model/localita.model';
import { Coordinate } from 'src/app/shared/model/coordinate.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SchedaTelefonataInterface } from '../../interface/scheda-telefonata.interface';
import { ChiamataMarker } from '../../../features/maps/maps-model/chiamata-marker.model';
import { AzioneChiamataEnum } from '../../enum/azione-chiamata.enum';
import { Select, Store } from '@ngxs/store';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Utente } from '../../model/utente.model';
import { ClearClipboard } from '../../../features/home/store/actions/form-richiesta/clipboard.actions';
import {
    ClearCompetenze,
    ClearCountInterventiProssimita,
    ClearInterventiProssimita,
    ReducerSchedaTelefonata,
    SetCompetenze,
    SetCompetenzeSuccess,
    SetRedirectComposizionePartenza,
    StartChiamata,
    StopLoadingDettagliTipologia
} from '../../../features/home/store/actions/form-richiesta/scheda-telefonata.actions';
import { StatoRichiesta } from '../../enum/stato-richiesta.enum';
import { OFFSET_SYNC_TIME } from '../../../core/settings/referral-time';
import { Priorita, SintesiRichiesta } from '../../model/sintesi-richiesta.model';
import { Observable, Subscription } from 'rxjs';
import { DelChiamataMarker } from '../../../features/maps/store/actions/chiamate-markers.actions';
import { Tipologia } from '../../model/tipologia.model';
import { SchedaContatto } from 'src/app/shared/interface/scheda-contatto.interface';
import { EnteInterface } from 'src/app/shared/interface/ente.interface';
import { ConfirmModalComponent } from '../../modal/confirm-modal/confirm-modal.component';
import { ListaSchedeContattoModalComponent } from '../../modal/lista-schede-contatto-modal/lista-schede-contatto-modal.component';
import { Sede } from '../../model/sede.model';
import { TriageChiamataModalComponent } from '../../modal/triage-chiamata-modal/triage-chiamata-modal.component';
import { ToggleModifica } from '../../../features/home/store/actions/view/view.actions';
import { ChiudiRichiestaModifica, ClearRichiestaModifica, ModificaIndirizzo } from '../../../features/home/store/actions/form-richiesta/richiesta-modifica.actions';
import {
    ClearDettaglioTipologiaTriageChiamata,
    ClearDettagliTipologie,
    ClearTipologiaTriageChiamata,
    ClearTriageChiamata,
    GetDettagliTipologieByCodTipologia
} from '../../store/actions/triage-modal/triage-modal.actions';
import { DettaglioTipologia } from '../../interface/dettaglio-tipologia.interface';
import { TriageSummary } from '../../interface/triage-summary.interface';
import { ClearTriageSummary, SetSchedaContattoTriageSummary, SetTriageSummary } from '../../store/actions/triage-summary/triage-summary.actions';
import { getPrioritaTriage } from '../../helper/function-triage';
import { CheckboxInterface } from '../../interface/checkbox.interface';
import { UpdateFormValue } from '@ngxs/form-plugin';
import { makeCopy, roundToDecimal } from '../../helper/function-generiche';
import { ClearSchedaContattoTelefonata } from '../../../features/home/store/actions/schede-contatto/schede-contatto.actions';
import { PosInterface } from '../../interface/pos.interface';
import { makeIdChiamata } from '../../helper/function-richieste';
import { TipoTerreno } from '../../model/tipo-terreno';
import { TipoTerrenoEnum } from '../../enum/tipo-terreno.enum';
import { TriageChiamataModalState } from '../../store/states/triage-chiamata-modal/triage-chiamata-modal.state';
import { SchedaTelefonataState } from '../../../features/home/store/states/form-richiesta/scheda-telefonata.state';
import { TipologicheMezziState } from '../../../features/home/store/states/composizione-partenza/tipologiche-mezzi.state';
import { ListaTipologicheMezzi } from '../../../features/home/composizione-partenza/interface/filtri/lista-filtri-composizione-interface';
import { TipologicaComposizionePartenza } from '../../../features/home/composizione-partenza/interface/filtri/tipologica-composizione-partenza.interface';
import AddressCandidate from '@arcgis/core/tasks/support/AddressCandidate';

@Component({
    selector: 'app-form-richiesta',
    templateUrl: './form-richiesta.component.html',
    styleUrls: ['./form-richiesta.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class FormRichiestaComponent implements OnInit, OnChanges, OnDestroy {

    @Select(TriageChiamataModalState.dettagliTipologia) dettagliTipologia$: Observable<DettaglioTipologia[]>;
    dettagliTipologia: DettaglioTipologia[];

    @Select(SchedaTelefonataState.loadingDettagliTipologia) loadingDettagliTipologia$: Observable<boolean>;
    loadingDettagliTipologia: boolean;

    @Select(TipologicheMezziState.tipologiche) tipologiche$: Observable<ListaTipologicheMezzi>;
    distaccamenti: TipologicaComposizionePartenza[];
    distaccamentiFiltered: TipologicaComposizionePartenza[];

    @Input() tipologie: Tipologia[];
    @Input() operatore: Utente;
    @Input() competenze: Sede[];
    @Input() countInterventiProssimita: number;
    @Input() interventiProssimita: SintesiRichiesta[];
    @Input() countInterventiStessaVia: number;
    @Input() interventiStessaVia: SintesiRichiesta[];
    @Input() countInterventiChiusiStessoIndirizzo: number;
    @Input() interventiChiusiStessoIndirizzo: SintesiRichiesta[];
    @Input() enti: EnteInterface[];
    @Input() disabledInviaPartenza = false;
    @Input() resetChiamata: boolean;
    @Input() loadingSchedaRichiesta: boolean;
    @Input() loadingCompetenze: boolean;
    @Input() schedaContatto: SchedaContatto;
    @Input() schedaContattoDettaglio: string;

    // Modifica
    @Input() modifica: boolean;
    @Input() richiestaModifica: SintesiRichiesta;

    // Triage Summary
    @Input() triageSummary: TriageSummary[];

    // Aperto dalla Mappa
    @Input() apertoFromMappa: boolean;
    @Input() lat: number;
    @Input() lon: number;
    @Input() address: string;

    @Output() closeChiamataFromMappa: EventEmitter<boolean> = new EventEmitter<boolean>();

    chiamataMarker: ChiamataMarker;
    idChiamata: string;
    AzioneChiamataEnum = AzioneChiamataEnum;
    StatoRichiesta = StatoRichiesta;
    pos: PosInterface[];

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
        this.getLoadingDettagliTipologia();
        this.getDettagliTipologia();
        this.store.dispatch([
            new StartChiamata(),
            new ClearCountInterventiProssimita(),
            new ClearInterventiProssimita()
        ]);
        this.richiestaForm = this.createAndGetForm();
        this.getTipologiche();
    }

    ngOnInit(): void {
        if (this.apertoFromMappa) {
            this.setIndirizzoFromMappa(this.lat, this.lon, this.address);
        }
        if (this.richiestaModifica && this.richiestaModifica.codiceSchedaNue) {
            this.store.dispatch(new SetSchedaContattoTriageSummary(this.richiestaModifica.codiceSchedaNue));
        }
    }

    checkNominativoSchedaContatto(): void {
        if (this.f.codSchedaContatto.value && this.f.nominativo.value === '' && this.schedaContatto) {
            this.f.nominativo.patchValue(this.schedaContatto.richiedente?.nominativo);
        }
    }

    checkNumeroSchedaContatto(): void {
        if (this.f.codSchedaContatto.value && this.f.telefono.value === '' && this.schedaContatto) {
            this.f.telefono.patchValue(this.schedaContatto.richiedente?.telefono);
        }
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
                // Controllo scorciatoia numero da Scheda Contatto
                const telefono = schedaContatto.richiedente.telefono;
                const checkTelefono = JSON.stringify(Object.keys(this.scorciatoieTelefono));
                if (checkTelefono.includes(telefono)) {
                    this.onCheckScorciatoiaNumero(telefono);
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
            if (changes.schedaContattoDettaglio?.currentValue) {
                this.f.noteNue.patchValue(this.schedaContattoDettaglio);
            }
        }
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
        this.clearFormDisconnection();
    }

    clearFormDisconnection(): void {
        this.submitted = false;
        this.store.dispatch([
            new ClearClipboard(),
            new DelChiamataMarker(this.idChiamata),
            new ClearCompetenze(),
            new ClearCountInterventiProssimita(),
            new ClearInterventiProssimita(),
            new ClearSchedaContattoTelefonata()
        ]);
        clearSummaryData(this.store);
        clearTriageSummary(this.store);
        clearTriageChiamataModalData(this.store);
        this.pos = null;

        if (this.richiestaModifica) {
            this.store.dispatch([
                new ChiudiRichiestaModifica()
            ]);
        } else {
            this.store.dispatch(new ClearSchedaContattoTelefonata());
        }

        this.reducerSchedaTelefonata('reset');
    }

    createAndGetForm(): FormGroup {
        return this.formBuilder.group({
            id: [null],
            codice: [null],
            codiceRichiesta: [null],
            operatore: [null],
            codTipologia: [null, [Validators.required]],
            dettaglioTipologia: [null],
            istanteRicezioneRichiesta: [new Date(new Date().getTime() + OFFSET_SYNC_TIME[0])],
            nominativo: [null, [Validators.required]],
            telefono: [null, [Validators.required]], // Inserire se necessario => Validators.pattern('^(\\+?)[0-9]+$')
            indirizzo: [null, [Validators.required]],
            latitudine: [null, [Validators.required, Validators.pattern('^(\\-?)([0-9]+)(\\.)([0-9]+)$')]],
            longitudine: [null, [Validators.required, Validators.pattern('^(\\-?)([0-9]+)(\\.)([0-9]+)$')]],
            competenze: [null],
            codPrimaCompetenza: [{ value: null, disabled: true }],
            codSecondaCompetenza: [{ value: null, disabled: true }],
            codTerzaCompetenza: [{ value: null, disabled: true }],
            codSchedaContatto: [{ value: null, disabled: true }],
            piano: [null],
            palazzo: [null],
            scala: [null],
            interno: [null],
            codEntiIntervenuti: [null],
            etichette: [null],
            noteIndirizzo: [null],
            rilevanzaGrave: [false],
            rilevanzaStArCu: [false],
            notePrivate: [null],
            notePubbliche: [null],
            boschi: [null],
            campi: [null],
            sterpaglie: [null],
            descrizione: [null],
            zoneEmergenza: [null],
            prioritaRichiesta: [3, [Validators.required]],
            stato: [StatoRichiesta.Chiamata],
            urgenza: [false],
            esercitazione: [false],
            noteNue: [null]
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
            competenze: this.richiestaModifica.competenze,
            codSchedaContatto: this.richiestaModifica.codiceSchedaNue,
            piano: this.richiestaModifica.localita.piano,
            palazzo: this.richiestaModifica.localita.palazzo,
            scala: this.richiestaModifica.localita.scala,
            interno: this.richiestaModifica.localita.interno,
            codEntiIntervenuti: this.richiestaModifica.codEntiIntervenuti,
            etichette: this.richiestaModifica.tags,
            noteIndirizzo: this.richiestaModifica.localita.note,
            rilevanzaGrave: this.richiestaModifica.rilevanteGrave,
            rilevanzaStArCu: this.richiestaModifica.rilevanteStArCu,
            notePrivate: this.richiestaModifica.notePrivate,
            notePubbliche: this.richiestaModifica.notePubbliche,
            boschi: getHaBoschi(this.richiestaModifica),
            campi: getHaCampi(this.richiestaModifica),
            sterpaglie: getHaSterpaglie(this.richiestaModifica),
            descrizione: this.richiestaModifica.descrizione,
            zoneEmergenza: this.richiestaModifica.zoneEmergenza,
            prioritaRichiesta: this.richiestaModifica.prioritaRichiesta,
            stato: this.richiestaModifica.stato,
            urgenza: this.richiestaModifica.chiamataUrgente,
            esercitazione: this.richiestaModifica.esercitazione,
            noteNue: this.richiestaModifica.noteNue
        });

        this.store.dispatch(new GetDettagliTipologieByCodTipologia(+this.richiestaModifica.tipologie[0].codice));
        this.store.dispatch(new StopLoadingDettagliTipologia());

        const lat = roundToDecimal(this.f.latitudine.value, 6);
        const lng = roundToDecimal(this.f.longitudine.value, 6);
        if (lat && lng) {
            this.onChangeCoordinate();
            this.f.indirizzo.setValidators([]);
        }

        this.patchScorciatoiaNumero(this.richiestaModifica.richiedente.telefono);
        this.pos = this.richiestaModifica?.dettaglioTipologia?.pos;

        function getHaBoschi(richiestaModifica: SintesiRichiesta): number {
            return richiestaModifica?.tipoTerreno?.filter((tT: TipoTerreno) => tT.descrizione === TipoTerrenoEnum.Boschi)[0]?.ha;
        }

        function getHaCampi(richiestaModifica: SintesiRichiesta): number {
            return richiestaModifica?.tipoTerreno?.filter((tT: TipoTerreno) => tT.descrizione === TipoTerrenoEnum.Campi)[0]?.ha;
        }

        function getHaSterpaglie(richiestaModifica: SintesiRichiesta): number {
            return richiestaModifica?.tipoTerreno?.filter((tT: TipoTerreno) => tT.descrizione === TipoTerrenoEnum.Sterpaglie)[0]?.ha;
        }
    }

    get f(): any {
        return this.richiestaForm.controls;
    }

    onChangeTipologia(codTipologia: string): void {
        // Ripulisco eventuali info triage e dettaglio tipologia presenti
        this.f.dettaglioTipologia.patchValue(null);
        clearTriageSummary(this.store);
        clearTriageChiamataModalData(this.store);
        this.pos = null;
        if (codTipologia && !this.richiestaModifica) {
            // Prendo i dettagli tipologia
            this.store.dispatch(new GetDettagliTipologieByCodTipologia(+codTipologia));
        }
    }

    onChangeDettaglioTipologia(dettaglioTipologia: DettaglioTipologia): void {
        // Ripulisco eventuali info triage e dettaglio tipologia presenti
        this.f.dettaglioTipologia.patchValue(null);
        clearTriageSummary(this.store);
        clearTriageChiamataModalData(this.store);
        this.pos = null;
        if (dettaglioTipologia && !this.richiestaModifica) {
            // Trovo il dettaglio tipologia nella lista dei dettagli e aggiorno il valore
            const dettaglio = this.dettagliTipologia.filter(x => x.codiceDettaglioTipologia === dettaglioTipologia.codiceDettaglioTipologia)[0];
            this.f.dettaglioTipologia.patchValue(dettaglio);
            this.pos = dettaglio?.pos;
        } else if (dettaglioTipologia) {
            const dettaglio = this.dettagliTipologia.filter(x => x.codiceDettaglioTipologia === dettaglioTipologia.codiceDettaglioTipologia)[0];
            this.pos = dettaglio?.pos;
        }
    }

    clearTipologieSelezionate(): void {
        this.f.codTipologia.patchValue(null);
    }

    checkTipologie(): boolean {
        return !!(this.f.codTipologia.value);
    }

    getLoadingDettagliTipologia(): void {
        this.subscription.add(
            this.loadingDettagliTipologia$.subscribe((loading: boolean) => {
                if (loading) {
                    this.loadingDettagliTipologia = loading;
                }
            })
        );
    }

    getDettagliTipologia(): void {
        this.subscription.add(
            this.dettagliTipologia$.subscribe((dettagliTipologia: DettaglioTipologia[]) => {
                if (dettagliTipologia) {
                    this.dettagliTipologia = dettagliTipologia;
                    this.loadingDettagliTipologia = false;
                }
            })
        );
    }

    getTipologiche(): void {
        this.subscription.add(
            this.tipologiche$.subscribe((tipologiche: ListaTipologicheMezzi) => {
                if (tipologiche?.distaccamenti?.length) {
                    this.distaccamenti = tipologiche.distaccamenti;
                    this.distaccamentiFiltered = makeCopy(this.distaccamenti);
                    if (this.f?.codPrimaCompetenza?.disabled) {
                        this.f.codPrimaCompetenza.enable();
                    }
                }
            })
        );
    }


    getTipologia(codTipologia: string): Tipologia {
        return this.tipologie?.filter((t: Tipologia) => t.codice === codTipologia)[0];
    }

    onCopiaCoordinate(): void {
        this.reducerSchedaTelefonata('copiaCoordinate');
    }

    reducerIndirizzo(candidate: AddressCandidate): void {
        if (!this.richiestaModifica) {
            this.onSetIndirizzo(candidate);
        } else {
            this.onModificaIndirizzo(candidate);
        }
    }

    onSetIndirizzo(candidate: AddressCandidate): void {
        const indirizzo = candidate.address ? candidate.address : null;
        const lat = roundToDecimal(candidate.location.latitude, 6);
        const lng = roundToDecimal(candidate.location.longitude, 6);
        const coordinate = new Coordinate(lat, lng);
        this.chiamataMarker = new ChiamataMarker(
            this.idChiamata,
            `${this.operatore.nome} ${this.operatore.cognome}`,
            `${this.operatore.sede.codice}`,
            new Localita(coordinate ? coordinate : null, indirizzo),
            null
        );

        this.f.indirizzo.patchValue(indirizzo);
        this.f.latitudine.patchValue(lat);
        this.f.longitudine.patchValue(lng);
        this.f.indirizzo.markAsDirty();
        this.f.latitudine.markAsDirty();
        this.f.longitudine.markAsDirty();

        this.reducerSchedaTelefonata('cerca');
    }

    setIndirizzoFromMappa(lat: number, lon: number, address: string): void {
        const latitudine = roundToDecimal(lat, 6);
        const longitudine = roundToDecimal(lon, 6);
        this.f.latitudine.patchValue(latitudine);
        this.f.longitudine.patchValue(longitudine);
        this.f.indirizzo.patchValue(address);
        this.f.latitudine.disable();
        this.f.longitudine.disable();
        this.f.indirizzo.disable();

        const coordinate = new Coordinate(lat, lon);
        this.chiamataMarker = new ChiamataMarker(
            this.idChiamata,
            `${this.operatore.nome} ${this.operatore.cognome}`,
            `${this.operatore.sede.codice}`,
            new Localita(coordinate ? coordinate : null, address),
            null
        );

        this.reducerSchedaTelefonata('cerca');
    }

    onModificaIndirizzo(candidate: AddressCandidate): void {
        const indirizzo = candidate.address ? candidate.address : null;
        const lat = roundToDecimal(candidate.location.latitude, 6);
        const lng = roundToDecimal(candidate.location.longitude, 6);
        const coordinate = new Coordinate(lat, lng);
        const nuovoIndirizzo = new Localita(coordinate ? coordinate : null, indirizzo);

        this.f.latitudine.patchValue(coordinate.latitudine);
        this.f.longitudine.patchValue(coordinate.longitudine);
        this.f.indirizzo.patchValue(indirizzo);

        this.store.dispatch([
            new ModificaIndirizzo(nuovoIndirizzo),
            new SetCompetenze(coordinate, indirizzo, null)
        ]);
    }

    modificaIndirizzo(indirizzo: string): void {
        this.f.indirizzo.patchValue(indirizzo);
        const lat = roundToDecimal(this.f.latitudine.value, 6);
        const lng = roundToDecimal(this.f.longitudine.value, 6);
        if (!indirizzo && (lat && lng)) {
            this.f.indirizzo.setValidators([]);

            // TODO: risolvere glitch
            this.f.indirizzo.patchValue(' ');
            setTimeout(() => {
                this.f.indirizzo.patchValue('');
            }, 1);
        } else if (!lat || !lng) {
            this.f.indirizzo.setValidators([Validators.required]);
        }
        this.f.codPrimaCompetenza.patchValue(null);
        this.f.codSecondaCompetenza.patchValue(null);
        this.f.codTerzaCompetenza.patchValue(null);
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

    onChangeCoordinate(): void {
        const indirizzoInserito = !!(this.f.indirizzo.value);
        const indirizzo = indirizzoInserito ? this.f.indirizzo.value : null;
        const lat = roundToDecimal(this.f.latitudine.value, 6);
        const lng = roundToDecimal(this.f.longitudine.value, 6);

        if (lat && lng) {
            const coordinate = new Coordinate(lat, lng);
            if (!this.richiestaModifica) {
                this.chiamataMarker = new ChiamataMarker(
                    this.idChiamata,
                    `${this.operatore.nome} ${this.operatore.cognome}`,
                    `${this.operatore.sede.codice}`,
                    new Localita(coordinate ? coordinate : null, indirizzo),
                    null
                );
                this.store.dispatch(new SetCompetenze(coordinate, indirizzo, this.chiamataMarker));
            }

            if (!indirizzoInserito) {
                this.f.indirizzo.setValidators([]);

                // TODO: risolvere glitch
                this.f.indirizzo.patchValue(' ');
                setTimeout(() => {
                    this.f.indirizzo.patchValue('');
                }, 1);
            }
        } else {
            this.store.dispatch([
                new ClearCompetenze(),
                new ClearCountInterventiProssimita(),
                new ClearInterventiProssimita()
            ]);
            this.f.indirizzo.setValidators([Validators.required]);
            this.f.codPrimaCompetenza.patchValue(null);
            this.f.codSecondaCompetenza.patchValue(null);
            this.f.codTerzaCompetenza.patchValue(null);
        }
    }

    // TODO: controllare utilizzo effettivo
    /* onShowInterventiProssimita(): void {
        let modalInterventiProssimita;
        modalInterventiProssimita = this.modalService.open(InterventiProssimitaModalComponent, {
            windowClass: 'modal-holder',
            backdropClass: 'light-blue-backdrop',
            centered: true,
            size: 'xl',
        });
        modalInterventiProssimita.componentInstance.listaEnti = this.enti;
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
    } */

    onSelectCompetenza(nCompetenza: number, codCompetenza: string): void {
        switch (nCompetenza) {
            case 1:
                if (codCompetenza) {
                    if (this.f.codSecondaCompetenza.disabled) {
                        this.f.codSecondaCompetenza.enable();
                    }
                } else {
                    if (this.f.codSecondaCompetenza.enabled) {
                        this.f.codSecondaCompetenza.patchValue(null);
                        this.f.codSecondaCompetenza.disable();
                    }
                    if (this.f.codTerzaCompetenza.enabled) {
                        this.f.codTerzaCompetenza.patchValue(null);
                        this.f.codTerzaCompetenza.disable();
                    }
                }
                break;
            case 2:
                if (codCompetenza) {
                    if (this.f.codTerzaCompetenza.disabled) {
                        this.f.codTerzaCompetenza.enable();
                    }
                } else {
                    if (this.f.codTerzaCompetenza.enabled) {
                        this.f.codTerzaCompetenza.patchValue(null);
                        this.f.codTerzaCompetenza.disable();
                    }
                }
                break;
        }
        this.distaccamentiFiltered = this.distaccamenti.filter((d: TipologicaComposizionePartenza) => d.id !== this.f.codPrimaCompetenza.value && d.id !== this.f.codSecondaCompetenza.value && d.id !== this.f.codTerzaCompetenza.value);

        if (codCompetenza) {
            const codCompetenze = [];
            if (this.f.codPrimaCompetenza?.value) {
                codCompetenze.push(this.f.codPrimaCompetenza?.value);
            }
            if (this.f.codSecondaCompetenza?.value) {
                codCompetenze.push(this.f.codSecondaCompetenza?.value);
            }
            if (this.f.codTerzaCompetenza?.value) {
                codCompetenze.push(this.f.codTerzaCompetenza?.value);
            }
            const coordinate = {
                latitudine: this.f.latitudine?.value,
                longitudine: this.f.longitudine?.value
            };
            this.store.dispatch(new SetCompetenzeSuccess(coordinate, this.f.indirizzo.value, codCompetenze, this.chiamataMarker));
        }
    }

    openModalSchedeContatto(): void {
        let modalOptions: any;
        modalOptions = {
            windowClass: 'xxlModal modal-holder',
            backdropClass: 'light-blue-backdrop',
            centered: true
        };
        this.modalService.open(ListaSchedeContattoModalComponent, modalOptions);
    }

    openTriage(): void {
        const codTipologia = this.f.codTipologia.value;
        let modalOptions: any;
        modalOptions = {
            windowClass: 'modal-holder',
            backdropClass: 'light-blue-backdrop',
            centered: true,
            size: 'lg'
        };
        const triageModal = this.modalService.open(TriageChiamataModalComponent, modalOptions);
        triageModal.componentInstance.tipologiaSelezionata = this.tipologie.filter((t: Tipologia) => t.codice === codTipologia)[0];
        triageModal.componentInstance.dettaglioTipologiaSelezionato = this.f.dettaglioTipologia.value;
        triageModal.componentInstance.chiamataMarker = this.chiamataMarker;
        triageModal.componentInstance.checkedUrgenza = !!(this.f.urgenza.value);
        triageModal.componentInstance.disableUrgenza = this.formIsInvalid() || !!(this.f.urgenza.value);
        triageModal.componentInstance.apertoFromMappa = !!(this.apertoFromMappa);
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
                    resetPrioritaRichiesta(this.f);
                    clearTriageSummary(this.store);
                    clearTriageChiamataModalData(this.store);
                    this.f.dettaglioTipologia.patchValue(null);
                    break;
            }
        });

        interface TriageModalResult {
            type: string;
            dettaglio: DettaglioTipologia;
            triageSummary: TriageSummary[];
            pos: PosInterface[];
        }
    }

    setSchedaContatto(scheda: SchedaContatto): void {
        const f = this.f;
        f.noteNue.patchValue(scheda.dettaglio);
        f.codSchedaContatto.patchValue(scheda.codiceScheda);
        f.indirizzo.patchValue(scheda.localita?.indirizzo);

        const lat = +scheda.localita.coordinateString[0];
        const lng = +scheda.localita.coordinateString[1];
        f.latitudine.patchValue(lat);
        f.longitudine.patchValue(lng);

        if (!this.richiestaModifica?.richiedente) {
            f.nominativo.patchValue(scheda.richiedente?.nominativo);
            f.telefono.patchValue(scheda.richiedente?.telefono);
        }

        if (!this.richiestaModifica) {
            const coordinate = new Coordinate(lat, lng);
            this.chiamataMarker = new ChiamataMarker(this.idChiamata, `${this.operatore.nome} ${this.operatore.cognome}`, `${this.operatore.sede.codice}`,
                new Localita(coordinate ? coordinate : null, scheda.localita.indirizzo), null
            );
            this.reducerSchedaTelefonata('cerca');
        }
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
            f.codSchedaContatto.value ? f.telefono.patchValue(this.schedaContatto?.richiedente?.telefono) : f.telefono.patchValue('');
            f.codSchedaContatto.value ? f.nominativo.patchValue(this.schedaContatto?.richiedente?.nominativo) : f.nominativo.patchValue('');
            f.nominativo.enable();
            f.telefono.enable();
        } else {
            Object.keys(this.scorciatoieTelefono).forEach(x => this.scorciatoieTelefono[x] = x === scorciatoia);
            let nominativo = this.richiestaModifica?.richiedente?.nominativo ? this.richiestaModifica?.richiedente?.nominativo : null;
            switch (scorciatoia) {
                case '112':
                    nominativo = 'Carabinieri';
                    break;
                case '113':
                    nominativo = 'Polizia';
                    break;
                case '118':
                    nominativo = 'Servizio Sanitario di Urgenza ed Emergenza';
                    break;
                case 'VV.UU.':
                    nominativo = 'Polizia Municipale';
                    break;
            }
            f.nominativo.patchValue(nominativo);
            f.telefono.patchValue(scorciatoia);
            f.nominativo.disable();
            f.telefono.disable();
            f.nominativo.markAsDirty();
            f.telefono.markAsDirty();
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

    getCheckboxEsercitazioneState(): CheckboxInterface {
        const id = 'check-chiamata-esercitazione';
        const status = this.f.esercitazione.value;
        const label = 'ESERCITAZIONE';
        const disabled = !!(this.modifica && this.richiestaModifica);
        return { id, status, label, disabled };
    }

    setUrgenza(): void {
        if (this.checkSubmit() && !this.f.urgenza.value && !this.richiestaModifica) {
            this.f.urgenza.patchValue(true);
            this.onSubmit(AzioneChiamataEnum.MettiInCoda, { urgente: true });
        }
    }

    setEsercitazioneValue(): void {
        const newUrgenzaValue = !this.f.esercitazione.value;
        this.f.esercitazione.patchValue(newUrgenzaValue);
    }

    onChangePrioritaRichiesta(nuovaPrioritaRichiesta: Priorita): void {
        this.f.prioritaRichiesta.patchValue(nuovaPrioritaRichiesta);
    }

    onInAttesa(): void {
        if (this.checkSubmit()) {
            this.onSubmit(AzioneChiamataEnum.InAttesa);
        }
    }

    onChiudiModifica(): void {
        this.store.dispatch([
            new ClearRichiestaModifica(),
            new ToggleModifica(true, true)
        ]);
    }

    onResetChiamata(): void {
        let modalConfermaReset;
        modalConfermaReset = this.modalService.open(ConfirmModalComponent, {
            windowClass: 'modal-holder',
            backdropClass: 'light-blue-backdrop',
            centered: true
        });
        modalConfermaReset.componentInstance.icona = { descrizione: 'exclamation-triangle', colore: 'danger' };
        modalConfermaReset.componentInstance.titolo = 'Reset Chiamata';
        modalConfermaReset.componentInstance.messaggio = 'Sei sicuro di voler effettuare il reset della chiamata?';
        modalConfermaReset.componentInstance.messaggioAttenzione = 'Tutti i dati inseriti verranno eliminati.';

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

    onAnnullaChiamataFromMappa(): void {
        this.closeChiamataFromMappa.emit(true);
    }

    impostaAzioneChiamata(azioneChiamata: AzioneChiamataEnum): void {
        this.onSubmit(azioneChiamata);
    }

    formIsInvalid(): boolean {
        return !!(this.richiestaForm.invalid);
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

                if (this.apertoFromMappa) {
                    this.onAnnullaChiamataFromMappa();
                }

            } else if (this.modifica) {
                if (this.richiestaModifica && this.richiestaModifica.tipologie[0] && this.f.codTipologia && (this.richiestaModifica.tipologie[0].codice !== this.f.codTipologia.value)) {
                    clearTriageSummary(this.store);
                    clearTriageChiamataModalData(this.store);
                    this.pos = null;
                }
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
            if (azione === AzioneChiamataEnum.InviaPartenza) {
                // Controllo se ho premuto 'Conferma e Invia Partenza'
                this.store.dispatch(new SetRedirectComposizionePartenza(true));
            }
        }
        const urgente = options?.urgente;

        this.store.dispatch(new ReducerSchedaTelefonata(schedaTelefonata, {
            urgente,
            fromMappa: !!(this.apertoFromMappa)
        }));
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
