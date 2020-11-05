import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import {
    GetListaMezziSquadre,
    IdRichiestaSostituzione,
    StartListaComposizioneLoading,
} from '../../store/actions/sostituzione-partenza/sostituzione-partenza.actions';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { SostituzionePartenzaModalState } from '../../store/states/sostituzione-partenza-modal/sostituzione-partenza-modal.state';
import { MezziComposizioneState } from '../../store/states/mezzi-composizione/mezzi-composizione.state';
import { MezzoComposizione } from '../../interface/mezzo-composizione-interface';
import { SquadreComposizioneState } from '../../store/states/squadre-composizione/squadre-composizione.state';
import { SquadraComposizione } from '../../interface/squadra-composizione-interface';
import { makeCopy } from '../../helper/function';
import { StatoMezzo } from '../../enum/stato-mezzo.enum';
import {
    ClearListaMezziComposizione,
    HoverInMezzoComposizione,
    HoverOutMezzoComposizione,
    ReducerSelectMezzoComposizione,
    SganciamentoMezzoComposizione,
    UnselectMezzoComposizione
} from '../../store/actions/mezzi-composizione/mezzi-composizione.actions';
import { AddBoxPartenza, ClearBoxPartenze } from '../../../features/home/store/actions/composizione-partenza/box-partenza.actions';
import {
    ClearListaSquadreComposizione,
    ClearSquadraComposizione,
    HoverInSquadraComposizione,
    HoverOutSquadraComposizione,
    SelectSquadraComposizione,
    UnselectSquadraComposizione
} from '../../store/actions/squadre-composizione/squadre-composizione.actions';
import { UnselectMezziAndSquadreComposizioneAvanzata } from '../../../features/home/store/actions/composizione-partenza/composizione-avanzata.actions';
import { FiltriComposizioneState } from '../../store/states/filtri-composizione/filtri-composizione.state';
import {
    ResetRicercaMezziComposizione,
    ResetRicercaSquadreComposizione,
    SetRicercaMezziComposizione,
    SetRicercaSquadreComposizione
} from '../../store/actions/ricerca-composizione/ricerca-composizione.actions';
import { ListaSquadre } from '../../interface/lista-squadre';
import { VisualizzaListaSquadrePartenza } from '../../../features/home/store/actions/richieste/richieste.actions';
import { Partenza } from '../../model/partenza.model';
import { Mezzo } from '../../model/mezzo.model';
import { Squadra } from '../../model/squadra.model';
import { UpdateFormValue } from '@ngxs/form-plugin';
import { PaginationComposizionePartenzaState } from '../../store/states/pagination-composizione-partenza/pagination-composizione-partenza.state';
import { SintesiRichiesta } from '../../model/sintesi-richiesta.model';
import { GetFiltriComposizione } from '../../store/actions/filtri-composizione/filtri-composizione.actions';
import { SganciamentoInterface } from '../../interface/sganciamento.interface';

@Component({
    selector: 'app-sostituzione-partenza',
    templateUrl: './sostituzione-partenza-modal.component.html',
    styleUrls: ['./sostituzione-partenza-modal.component.css']
})
export class SostituzionePartenzaModalComponent implements OnInit, OnDestroy {

    @Select(SostituzionePartenzaModalState.formValid) formValid$: Observable<boolean>;
    formValid: boolean;

    // Mezzi Composizione
    @Select(MezziComposizioneState.mezziComposizione) mezziComposizione$: Observable<MezzoComposizione[]>;
    mezziComposizione: MezzoComposizione[];
    @Select(MezziComposizioneState.idMezzoComposizioneSelezionato) idMezzoSelezionato$: Observable<string>;
    idMezzoSelezionato: string;
    @Select(MezziComposizioneState.idMezziInPrenotazione) idMezziInPrenotazione$: Observable<string[]>;
    idMezziInPrenotazione: string[];
    @Select(MezziComposizioneState.idMezziPrenotati) idMezziPrenotati$: Observable<string[]>;
    idMezziPrenotati: string[];
    @Select(MezziComposizioneState.idMezziBloccati) idMezziBloccati$: Observable<string[]>;
    idMezziBloccati: string[];
    @Select(MezziComposizioneState.idMezzoHover) idMezzoHover$: Observable<string>;
    idMezzoHover: string;

    // Squadre Composizione
    @Select(SquadreComposizioneState.squadreComposizione) squadraComposizione$: Observable<SquadraComposizione[]>;
    squadreComposizione: SquadraComposizione[];
    @Select(SquadreComposizioneState.idSquadreSelezionate) idSquadreSelezionate$: Observable<string[]>;
    idSquadreSelezionate: Array<string>;
    @Select(SquadreComposizioneState.idSquadraHover) idSquadraHover$: Observable<string>;
    idSquadraHover: string;


