import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { SintesiRichiesta } from '../../../shared/model/sintesi-richiesta.model';
import { Observable, Subscription } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { BoxPartenza, BoxPartenzaPreAccoppiati } from './interface/box-partenza-interface';
import { Composizione } from '../../../shared/enum/composizione.enum';
import { ComposizioneVeloceState } from '../store/states/composizione-partenza/composizione-veloce.state';
import { DirectionInterface } from '../../maps/maps-interface/direction.interface';
import { ClearDirection, SetDirection } from '../../maps/store/actions/maps-direction.actions';
import { SetCoordCentroMappa } from '../../maps/store/actions/centro-mappa.actions';
import { ComposizionePartenzaState } from '../store/states/composizione-partenza/composizione-partenza.state';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HelperSintesiRichiesta } from '../richieste/helper/_helper-sintesi-richiesta';
import { MezzoActionInterface } from '../../../shared/interface/mezzo-action.interface';
import { ActionMezzo } from '../store/actions/richieste/richieste.actions';
import { SganciamentoInterface } from 'src/app/shared/interface/sganciamento.interface';
import { ClearListaMezziComposizione, SganciamentoMezzoComposizione } from '../../../shared/store/actions/mezzi-composizione/mezzi-composizione.actions';
import { ClearListaSquadreComposizione } from '../../../shared/store/actions/squadre-composizione/squadre-composizione.actions';
import { ClearPreaccoppiati } from '../store/actions/composizione-partenza/composizione-veloce.actions';
import { FiltriComposizioneState } from '../../../shared/store/states/filtri-composizione/filtri-composizione.state';
import { ResetRicercaMezziComposizione, ResetRicercaSquadreComposizione, SetRicercaMezziComposizione, SetRicercaSquadreComposizione } from '../../../shared/store/actions/ricerca-composizione/ricerca-composizione.actions';
import { GetListeComposizioneAvanzata } from '../store/actions/composizione-partenza/composizione-avanzata.actions';
import { ListaTipologicheMezzi } from './interface/filtri/lista-filtri-composizione-interface';
import { TriageSummaryState } from '../../../shared/store/states/triage-summary/triage-summary.state';
import { TriageSummary } from '../../../shared/interface/triage-summary.interface';
import { ClearTriageSummary } from '../../../shared/store/actions/triage-summary/triage-summary.actions';
import { PaginationComposizionePartenzaState } from '../../../shared/store/states/pagination-composizione-partenza/pagination-composizione-partenza.state';
import { MezziComposizioneState } from '../../../shared/store/states/mezzi-composizione/mezzi-composizione.state';
import { MezzoComposizione } from '../../../shared/interface/mezzo-composizione-interface';
import { SquadreComposizioneState } from '../../../shared/store/states/squadre-composizione/squadre-composizione.state';
import { BoxPartenzaState } from '../store/states/composizione-partenza/box-partenza.state';
import { SquadraComposizione } from '../../../shared/interface/squadra-composizione-interface';
import { GetFiltriComposizione } from '../../../shared/store/actions/filtri-composizione/filtri-composizione.actions';
import { TipologicaComposizionePartenza } from './interface/filtri/tipologica-composizione-partenza.interface';
import { FiltroTurnoSquadre } from '../../../shared/enum/filtro-turno-composizione-partenza.enum';
import { TipologicheMezziState } from '../store/states/composizione-partenza/tipologiche-mezzi.state';
import { ClearRichiestaSelezionata, SetRichiestaSelezionata } from '../store/actions/richieste/richiesta-selezionata.actions';
import { RichiestaSelezionataState } from '../store/states/richieste/richiesta-selezionata.state';
import { AddConcorrenza, DeleteConcorrenza } from '../../../shared/store/actions/concorrenza/concorrenza.actions';
import { TipoConcorrenzaEnum } from '../../../shared/enum/tipo-concorrenza.enum';
import { makeCopy } from '../../../shared/helper/function-generiche';
import { AddConcorrenzaDtoInterface } from '../../../shared/interface/dto/concorrenza/add-concorrenza-dto.interface';
import { ConcorrenzaState } from '../../../shared/store/states/concorrenza/concorrenza.state';
import { ConcorrenzaInterface } from '../../../shared/interface/concorrenza.interface';
import { AuthState } from '../../auth/store/auth.state';
import { TurnOffComposizione } from '../store/actions/view/view.actions';

