import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { SintesiRichiesta } from '../../../shared/model/sintesi-richiesta.model';
import { Observable, Subscription } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { BoxClickState, BoxClickStateModel } from '../store/states/boxes/box-click.state';
import { AllFalseBoxRichieste, AllTrueBoxMezzi, ReducerBoxClick, UndoAllBoxes } from '../store/actions/boxes/box-click.actions';
import { BoxPartenza } from './interface/box-partenza-interface';
import { Composizione } from '../../../shared/enum/composizione.enum';
import { StatoRichiesta } from '../../../shared/enum/stato-richiesta.enum';
import { ComposizioneVeloceState } from '../store/states/composizione-partenza/composizione-veloce.state';
import { DirectionInterface } from '../maps/maps-interface/direction-interface';
import { ClearDirection, SetDirection } from '../store/actions/maps/maps-direction.actions';
import { wipeStatoRichiesta } from '../../../shared/helper/function';
import { SetCoordCentroMappa } from '../store/actions/maps/centro-mappa.actions';
import { ComposizionePartenzaState } from '../store/states/composizione-partenza/composizione-partenza.state';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HelperSintesiRichiesta } from '../richieste/helper/_helper-sintesi-richiesta';
import { AttivitaUtente } from '../../../shared/model/attivita-utente.model';
import { AddPresaInCarico, DeletePresaInCarico } from '../store/actions/richieste/richiesta-attivita-utente.actions';
import { MezzoActionInterface } from '../../../shared/interface/mezzo-action.interface';
import { ActionMezzo } from '../store/actions/richieste/richieste.actions';
import { SganciamentoInterface } from 'src/app/shared/interface/sganciamento.interface';
import { ClearMarkerMezzoSelezionato } from '../store/actions/maps/marker.actions';
import { ClearListaMezziComposizione, SganciamentoMezzoComposizione } from '../../../shared/store/actions/mezzi-composizione/mezzi-composizione.actions';
import { AuthState } from '../../auth/store/auth.state';
import { ClearListaSquadreComposizione } from '../../../shared/store/actions/squadre-composizione/squadre-composizione.actions';
import { ClearPreaccoppiati } from '../store/actions/composizione-partenza/composizione-veloce.actions';
import { FiltriComposizioneState } from '../../../shared/store/states/filtri-composizione/filtri-composizione.state';
import {
    ResetRicercaMezziComposizione,
    ResetRicercaSquadreComposizione,
    SetRicercaMezziComposizione,
    SetRicercaSquadreComposizione
} from '../../../shared/store/actions/ricerca-composizione/ricerca-composizione.actions';
import { GetListeComposizioneAvanzata } from '../store/actions/composizione-partenza/composizione-avanzata.actions';
import { ListaTipologicheMezzi } from './interface/filtri/lista-filtri-composizione-interface';
import { TriageSummaryState } from '../../../shared/store/states/triage-summary/triage-summary.state';
import { TriageSummary } from '../../../shared/interface/triage-summary.interface';
import { ClearTriageSummary } from '../../../shared/store/actions/triage-summary/triage-summary.actions';

@Component({
    selector: 'app-composizione-partenza',
    templateUrl: './composizione-partenza.component.html',
    styleUrls: ['./composizione-partenza.component.css']
})
export class ComposizionePartenzaComponent implements OnInit, OnDestroy {

    @Input() compPartenzaMode: Composizione;
    @Input() boxAttivi: boolean;
    @Input() nightMode: boolean;
    @Input() doubleMonitor: boolean;

    @Select(TriageSummaryState.summary) summary$: Observable<TriageSummary[]>;
    @Select(ComposizioneVeloceState.preAccoppiati) preAccoppiati$: Observable<BoxPartenza[]>;
    @Select(FiltriComposizioneState.filtri) filtri$: Observable<ListaTipologicheMezzi>;
    @Select(ComposizionePartenzaState.richiestaComposizione) richiestaComposizione$: Observable<SintesiRichiesta>;
    @Select(ComposizionePartenzaState.loadingInvioPartenza) loadingInvioPartenza$: Observable<boolean>;
    @Select(ComposizionePartenzaState.loadingListe) loadingListe$: Observable<boolean>;
    loadingListe: boolean;

    richiesta: SintesiRichiesta;
    prevStateBoxClick: BoxClickStateModel;
    methods = new HelperSintesiRichiesta();
    disablePrenota: boolean;
    prenotato: boolean;

    Composizione = Composizione;

    private subscription = new Subscription();

    constructor(private modalService: NgbModal, private store: Store) {
        this.subscription.add(
            this.richiestaComposizione$.subscribe((r: SintesiRichiesta) => {
                this.richiesta = r;
                this.disablePrenota = !(r && r.stato !== StatoRichiesta.Chiusa);
                this.prenotato = this._checkPrenotato(r);
            })
        );
        this.subscription.add(
            this.loadingListe$.subscribe((loading: boolean) => {
                this.loadingListe = loading;
            })
        );
    }

    ngOnInit(): void {
        console.log('Componente Composizione creato');
        this.prevStateBoxClick = this.store.selectSnapshot(BoxClickState);
        if (this.richiesta) {
            this.store.dispatch([
                new AllFalseBoxRichieste(),
                new AllTrueBoxMezzi(),
                new ReducerBoxClick('richieste', wipeStatoRichiesta(this.richiesta.stato))
            ]);
        }
    }

    ngOnDestroy(): void {
        this.store.dispatch([
            new UndoAllBoxes(this.prevStateBoxClick),
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

    cardClasses(r: SintesiRichiesta): any {
        return this.methods.cardBorder(r);
    }

    onSendDirection(direction: DirectionInterface): void {
        this.store.dispatch(new SetDirection(direction));
    }

    onClearDirection(): void {
        this.store.dispatch([new ClearDirection(), new ClearMarkerMezzoSelezionato()]);
    }

    centraMappa(): void {
        this.store.dispatch(new SetCoordCentroMappa(this.richiesta.localita.coordinate));
    }

    _checkPrenotato(sintesi: SintesiRichiesta): boolean {
        if (sintesi) {
            if (sintesi.listaUtentiPresaInCarico && sintesi.listaUtentiPresaInCarico.length > 0) {
                const currentUserId = this.store.selectSnapshot(AuthState.currentUser).id;
                return (sintesi.listaUtentiPresaInCarico.filter((attivita: AttivitaUtente) => attivita.idUtente === currentUserId).length > 0);
            } else {
                return false;
            }
        }
    }

    onPrenota($event): void {
        $event ? this.store.dispatch(new AddPresaInCarico(this.richiesta)) : this.store.dispatch(new DeletePresaInCarico(this.richiesta));
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
            new GetListeComposizioneAvanzata()
        ]);
    }

    changeRicercaMezzi(ricerca: string): void {
        this.store.dispatch([
            new SetRicercaMezziComposizione(ricerca),
            new GetListeComposizioneAvanzata()
        ]);
    }
}