    // Paginazione Mezzi
    @Select(PaginationComposizionePartenzaState.pageMezzi) currentPageMezzi$: Observable<number>;
    currentPageMezzi: number;
    @Select(PaginationComposizionePartenzaState.totalItemsMezzi) totalItemsMezzi$: Observable<number>;
    totalItemsMezzi: number;
    @Select(PaginationComposizionePartenzaState.pageSizeMezzi) pageSizeMezzi$: Observable<number>;
    pageSizeMezzi: number;

    // Paginazione Squadre
    @Select(PaginationComposizionePartenzaState.pageSquadre) currentPageSquadre$: Observable<number>;
    currentPageSquadre: number;
    @Select(PaginationComposizionePartenzaState.totalItemsSquadre) totalItemsSquadre$: Observable<number>;
    totalItemsSquadre: number;
    @Select(PaginationComposizionePartenzaState.pageSizeSquadre) pageSizeSquadre$: Observable<number>;
    pageSizeSquadre: number;

    // Filtri
    @Select(FiltriComposizioneState.filtri) filtriAffini$: Observable<any>;

    // Loading Liste Mezzi e Squadre
    @Select(SostituzionePartenzaModalState.loadingListe) loadingListe$: Observable<boolean>;
    loadingListe: boolean;

    richiesta: SintesiRichiesta;
    idRichiesta: string;
    codRichiesta: string;
    partenza: Partenza;
    sostituzionePartenzaForm: FormGroup;
    submitted: boolean;

    statoMezzo = StatoMezzo;
    ricercaSquadre: string;
    ricercaMezzi: string;
    partenzaDaSostituire = true;
    nuovoMezzo: Mezzo = {
        codice: '',
        descrizione: '',
        genere: '',
        stato: null,
        appartenenza: null,
        distaccamento: null,
        coordinate: null,
    };
    nuoveSquadre: Squadra[] = [];
    public time = { hour: 13, minute: 30, second: 30 };

    subscription: Subscription = new Subscription();

    constructor(private modal: NgbActiveModal,
                private fb: FormBuilder,
                private store: Store) {
        // Prendo i mezzi da visualizzare nella lista
        this.subscription.add(
            this.mezziComposizione$.subscribe((mezziComp: MezzoComposizione[]) => {
                this.mezziComposizione = mezziComp;
            })
        );
        // Prendo il mezzo selezionato
        this.subscription.add(
            this.idMezzoSelezionato$.subscribe((idMezzo: string) => {
                this.idMezzoSelezionato = idMezzo;
            })
        );
        // Prendo i mezzi in prenotazione
        this.subscription.add(
            this.idMezziInPrenotazione$.subscribe((idMezzi: string[]) => {
                this.idMezziInPrenotazione = idMezzi;
            })
        );
        // Prendo i mezzi prenotati
        this.subscription.add(
            this.idMezziPrenotati$.subscribe((idMezzi: string[]) => {
                this.idMezziPrenotati = idMezzi;
            })
        );
        // Prendo il mezzo hover
        this.subscription.add(
            this.idMezzoHover$.subscribe((idMezzo: string) => {
                this.idMezzoHover = idMezzo;
            })
        );
        // Prendo il mezzo bloccato
        this.subscription.add(
            this.idMezziBloccati$.subscribe((idMezzi: string[]) => {
                this.idMezziBloccati = idMezzi;
            })
        );
        // Prendo le squadre da visualizzare nella lista
        this.subscription.add(
            this.squadraComposizione$.subscribe((squadreComp: SquadraComposizione[]) => {
                this.squadreComposizione = makeCopy(squadreComp);
            })
        );
        // Prendo la squadra selezionata
        this.subscription.add(
            this.idSquadreSelezionate$.subscribe((idSquadre: string[]) => {
                this.idSquadreSelezionate = idSquadre;
            })
        );
        // Prendo la squadra hover
        this.subscription.add(
            this.idSquadraHover$.subscribe((idSquadra: string) => {
                this.idSquadraHover = idSquadra;
            })
        );
        // Prendo "formValid"
        this.subscription.add(
            this.formValid$.subscribe((formValid: boolean) => {
                this.formValid = formValid;
            })
        );
        // Prendo Loading Liste Mezzi e Squadre
        this.subscription.add(
            this.loadingListe$.subscribe((loading: boolean) => {
                this.loadingListe = loading;
            })
        );
        // Prendo Pagina Corrente Mezzi
        this.subscription.add(
            this.currentPageMezzi$.subscribe((currentPageMezzi: number) => {
                this.currentPageMezzi = currentPageMezzi;
            })
        );
        // Prendo Totale Items Mezzi
        this.subscription.add(
            this.totalItemsMezzi$.subscribe((totalItemsMezzi: number) => {
                this.totalItemsMezzi = totalItemsMezzi;
            })
        );
        // Prendo Pagina Size Mezzi
        this.subscription.add(
            this.pageSizeMezzi$.subscribe((pageSizeMezzi: number) => {
                this.pageSizeMezzi = pageSizeMezzi;
            })
        );
        // Prendo Pagina Corrente Squadre
        this.subscription.add(
            this.currentPageSquadre$.subscribe((currentPageSquadre: number) => {
                this.currentPageSquadre = currentPageSquadre;
            })
        );
        // Prendo Totale Items Squadre
        this.subscription.add(
            this.totalItemsSquadre$.subscribe((totalItemsSquadre: number) => {
                this.totalItemsSquadre = totalItemsSquadre;
            })
        );
        // Prendo Pagina Size Squadre
        this.subscription.add(
            this.pageSizeSquadre$.subscribe((pageSizeSquadre: number) => {
                this.pageSizeSquadre = pageSizeSquadre;
            })
        );
        this.initForm();
        this.formatTime();
        this.subscription.add(this.loadingListe$.subscribe(res => this.loadingListe = res));
    }