@Component({
    selector: 'app-composizione-partenza',
    templateUrl: './composizione-partenza.component.html',
    styleUrls: ['./composizione-partenza.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class ComposizionePartenzaComponent implements OnInit, OnDestroy {

    @Input() compPartenzaMode: Composizione;
    @Input() boxAttivi: boolean;
    @Input() nightMode: boolean;

    // Richiesta Composizione
    @Select(ComposizionePartenzaState.richiestaComposizione) richiestaComposizione$: Observable<SintesiRichiesta>;
    // Percorsi Richiesta Composizione
    @Select(ComposizionePartenzaState.visualizzaPercorsiRichiesta) visualizzaPercorsiRichiesta$: Observable<boolean>;

    // Loading
    @Select(ComposizionePartenzaState.loadingSquadre) loadingSquadre$: Observable<boolean>;
    @Select(ComposizionePartenzaState.loadingMezzi) loadingMezzi$: Observable<boolean>;
    @Select(ComposizionePartenzaState.loadingPreaccoppiati) loadingPreaccoppiati$: Observable<boolean>;
    @Select(ComposizionePartenzaState.loadingInvioPartenza) loadingInvioPartenza$: Observable<boolean>;

    // Filterbar
    @Select(TipologicheMezziState.tipologiche) tipologicheMezzi$: Observable<ListaTipologicheMezzi>;
    tipologicheMezzi: any;
    @Select(FiltriComposizioneState.filtri) filtri$: Observable<ListaTipologicheMezzi>;
    @Select(FiltriComposizioneState.filtriSelezionati) filtriSelezionati$: Observable<any>;
    @Select(TriageSummaryState.summary) summary$: Observable<TriageSummary[]>;

    // Mezzi Composizione
    @Select(MezziComposizioneState.mezziComposizione) mezziComposizione$: Observable<MezzoComposizione[]>;
    @Select(MezziComposizioneState.idMezzoComposizioneSelezionato) idMezzoSelezionato$: Observable<string>;
    @Select(MezziComposizioneState.idMezziInPrenotazione) idMezziInPrenotazione$: Observable<string[]>;
    @Select(MezziComposizioneState.idMezziPrenotati) idMezziPrenotati$: Observable<string[]>;
    @Select(MezziComposizioneState.idMezziBloccati) idMezziBloccati$: Observable<string[]>;
    @Select(MezziComposizioneState.idMezzoHover) idMezzoHover$: Observable<string>;

    // Squadre Composizione
    @Select(SquadreComposizioneState.squadreComposizione) squadraComposizione$: Observable<SquadraComposizione[]>;
    @Select(SquadreComposizioneState.idSquadreSelezionate) idSquadreSelezionate$: Observable<string[]>;
    @Select(SquadreComposizioneState.idSquadraHover) idSquadraHover$: Observable<string>;

    // Paginazione Mezzi
    @Select(PaginationComposizionePartenzaState.pageMezzi) currentPageMezzi$: Observable<number>;
    @Select(PaginationComposizionePartenzaState.totalItemsMezzi) totalItemsMezzi$: Observable<number>;
    @Select(PaginationComposizionePartenzaState.pageSizeMezzi) pageSizeMezzi$: Observable<number>;

    // Paginazione Squadre
    @Select(PaginationComposizionePartenzaState.pageSquadre) currentPageSquadre$: Observable<number>;
    @Select(PaginationComposizionePartenzaState.totalItemsSquadre) totalItemsSquadre$: Observable<number>;
    @Select(PaginationComposizionePartenzaState.pageSizeSquadre) pageSizeSquadre$: Observable<number>;

    // BoxPartenza Composizione
    @Select(BoxPartenzaState.boxPartenzaList) boxPartenzaList$: Observable<BoxPartenza[]>;
    boxPartenzaList: BoxPartenza[];
    @Select(BoxPartenzaState.idBoxPartenzaSelezionato) idBoxPartenzaSelezionato$: Observable<string>;
    idBoxPartenzaSelezionato: string;

    // Bottoni Composizione
    @Select(BoxPartenzaState.disableConfirmPartenza) disableConfirmPartenza$: Observable<boolean>;
    @Select(BoxPartenzaState.disableNuovaPartenza) disableNuovaPartenza$: Observable<boolean>;

    // Composizione Veloce
    @Select(ComposizioneVeloceState.preAccoppiati) preAccoppiati$: Observable<BoxPartenzaPreAccoppiati[]>;
    @Select(ComposizioneVeloceState.idPreAccoppiatoSelezionato) idPreAccoppiatoSelezionato$: Observable<string>;
    @Select(ComposizioneVeloceState.idPreAccoppiatiSelezionati) idPreAccoppiatiSelezionati$: Observable<string[]>;
    @Select(ComposizioneVeloceState.idPreAccoppiatiOccupati) idPreAccoppiatiOccupati$: Observable<string[]>;
    @Select(ComposizioneVeloceState.idPreAccoppiatoHover) idPreaccoppiatoHover$: Observable<string>;

    // Paginazione Composizione Veloce
    @Select(PaginationComposizionePartenzaState.pagePreaccoppiati) currentPagePreaccoppiati$: Observable<number>;
    @Select(PaginationComposizionePartenzaState.totalItemsPreaccoppiati) totalItemsPreaccoppiati$: Observable<number>;
    @Select(PaginationComposizionePartenzaState.pageSizePreaccoppiati) pageSizePreaccoppiati$: Observable<number>;

    richiesta: SintesiRichiesta;
    methods = new HelperSintesiRichiesta();

    Composizione = Composizione;

    private subscription = new Subscription();

    constructor(private modalService: NgbModal,
                private store: Store) {
        this.getRichiestaComposizione();
        this.getBoxPartenzaList();
        this.getTipologicheMezzi();
    }

    ngOnInit(): void {
        console.log('Componente Composizione creato');
    }

    ngOnDestroy(): void {
        this.store.dispatch([
            new DeleteConcorrenza(TipoConcorrenzaEnum.Richiesta),
            new ClearListaMezziComposizione(),
            new ClearListaSquadreComposizione(),
            new ClearPreaccoppiati(),
            new ResetRicercaMezziComposizione(),
            new ResetRicercaSquadreComposizione(),
            new ClearTriageSummary()
        ]);
        this.subscription.unsubscribe();
        console.log('Componente Composizione distrutto');
    }

    getRichiestaComposizione(): void {
        this.subscription.add(
            this.richiestaComposizione$.subscribe((r: SintesiRichiesta) => {
                if (r) {
                    this.richiesta = r;
                    const currentUser = this.store.selectSnapshot(AuthState.currentUser);
                    const concorrenza = this.store.selectSnapshot(ConcorrenzaState.concorrenza);
                    const richiestaConcorrenza = concorrenza.filter((c: ConcorrenzaInterface) => c.type === TipoConcorrenzaEnum.Richiesta && c.value === this.richiesta.id)[0];
                    if (!richiestaConcorrenza) {
                        const data = {
                            type: TipoConcorrenzaEnum.Richiesta,
                            value: this.richiesta.id
                        } as AddConcorrenzaDtoInterface;
                        this.store.dispatch(new AddConcorrenza([data]));
                    } else if (richiestaConcorrenza.idOperatore !== currentUser.id) {
                        this.store.dispatch(new TurnOffComposizione());
                    }
                }
            })
        );
    }

    getBoxPartenzaList(): void {
        this.subscription.add(
            this.boxPartenzaList$.subscribe((partenzaLista: any) => {
                this.boxPartenzaList = partenzaLista;
            })
        );
    }

    getTipologicheMezzi(): void {
        this.subscription.add(
            this.tipologicheMezzi$.subscribe((tipologiche: any) => {
                this.tipologicheMezzi = makeCopy(tipologiche);
                if (this.tipologicheMezzi) {
                    this.tipologicheMezzi.distaccamenti = this.tipologicheMezzi.distaccamenti.map((d: TipologicaComposizionePartenza) => {
                        d.descDistaccamento = d.descDistaccamento.replace('Distaccamento di ', '');
                        d.descDistaccamento = d.descDistaccamento.replace('Distaccamento ', '');
                        return d;
                    });
                    this.tipologicheMezzi.turni = [FiltroTurnoSquadre.Precedente, FiltroTurnoSquadre.Successivo];
                    this.store.dispatch(new GetFiltriComposizione());
                }
            })
        );
    }

    cardClasses(r: SintesiRichiesta): any {
        return this.methods.cardBorder(r);
    }

    onSendDirection(direction: DirectionInterface): void {
        this.store.dispatch(new SetDirection(direction));
    }

    onClearDirection(): void {
        this.store.dispatch(new ClearDirection());
    }

    centraMappa(): void {
        this.store.dispatch(new SetCoordCentroMappa(this.richiesta.localita.coordinate));
    }

    onClickIndirizzoRichiesta(event: SintesiRichiesta): void {
        const idRichiestaSelezionata = this.store.selectSnapshot(RichiestaSelezionataState.idRichiestaSelezionata);
        if (idRichiestaSelezionata === event.id) {
            this.store.dispatch(new ClearRichiestaSelezionata());
            setTimeout(() => {
                this.store.dispatch(new SetRichiestaSelezionata(event.id));
            }, 1);
        } else {
            this.store.dispatch(new SetRichiestaSelezionata(event.id));
        }
    }

    onActionMezzo(actionMezzo: MezzoActionInterface): void {
        this.store.dispatch(new ActionMezzo(actionMezzo));
    }

    onSganciamento(sganciamentoObj: SganciamentoInterface): void {
        this.store.dispatch(new SganciamentoMezzoComposizione(sganciamentoObj));
    }

    changeRicercaSquadre(ricerca: string): void {
        this.store.dispatch([
            new SetRicercaSquadreComposizione(ricerca),
            new GetListeComposizioneAvanzata(null, false, true)
        ]);
    }

    changeRicercaMezzi(ricerca: string): void {
        this.store.dispatch([
            new SetRicercaMezziComposizione(ricerca),
            new GetListeComposizioneAvanzata(null, true, false)
        ]);
    }
}
