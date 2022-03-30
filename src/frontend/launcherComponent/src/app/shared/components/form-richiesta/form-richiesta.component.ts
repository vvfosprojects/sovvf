import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
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
    ClearCountInterventiProssimita, ClearIdChiamata,
    ClearIdChiamataMarker,
    ClearInterventiProssimita, ClearIstanteRicezioneRichiesta,
    ClearMarkerChiamata, ClearOperatoreChiamata, ClearPrioritaRichiesta, ClearStatoChiamata,
    ReducerSchedaTelefonata,
    SetCompetenze,
    SetCompetenzeSuccess,
    SetFormSubmitted,
    SetRedirectComposizionePartenza,
    StartChiamata,
    UpdateScorciatoiaTelefono
} from '../../../features/home/store/actions/form-richiesta/scheda-telefonata.actions';
import { StatoRichiesta } from '../../enum/stato-richiesta.enum';
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
    GetDettagliTipologieByCodTipologia,
    SetDettaglioTipologiaTriageChiamata,
    SetTipologiaTriageChiamata
} from '../../store/actions/triage-modal/triage-modal.actions';
import { DettaglioTipologia } from '../../interface/dettaglio-tipologia.interface';
import { TriageSummary } from '../../interface/triage-summary.interface';
import { ClearTriageSummary, SetSchedaContattoTriageSummary, SetTriageSummary } from '../../store/actions/triage-summary/triage-summary.actions';
import { CheckboxInterface } from '../../interface/checkbox.interface';
import { ClearSchedaContattoTelefonata, OpenDettaglioSchedaContatto } from '../../../features/home/store/actions/schede-contatto/schede-contatto.actions';
import { PosInterface } from '../../interface/pos.interface';
import { TipoTerreno } from '../../model/tipo-terreno';
import { TipoTerrenoEnum } from '../../enum/tipo-terreno.enum';
import { TriageChiamataModalState } from '../../store/states/triage-chiamata-modal/triage-chiamata-modal.state';
import { SchedaTelefonataState } from '../../../features/home/store/states/form-richiesta/scheda-telefonata.state';
import { TipologicheMezziState } from '../../../features/home/store/states/composizione-partenza/tipologiche-mezzi.state';
import { ListaTipologicheMezzi } from '../../../features/home/composizione-partenza/interface/filtri/lista-filtri-composizione-interface';
import { TipologicaComposizionePartenza } from '../../../features/home/composizione-partenza/interface/filtri/tipologica-composizione-partenza.interface';
import { TreeviewItem } from 'ngx-treeview';
import { ItemTriageData } from '../../interface/item-triage-data.interface';
import { EsriService } from '../../../features/maps/map-service/esri.service';
import { SetCentroMappa } from '../../../features/maps/store/actions/centro-mappa.actions';
import { CentroMappa } from '../../../features/maps/maps-model/centro-mappa.model';
import { AddConcorrenza, DeleteConcorrenza } from '../../store/actions/concorrenza/concorrenza.actions';
import { TipoConcorrenzaEnum } from '../../enum/tipo-concorrenza.enum';
import { AddConcorrenzaDtoInterface } from '../../interface/dto/concorrenza/add-concorrenza-dto.interface';
import { UpdateFormValue } from '@ngxs/form-plugin';
import { AppState } from '../../store/states/app/app.state';
import { getPrioritaTriage } from '../../helper/function-triage';
import { makeCopy, roundToDecimal } from '../../helper/function-generiche';
import { createChiamataMarker } from '../../helper/mappa/chiamata-marker';
import AddressCandidate from '@arcgis/core/tasks/support/AddressCandidate';
import Point from '@arcgis/core/geometry/Point';