    ngOnInit(): void {
        this.store.dispatch(new IdRichiestaSostituzione(this.idRichiesta));
        this.store.dispatch(new GetListaMezziSquadre());
        this.store.dispatch(new GetFiltriComposizione());
    }

    ngOnDestroy(): void {
        this.store.dispatch([
            new ClearListaMezziComposizione(),
            new ClearListaSquadreComposizione(),
            new ResetRicercaSquadreComposizione(),
            new ResetRicercaMezziComposizione(),
            new UnselectMezziAndSquadreComposizioneAvanzata(),
            new ClearBoxPartenze(),
        ]);
        this.store.dispatch(new UpdateFormValue({
            value: {
                motivazioneAnnullamento: undefined,
            },
            path: 'sostituzionePartenza.sostituzionePartenzaForm'
        }));
        this.store.dispatch(new ClearSquadraComposizione());
    }

    initForm(): void {
        this.sostituzionePartenzaForm = new FormGroup({
            motivazioneAnnullamento: new FormControl(),
            dataAnnullamento: new FormControl(),
        });
        this.sostituzionePartenzaForm = this.fb.group({
            motivazioneAnnullamento: [null],
            dataAnnullamento: [null],
        });
    }

    get f(): any {
        return this.sostituzionePartenzaForm.controls;
    }

    formatTime(): void {
        const d = new Date();
        this.time.hour = d.getHours();
        this.time.minute = d.getMinutes();
        this.time.second = d.getSeconds();
    }

    formatTimeForCallBack(): any {
        return { oraEvento: this.time };
    }

    formatDate(): void {
        let data = new Date();
        const orario = this.time;
        data.setHours(orario.hour);
        data.setMinutes(orario.minute);
        data.setSeconds(orario.second);
        data.setMilliseconds(0);
        data = new Date(data.getTime());
        this.f.dataAnnullamento.patchValue(data);
    }

    onListaSquadrePartenza(): void {
        const listaSquadre = {} as ListaSquadre;
        listaSquadre.idPartenza = this.partenza.id;
        listaSquadre.squadre = this.partenza.squadre;
        this.store.dispatch(new VisualizzaListaSquadrePartenza(listaSquadre));
    }


    mezzoSelezionato(mezzoComposizione: MezzoComposizione): void {
        this.store.dispatch([new StartListaComposizioneLoading(),
            new ReducerSelectMezzoComposizione(mezzoComposizione)]);
        this.nuovoMezzo = mezzoComposizione.mezzo;
    }

    mezzoDeselezionato(event?: any): void {
        this.store.dispatch([
            new StartListaComposizioneLoading(),
            new UnselectMezzoComposizione(),
            new ClearBoxPartenze()
        ]);
        this.nuovoMezzo = {
            codice: '',
            descrizione: '',
            genere: '',
            stato: null,
            appartenenza: null,
            distaccamento: null,
            coordinate: null,
        };
    }

    mezzoHoverIn(mezzoComposizione: MezzoComposizione): void {
        this.store.dispatch([
            new HoverInMezzoComposizione(mezzoComposizione.id, mezzoComposizione.mezzo.coordinateFake),
        ]);
    }

    mezzoHoverOut(): void {
        this.store.dispatch([
            new HoverOutMezzoComposizione(),
        ]);
    }

    onSganciamento(sganciamentoObj: SganciamentoInterface): void {
        this.store.dispatch(new SganciamentoMezzoComposizione(sganciamentoObj));
    }

    squadraSelezionata(squadraComposizione: SquadraComposizione): void {
        this.store.dispatch(new StartListaComposizioneLoading());
        if (this.nuovoMezzo.codice === '' && this.nuoveSquadre.length <= 0) {
            this.store.dispatch(new AddBoxPartenza());
        }
        if (squadraComposizione) {
            if (!this.nuoveSquadre.includes(squadraComposizione.squadra)) {
                this.nuoveSquadre.push(squadraComposizione.squadra);
                this.store.dispatch(new SelectSquadraComposizione(squadraComposizione));
            }
        }
    }

    squadraDeselezionata(squadraComposizione: SquadraComposizione): void {
        this.store.dispatch([new StartListaComposizioneLoading(),
            new UnselectSquadraComposizione(squadraComposizione)]);
        const r = squadraComposizione.squadra;
        const a = this.nuoveSquadre.filter(e => e !== r);
        this.nuoveSquadre = a;
        if (this.nuovoMezzo && this.nuoveSquadre.length >= 0) {
            this.nuoveSquadre = [];
            this.store.dispatch(new ClearBoxPartenze());
        }
    }

    squadraHoverIn(squadraComposizione: SquadraComposizione): void {
        this.store.dispatch(new HoverInSquadraComposizione(squadraComposizione.id));
    }

    squadraHoverOut(squadraComposizione: SquadraComposizione): void {
        this.store.dispatch(new HoverOutSquadraComposizione(squadraComposizione.id));
    }

    checkSquadraSelezione(idSquadra: string): boolean {
        let selected = false;
        this.idSquadreSelezionate.forEach((id: string) => {
            if (id === idSquadra) {
                selected = true;
            }
        });
        return selected;
    }

    changeRicercaSquadre(): void {
        this.store.dispatch([
            new StartListaComposizioneLoading(),
            new SetRicercaSquadreComposizione(makeCopy(this.ricercaSquadre)),
            new GetListaMezziSquadre()
        ]);
    }

    changeRicercaMezzi(): void {
        this.store.dispatch([
            new StartListaComposizioneLoading(),
            new SetRicercaMezziComposizione(makeCopy(this.ricercaMezzi)),
            new GetListaMezziSquadre()
        ]);
    }

    onClearSearchSquadre(): void {
        this.ricercaSquadre = '';
        this.store.dispatch([
            new StartListaComposizioneLoading(),
            new SetRicercaSquadreComposizione(makeCopy(this.ricercaSquadre)),
            new GetListaMezziSquadre()
        ]);
    }

    onClearSearchMezzi(): void {
        this.ricercaMezzi = '';
        this.store.dispatch([
            new StartListaComposizioneLoading(),
            new SetRicercaMezziComposizione(makeCopy(this.ricercaMezzi)),
            new GetListaMezziSquadre()
        ]);
    }

    getTitle(): string {
        return 'Sostituzione Partenza - Richiesta ' + this.codRichiesta;
    }

    onDismiss(): void {
        this.modal.close({ status: 'ko' });
    }

    closeModal(type: string): void {
        this.modal.close({ status: type });
    }

    onConferma(): void {
        this.submitted = true;

        if (!this.sostituzionePartenzaForm.valid) {
            return;
        }
        // handling time
        this.formatTimeForCallBack();
        this.formatDate();
        const mezzo = this.store.selectSnapshot(MezziComposizioneState.mezzoSelezionato);
        const squadre = this.store.selectSnapshot(SquadreComposizioneState.squadreSelezionate);
        // per rimuovere squadre duplicate
        const squadreUnique = [];
        const uniqueObject = {};
        for (const i in squadre) {
            const objTitle = squadre[i].id;
            uniqueObject[objTitle] = squadre[i];
        }
        for (const i in uniqueObject) {
            squadreUnique.push(uniqueObject[i].squadra);
        }
        this.modal.close({
            status: 'ok',
            result: { mezzo, squadre: squadreUnique, motivazioneAnnullamento: this.f.motivazioneAnnullamento.value, dataAnnullamento: this.f.dataAnnullamento.value, time: this.time }
        });
    }

    mezziPageChange(pageMezzi: number): void {
        this.store.dispatch(new StartListaComposizioneLoading());
        const options = {
            page: {
                pageMezzi,
            },
            idRichiesta: this.idRichiesta,
        };
        this.store.dispatch(new GetListaMezziSquadre(options));
    }

    squadrePageChange(pageSquadre: number): void {
        this.store.dispatch(new StartListaComposizioneLoading());
        const options = {
            page: {
                pageSquadre,
            },
            idRichiesta: this.idRichiesta,
        };
        this.store.dispatch(new GetListaMezziSquadre(options));
    }
}