@Component({
    selector: 'app-form-richiesta',
    templateUrl: './form-richiesta.component.html',
    styleUrls: ['./form-richiesta.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class FormRichiestaComponent implements OnInit, OnChanges, OnDestroy {

    @Select(SchedaTelefonataState.idChiamata) idChiamata$: Observable<string>;
    idChiamata: string;
    @Select(SchedaTelefonataState.scorciatoieTelefono) scorciatoieTelefono$: Observable<any>;
    scorciatoieTelefono: any;

    @Select(TriageChiamataModalState.triage) triage$: Observable<TreeviewItem>;
    triage: TreeviewItem;
    @Select(TriageChiamataModalState.triageData) triageData$: Observable<ItemTriageData[]>;
    triageData: ItemTriageData[];
    @Select(TriageChiamataModalState.loadingTriageChiamata) loadingTriageChiamata$: Observable<boolean>;
    loadingTriageChiamata: boolean;

    @Select(TriageChiamataModalState.dettagliTipologia) dettagliTipologia$: Observable<DettaglioTipologia[]>;
    dettagliTipologia: DettaglioTipologia[];

    @Select(SchedaTelefonataState.loadingDettagliTipologia) loadingDettagliTipologia$: Observable<boolean>;
    loadingDettagliTipologia: boolean;

    @Select(TipologicheMezziState.tipologiche) tipologiche$: Observable<ListaTipologicheMezzi>;
    distaccamenti: TipologicaComposizionePartenza[];
    distaccamentiFiltered: TipologicaComposizionePartenza[];

    @Input() submitted: boolean;

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
    @Input() provincia: string;
    @Input() cap: string;
    @Input() regione: string;
    @Input() civico: string;

    @Output() closeChiamataFromMappa: EventEmitter<boolean> = new EventEmitter<boolean>();

    chiamataMarker: ChiamataMarker;
    AzioneChiamataEnum = AzioneChiamataEnum;
    StatoRichiesta = StatoRichiesta;
    pos: PosInterface[];

    richiestaForm: FormGroup;

    private subscription = new Subscription();

    constructor(private formBuilder: FormBuilder,
                private store: Store,
                private modalService: NgbModal,
                private esriService: EsriService) {
        this.store.dispatch(new StartChiamata());
        this.getIdChiamata();
        this.getScorciatoieTelefono();
        this.initForm();
        this.getLoadingDettagliTipologia();
        this.getDettagliTipologia();
        this.getTipologiche();
        this.getTriage();
        this.getTriageData();
        this.getLoadingTriageChiamata();
    }

    ngOnInit(): void {
        if (this.apertoFromMappa) {
            this.setIndirizzoFromMappa(this.lat, this.lon, this.address, this.provincia, this.cap, this.regione, this.civico);
        }
        if (this.richiestaModifica && this.richiestaModifica.codiceSchedaNue) {
            this.store.dispatch(new SetSchedaContattoTriageSummary(this.richiestaModifica.codiceSchedaNue));
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes) {
            if (changes.schedaContatto?.currentValue) {
                const schedaContatto = changes.schedaContatto.currentValue;
                this.onChangeSchedaContatto(schedaContatto);
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
                    const data = {
                        type: TipoConcorrenzaEnum.Richiesta,
                        value: richiestaModifica.codice
                    } as AddConcorrenzaDtoInterface;
                    this.store.dispatch(new AddConcorrenza([data]));
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
            // if (changes.competenze?.currentValue) {
            //     if (this.f.indirizzo && this.f.latitudine && this.f.longitudine && !this.modifica) {
            //         this.selectCompetenzaAuto();
            //     }
            // }
            if (changes.loadingCompetenze?.currentValue !== null) {
                if (this.f) {
                    switch (changes.loadingCompetenze?.currentValue) {
                        case true:
                            this.f.latitudine.disable();
                            this.f.longitudine.disable();
                            break;
                        case false:
                            this.f.latitudine.enable();
                            this.f.longitudine.enable();
                            break;
                        default:
                            break;
                    }
                }
            }
        }
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
        this.clearFormDisconnection();

        if (this.modifica) {
            this.store.dispatch(new DeleteConcorrenza(TipoConcorrenzaEnum.Richiesta));
        }
    }

    getIdChiamata(): void {
        this.subscription.add(
            this.idChiamata$.subscribe((idChiamata: string) => {
                this.idChiamata = idChiamata;
            })
        );
    }

    getScorciatoieTelefono(): void {
        this.subscription.add(
            this.scorciatoieTelefono$.subscribe((scorciatoieTelefono: any) => {
                this.scorciatoieTelefono = scorciatoieTelefono;
                if (scorciatoieTelefono) {
                    if (this.f && !Object.keys(this.scorciatoieTelefono).filter((k: string) => this.scorciatoieTelefono[k] === true)?.length) {
                        this.f.nominativo.enable();
                        this.f.telefono.enable();
                    }
                }
            })
        );
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

    onChangeSchedaContatto(schedaContatto: SchedaContatto): void {
        if (schedaContatto?.codiceScheda) {
            if (!this.f?.codSchedaContatto?.value) {
                this.setSchedaContatto(schedaContatto);
            }
        }
        // Controllo scorciatoia numero da Scheda Contatto
        const telefono = schedaContatto.richiedente.telefono;
        const checkTelefono = JSON.stringify(Object.keys(this.scorciatoieTelefono));
        if (checkTelefono.includes(telefono)) {
            this.onCheckScorciatoiaNumero(telefono);
        }
    }

    clearFormDisconnection(): void {
        this.pos = null;
        this.store.dispatch([
            new ClearSchedaContattoTelefonata(),
            new SetFormSubmitted(false),
            new ClearClipboard(),
            new ClearMarkerChiamata(),
            new ClearCompetenze(),
            new ClearCountInterventiProssimita(),
            new ClearInterventiProssimita(),
            new ClearIdChiamata(),
            new ClearOperatoreChiamata(),
            new ClearStatoChiamata(),
            new ClearPrioritaRichiesta(),
            new ClearIstanteRicezioneRichiesta()
        ]);

        if (this.richiestaModifica) {
            this.store.dispatch(new ChiudiRichiestaModifica());
        }

        clearSummaryData(this.store);
        clearTriageSummary(this.store);
        clearTriageChiamataModalData(this.store);
        this.reducerSchedaTelefonata('reset');
    }

    initForm(): void {
        this.richiestaForm = this.formBuilder.group({
            id: [null],
            codice: [null],
            codiceRichiesta: [null],
            operatore: [null],
            codTipologia: [null, [Validators.required]],
            dettaglioTipologia: [null],
            istanteRicezioneRichiesta: [null],
            nominativo: [null, [Validators.required]],
            telefono: [null, [Validators.required]], // Inserire se necessario => Validators.pattern('^(\\+?)[0-9]+$')
            indirizzo: [null, [Validators.required]],
            latitudine: [null, [Validators.required, Validators.pattern('^(\\-?)([0-9]+)(\\.)([0-9]+)$')]],
            longitudine: [null, [Validators.required, Validators.pattern('^(\\-?)([0-9]+)(\\.)([0-9]+)$')]],
            provincia: [null, [Validators.required]],
            cap: [null, [Validators.required]],
            regione: [null, [Validators.required]],
            civico: [null],
            competenze: [null],
            codCompetenzaCentrale: [null],
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
            rilevanzaGrave: [null],
            rilevanzaStArCu: [null],
            notePrivate: [null],
            notePubbliche: [null],
            boschi: [null],
            campi: [null],
            sterpaglie: [null],
            descrizione: [null],
            zoneEmergenza: [null],
            prioritaRichiesta: [null, [Validators.required]],
            stato: [null],
            urgenza: [null],
            esercitazione: [null],
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
            provincia: this.richiestaModifica.localita.provincia,
            cap: this.richiestaModifica.localita.cap,
            regione: this.richiestaModifica.localita.regione,
            civico: this.richiestaModifica.localita.civico,
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

        console.log('this.richiestaModifica.stato', this.richiestaModifica.stato);

        this.store.dispatch([
            new GetDettagliTipologieByCodTipologia(+this.richiestaModifica.tipologie[0].codice),
            new UpdateFormValue({
                value: {
                    stato: this.richiestaModifica.stato,
                    codPrimaCompetenza: this.richiestaModifica.competenze?.length > 0 ? this.richiestaModifica.competenze[0]?.codice : null,
                    codSecondaCompetenza: this.richiestaModifica.competenze?.length > 1 ? this.richiestaModifica.competenze[1]?.codice : null,
                    codTerzaCompetenza: this.richiestaModifica.competenze?.length > 2 ? this.richiestaModifica.competenze[2]?.codice : null
                },
                path: 'schedaTelefonata.richiestaForm'
            })
        ]);

        this.patchScorciatoiaNumero(this.richiestaModifica.richiedente.telefono, true);
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
        return this.richiestaForm?.controls;
    }

    onChangeTipologia(codTipologia: string): void {
        // Ripulisco eventuali info triage e dettaglio tipologia presenti
        this.f.dettaglioTipologia.patchValue(null);
        if (!this.modifica) {
            clearTriageSummary(this.store);
            clearTriageChiamataModalData(this.store);
        }
        this.pos = null;
        if (codTipologia && !this.richiestaModifica) {
            // Prendo i dettagli tipologia
            this.store.dispatch(new GetDettagliTipologieByCodTipologia(+codTipologia));
        }
    }

    onChangeDettaglioTipologia(dettaglioTipologia: DettaglioTipologia): void {
        // Ripulisco eventuali info triage e dettaglio tipologia presenti
        this.f.dettaglioTipologia.patchValue(null);
        if (!this.modifica) {
            clearTriageSummary(this.store);
            clearTriageChiamataModalData(this.store);
        }
        this.pos = null;
        if (dettaglioTipologia) {
            // Trovo il dettaglio tipologia nella lista dei dettagli e aggiorno il valore
            const dettaglio = this.dettagliTipologia.filter(x => x.codiceDettaglioTipologia === dettaglioTipologia.codiceDettaglioTipologia)[0];
            this.f.dettaglioTipologia.patchValue(dettaglio);
            this.pos = dettaglio?.pos;
            // Setto tipologia e dettaglio per verificare esistenza triage
            this.store.dispatch([
                new SetTipologiaTriageChiamata(+this.tipologie.filter((t: Tipologia) => t.codice === this.f.codTipologia.value)[0].codice),
                new SetDettaglioTipologiaTriageChiamata(dettaglio?.codiceDettaglioTipologia, this.pos)
            ]);
        }
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

    getLoadingTriageChiamata(): void {
        this.subscription.add(
            this.loadingTriageChiamata$.subscribe((loadingTriageChiamata: boolean) => {
                this.loadingTriageChiamata = loadingTriageChiamata;
            })
        );
    }

    getTriage(): void {
        this.subscription.add(
            this.triage$.subscribe((triage: TreeviewItem) => {
                if (triage) {
                    let index = 0;
                    const mappedTriage = [];
                    const triageArray = [makeCopy(triage)];
                    for (const item of triageArray) {
                        index = index + 1;
                        mappedTriage[0] = getFatherMapped(item);
                    }
                    this.triage = mappedTriage[0];
                } else {
                    this.triage = null;
                }
            })
        );

        function getFatherMapped(item): TreeviewItem {
            return new TreeviewItem({
                text: item.text,
                value: item.value,
                children: item.internalChildren?.length ? mapTreeviewItems(item.internalChildren) : null,
                collapsed: item.internalCollapsed,
                disabled: item.internalDisabled
            });
        }

        function mapTreeviewItems(childrens: any): any {
            const childrensCopy = childrens;
            let childrenIndex = 0;
            for (const children of childrensCopy) {
                childrensCopy[childrenIndex] = getChildrenMapped(children);
                childrenIndex = childrenIndex + 1;
                if (children?.internalChildren) {
                    mapTreeviewItems(children.internalChildren);
                }
            }
            childrens = childrensCopy;
            return childrens;
        }

        function getChildrenMapped(item): TreeviewItem {
            return new TreeviewItem({
                text: item.text,
                value: item.value,
                children: item.internalChildren?.length ? mapTreeviewItems(item.internalChildren) : null,
                collapsed: item.internalCollapsed,
                disabled: item.internalDisabled
            });
        }
    }

    getTriageData(): void {
        this.subscription.add(
            this.triageData$.subscribe((triageData: ItemTriageData[]) => {
                if (triageData) {
                    this.triageData = triageData;
                } else {
                    this.triageData = null;
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

    reducerIndirizzo(candidateValue: { candidate: AddressCandidate, candidateAttributes: any }): void {
        if (!this.richiestaModifica) {
            this.onSetIndirizzo(candidateValue);
        } else {
            this.onModificaIndirizzo(candidateValue);
        }
    }

    onSetIndirizzo(candidateValue: { candidate: AddressCandidate, candidateAttributes: any }): void {
        const indirizzo = candidateValue.candidate.address ? candidateValue.candidate.address : null;
        const lat = roundToDecimal(candidateValue.candidate.location.latitude, 6);
        const lng = roundToDecimal(candidateValue.candidate.location.longitude, 6);
        const coordinate = new Coordinate(lat, lng);
        const sediSelezionate = this.store.selectSnapshot(AppState.vistaSedi);
        const sedeSelezionata = sediSelezionate[0];
        this.chiamataMarker = createChiamataMarker(this.idChiamata, this.operatore, sedeSelezionata, new Localita(coordinate ? coordinate : null, indirizzo));

        console.log('chiamataMarker', this.chiamataMarker);

        this.f.indirizzo.patchValue(indirizzo);
        this.f.latitudine.patchValue(lat);
        this.f.longitudine.patchValue(lng);
        this.f.provincia.patchValue(candidateValue.candidateAttributes.Subregion);
        this.f.cap.patchValue(candidateValue.candidateAttributes.Postal);
        this.f.regione.patchValue(candidateValue.candidateAttributes.Region);
        this.f.civico.patchValue(candidateValue.candidateAttributes.AddNum);
        this.f.indirizzo.markAsDirty();
        this.f.latitudine.markAsDirty();
        this.f.longitudine.markAsDirty();
        this.f.provincia.markAsDirty();
        this.f.cap.markAsDirty();
        this.f.regione.markAsDirty();
        this.f.civico.markAsDirty();

        this.store.dispatch(new UpdateFormValue({
            path: 'schedaTelefonata.richiestaForm',
            value: {
                provincia: candidateValue.candidateAttributes.Subregion,
                cap: candidateValue.candidateAttributes.Postal,
                regione: candidateValue.candidateAttributes.Region,
                civico: candidateValue.candidateAttributes.AddNum
            }
        }));

        this.reducerSchedaTelefonata('cerca');
    }

    setIndirizzoFromMappa(lat: number, lon: number, indirizzo: string, provincia: string, cap: string, regione: string, civico: string): void {
        const latitudine = roundToDecimal(lat, 6);
        const longitudine = roundToDecimal(lon, 6);
        const coordinate = new Coordinate(lat, lon);
        const sediSelezionate = this.store.selectSnapshot(AppState.vistaSedi);
        const sedeSelezionata = sediSelezionate[0];
        this.chiamataMarker = createChiamataMarker(this.idChiamata, this.operatore, sedeSelezionata, new Localita(coordinate ? coordinate : null, indirizzo));

        this.f.indirizzo.patchValue(indirizzo);
        this.f.latitudine.patchValue(latitudine);
        this.f.longitudine.patchValue(longitudine);
        this.f.provincia.patchValue(provincia);
        this.f.cap.patchValue(cap);
        this.f.regione.patchValue(regione);
        this.f.civico.patchValue(civico);
        this.f.latitudine.disable();
        this.f.longitudine.disable();
        this.f.indirizzo.disable();

        this.store.dispatch(new UpdateFormValue({
            path: 'schedaTelefonata.richiestaForm',
            value: {
                provincia,
                cap,
                regione,
                civico
            }
        }));

        this.reducerSchedaTelefonata('cerca');
    }

    onModificaIndirizzo(candidateValue: { candidate: AddressCandidate, candidateAttributes: any }): void {
        const indirizzo = candidateValue.candidate.address ? candidateValue.candidate.address : null;
        const lat = roundToDecimal(candidateValue.candidate.location.latitude, 6);
        const lng = roundToDecimal(candidateValue.candidate.location.longitude, 6);
        const coordinate = new Coordinate(lat, lng);
        const nuovoIndirizzo = new Localita(coordinate ? coordinate : null, indirizzo);

        this.f.indirizzo.patchValue(indirizzo);
        this.f.latitudine.patchValue(coordinate.latitudine);
        this.f.longitudine.patchValue(coordinate.longitudine);
        this.f.provincia.patchValue(candidateValue.candidateAttributes.Subregion);
        this.f.cap.patchValue(candidateValue.candidateAttributes.Postal);
        this.f.regione.patchValue(candidateValue.candidateAttributes.Region);
        this.f.civico.patchValue(candidateValue.candidateAttributes.AddNum);

        this.store.dispatch(new UpdateFormValue({
            path: 'schedaTelefonata.richiestaForm',
            value: {
                provincia: candidateValue.candidateAttributes.Subregion,
                cap: candidateValue.candidateAttributes.Postal,
                regione: candidateValue.candidateAttributes.Region,
                civico: candidateValue.candidateAttributes.AddNum
            }
        }));

        this.store.dispatch([
            new ModificaIndirizzo(nuovoIndirizzo),
            new SetCompetenze(coordinate, indirizzo, null)
        ]);
    }

    modificaIndirizzo(indirizzo: string): void {
        this.f.indirizzo.patchValue(indirizzo);
        if (!indirizzo) {
            this.store.dispatch([
                new ClearCompetenze(),
                new ClearCountInterventiProssimita(),
                new ClearInterventiProssimita(),
                new ClearMarkerChiamata(),
                new ClearIdChiamataMarker()
            ]);
            this.f.codPrimaCompetenza.patchValue(null);
            this.f.codSecondaCompetenza.patchValue(null);
            this.f.codTerzaCompetenza.patchValue(null);
            this.f.latitudine.patchValue(null);
            this.f.longitudine.patchValue(null);
            this.f.provincia.patchValue(null);
            this.f.cap.patchValue(null);
            this.f.regione.patchValue(null);
            this.f.civico.patchValue(null);
            this.f.indirizzo.markAsPristine();
            this.f.latitudine.markAsPristine();
            this.f.longitudine.markAsPristine();
            this.f.provincia.markAsPristine();
            this.f.cap.markAsPristine();
            this.f.regione.markAsPristine();
            this.f.civico.markAsPristine();
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

    onChangeCoordinate(): void {
        const indirizzoInserito = !!(this.f.indirizzo.value);
        const indirizzo = indirizzoInserito ? this.f.indirizzo.value : null;
        const lat = roundToDecimal(this.f.latitudine.value, 6);
        const lng = roundToDecimal(this.f.longitudine.value, 6);

        if (lat && lng) {
            const coordinate = new Coordinate(lat, lng);
            const locationPOI = new Point({
                latitude: coordinate.latitudine,
                longitude: coordinate.longitudine
            });
            const params = {
                location: locationPOI
            };
            this.esriService.getLocationToAddress(params).then((response: any) => {
                if (!this.modifica) {
                    const sediSelezionate = this.store.selectSnapshot(AppState.vistaSedi);
                    const sedeSelezionata = sediSelezionate[0];
                    this.chiamataMarker = createChiamataMarker(this.idChiamata, this.operatore, sedeSelezionata, new Localita(coordinate ? coordinate : null, indirizzo));
                    this.store.dispatch(new SetCompetenze(coordinate, indirizzo, this.chiamataMarker));
                } else {
                    const newCentroMappa = {
                        coordinateCentro: coordinate
                    } as CentroMappa;
                    this.store.dispatch([
                        new SetCentroMappa(newCentroMappa),
                        new SetCompetenze(coordinate, indirizzo)
                    ]);
                }
                this.f.indirizzo.patchValue(response.address);
                this.f.provincia.patchValue(response.attributes.Subregion);
                this.f.cap.patchValue(response.attributes.Postal);
                this.f.regione.patchValue(response.attributes.Region);
                this.f.civico.patchValue(response.attributes.AddNum);
                this.f.indirizzo.markAsDirty();
                this.f.latitudine.markAsDirty();
                this.f.longitudine.markAsDirty();
                this.f.provincia.markAsDirty();
                this.f.cap.markAsDirty();
                this.f.regione.markAsDirty();
                this.f.civico.markAsDirty();
            });
        } else {
            this.store.dispatch([
                new ClearCompetenze(),
                new ClearCountInterventiProssimita(),
                new ClearInterventiProssimita()
            ]);
            this.f.codPrimaCompetenza.patchValue(null);
            this.f.codSecondaCompetenza.patchValue(null);
            this.f.codTerzaCompetenza.patchValue(null);
        }
    }

    detectCompetenzeFuoriComando(): boolean {
        let comandoCompetenza: string;
        const codPrimaCompetenza = this.store.selectSnapshot(SchedaTelefonataState.formValue)?.codPrimaCompetenza;
        if (codPrimaCompetenza) {
            comandoCompetenza = codPrimaCompetenza.split('.')[0];
        }
        const codCompetenzaCentrale = this.store.selectSnapshot(SchedaTelefonataState.formValue)?.codCompetenzaCentrale;
        if (codCompetenzaCentrale) {
            comandoCompetenza = codCompetenzaCentrale.split('.')[0];
        }

        const sediSelezionate = this.store.selectSnapshot(AppState.vistaSedi);
        let comandoSelezionato: string;
        if (sediSelezionate?.length) {
            comandoSelezionato = sediSelezionate[0].split('.')[0];
        }
        return (comandoCompetenza && comandoSelezionato) && comandoCompetenza !== comandoSelezionato;
    }

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

    onDettaglioSchedaContatto(codiceScheda: string): void {
        if (codiceScheda) {
            this.store.dispatch(new OpenDettaglioSchedaContatto(codiceScheda));
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

        const triageModal = this.modalService.open(TriageChiamataModalComponent, {
            windowClass: 'xlModal modal-holder',
            backdropClass: 'light-blue-backdrop',
            centered: true,
        });

        triageModal.componentInstance.tipologiaSelezionata = this.tipologie.filter((t: Tipologia) => t.codice === codTipologia)[0];
        triageModal.componentInstance.dettaglioTipologiaSelezionato = this.f.dettaglioTipologia.value;
        triageModal.componentInstance.triage = this.triage;
        triageModal.componentInstance.triageData = this.triageData;
        triageModal.componentInstance.chiamataMarker = this.chiamataMarker;
        triageModal.componentInstance.checkedUrgenza = !!(this.f.urgenza.value);
        triageModal.componentInstance.disableUrgenza = this.formIsInvalid() || !!(this.f.urgenza.value);
        triageModal.componentInstance.apertoFromMappa = !!(this.apertoFromMappa);

        triageModal.result.then((res: TriageModalResult) => {
            switch (res.type) {
                case 'success':
                    console.log('TriageModalResult', res);
                    if (res?.triageSummary?.length) {
                        saveTriageSummary(this.store, res.triageSummary);
                    }
                    break;
                case 'dismiss':
                    console.log('TriageModalResult', res);
                    resetPrioritaRichiesta(this.f);
                    clearTriageSummary(this.store);
                    break;
                default:
                    console.log('TriageModalResult: default');
                    resetPrioritaRichiesta(this.f);
                    clearTriageSummary(this.store);
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
        const f = this.f;

        const latitude = +scheda.localita.coordinateString[0];
        const longitude = +scheda.localita.coordinateString[1];
        const locationPOI = new Point({
            latitude,
            longitude
        });

        f.noteNue.patchValue(scheda.dettaglio);
        f.codSchedaContatto.patchValue(scheda.codiceScheda);
        f.indirizzo.patchValue(scheda.localita?.indirizzo);
        f.latitudine.patchValue(latitude);
        f.longitudine.patchValue(longitude);

        const params = {
            location: locationPOI
        };
        this.esriService.getLocationToAddress(params).then((response: any) => {
            f.provincia.patchValue(response.attributes.Subregion);
            f.cap.patchValue(response.attributes.Postal);
            f.regione.patchValue(response.attributes.Region);
            f.civico.patchValue(response.attributes.AddNum);
            this.store.dispatch(new UpdateFormValue({
                path: 'schedaTelefonata.richiestaForm',
                value: {
                    provincia: response.attributes.Subregion,
                    cap: response.attributes.Postal,
                    regione: response.attributes.Region,
                    civico: response.attributes.AddNum
                }
            }));

            if (!this.richiestaModifica?.richiedente) {
                f.nominativo.patchValue(scheda.richiedente?.nominativo);
                f.telefono.patchValue(scheda.richiedente?.telefono);
            }

            if (!this.richiestaModifica) {
                const coordinate = new Coordinate(latitude, longitude);
                const sediSelezionate = this.store.selectSnapshot(AppState.vistaSedi);
                const sedeSelezionata = sediSelezionate[0];
                this.chiamataMarker = createChiamataMarker(this.idChiamata, this.operatore, sedeSelezionata, new Localita(coordinate ? coordinate : null, scheda.localita.indirizzo));
                this.reducerSchedaTelefonata('cerca');
            }
        });
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
            this.patchScorciatoiaNumero(scorciatoia, false);
            f.codSchedaContatto.value ? f.telefono.patchValue(this.schedaContatto?.richiedente?.telefono) : f.telefono.patchValue('');
            f.codSchedaContatto.value ? f.nominativo.patchValue(this.schedaContatto?.richiedente?.nominativo) : f.nominativo.patchValue('');
            f.nominativo.enable();
            f.telefono.enable();
        } else {
            Object.keys(this.scorciatoieTelefono).forEach(x => {
                if (x === scorciatoia) {
                    this.patchScorciatoiaNumero(scorciatoia, true);
                }
            });
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
                case 'VVUU':
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

    patchScorciatoiaNumero(scorciatoia: string, newValue: boolean): void {
        this.store.dispatch(new UpdateScorciatoiaTelefono(scorciatoia, newValue));
    }

    getCheckboxUrgenzaState(): CheckboxInterface {
        const id = 'check-chiamata-emergenza';
        const status = this.f.urgenza.value;
        const label = this.f.urgenza.value ? 'URGENZA SEGNALATA' : 'SEGNALA URGENZA E CONDIVIDI IN GESTIONE';
        const disabled = this.f.urgenza.value || this.formIsInvalid() || (this.richiestaModifica && !this.f.urgenza.value) || this.loadingCompetenze;
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
                        this.richiestaForm.reset();
                        this.store.dispatch([
                            new SetFormSubmitted(false),
                            new ClearClipboard(),
                            new ClearSchedaContattoTelefonata(),
                            new DelChiamataMarker(this.idChiamata)
                        ]);
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
        this.store.dispatch(new SetFormSubmitted(true));
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
            markerChiamata: this.chiamataMarker,
            formValue: this.richiestaForm.value
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
