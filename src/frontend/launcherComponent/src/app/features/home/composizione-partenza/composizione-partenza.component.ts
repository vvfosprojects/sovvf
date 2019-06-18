import { Component, Input, isDevMode, OnDestroy, OnInit } from '@angular/core';
import { SintesiRichiesta } from '../../../shared/model/sintesi-richiesta.model';
import { Observable, Subject, Subscription } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { BoxClickState, BoxClickStateModel } from '../store/states/boxes/box-click.state';
import { AllFalseBoxRichieste, AllTrueBoxMezzi, ReducerBoxClick, UndoAllBoxes } from '../store/actions/boxes/box-click.actions';
import { BoxPartenza } from './interface/box-partenza-interface';
import { Composizione } from '../../../shared/enum/composizione.enum';
import { StatoRichiesta } from '../../../shared/enum/stato-richiesta.enum';
import { PreAccoppiatiState } from '../store/states/composizione-partenza/pre-accoppiati.state';
import { DirectionInterface } from '../maps/maps-interface/direction-interface';
import { ClearDirection, SetDirection } from '../store/actions/maps/maps-direction.actions';
import { wipeStatoRichiesta } from '../../../shared/helper/function';
import { TurnOffComposizione } from '../store/actions/view/view.actions';
import { GetInitCentroMappa, SetCoordCentroMappa } from '../store/actions/maps/centro-mappa.actions';
import { ClearMarkerRichiestaSelezionato } from '../store/actions/maps/marker.actions';
import { ComposizionePartenzaState } from '../store/states/composizione-partenza/composizione-partenza-state';
import { ClearBoxPartenze } from '../store/actions/composizione-partenza/box-partenza.actions';
import { ClearSelectedMezziComposizione } from '../store/actions/composizione-partenza/mezzi-composizione.actions';
import { ClearEventiRichiesta, SetIdRichiestaEventi } from '../store/actions/eventi/eventi-richiesta.actions';
import { EventiRichiestaComponent } from '../eventi/eventi-richiesta.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-composizione-partenza',
    templateUrl: './composizione-partenza.component.html',
    styleUrls: ['./composizione-partenza.component.css']
})
export class ComposizionePartenzaComponent implements OnInit, OnDestroy {
    @Input() compPartenzaMode: Composizione;

    dismissPartenzaSubject: Subject<boolean> = new Subject<boolean>();
    Composizione = Composizione;

    subscription = new Subscription();

    @Select(ComposizionePartenzaState.filtri) filtri$: Observable<any>;

    @Select(PreAccoppiatiState.preAccoppiati) preAccoppiati$: Observable<BoxPartenza[]>;
    @Select(ComposizionePartenzaState.richiestaComposizione) nuovaPartenza$: Observable<SintesiRichiesta>;
    richiesta: SintesiRichiesta;

    preAccoppiati: BoxPartenza[];

    prevStateBoxClick: BoxClickStateModel;

    constructor(private modalService: NgbModal, private store: Store) {
        this.subscription.add(this.nuovaPartenza$.subscribe(r => this.richiesta = r));

        // Restituisce i PreAccoppiati
        // this.subscription.add(
        //     this.preAccoppiati$.subscribe((preAccoppiati: BoxPartenza[]) => {
        //         this.preAccoppiati = makeCopy(preAccoppiati);
        //         console.log(this.preAccoppiati);
        //     })
        // );
    }

    ngOnInit() {
        this.prevStateBoxClick = this.store.selectSnapshot(BoxClickState);
        if (this.richiesta) {
            this.store.dispatch(new AllFalseBoxRichieste());
            this.store.dispatch(new AllTrueBoxMezzi());
            this.store.dispatch(new ReducerBoxClick('richieste', wipeStatoRichiesta(this.richiesta.stato)));
            // this.store.dispatch(new GetFiltriComposizione());
        } else {
            this.dismissPartenza();
        }
        isDevMode() && console.log('Componente Composizione creato');
    }

    ngOnDestroy() {
        this.store.dispatch(new UndoAllBoxes(this.prevStateBoxClick));
        isDevMode() && console.log('Componente Composizione distrutto');
    }

    dismissPartenza(): void {
        this.dismissPartenzaSubject.next(true);
        this.store.dispatch(new ClearSelectedMezziComposizione());
        this.store.dispatch(new ClearBoxPartenze());
        this.store.dispatch(new ClearMarkerRichiestaSelezionato());
        this.store.dispatch(new GetInitCentroMappa());
        // this.centraMappa();
        this.turnOffComposizione();
    }

    cardClasses(r: SintesiRichiesta) {
        return {
            'status_chiamata': r.stato === StatoRichiesta.Chiamata,
            'status_presidiato': r.stato === StatoRichiesta.Presidiata,
            'status_assegnato': r.stato === StatoRichiesta.Assegnata,
            'status_sospeso': r.stato === StatoRichiesta.Sospesa,
            'status_chiuso': r.stato === StatoRichiesta.Chiusa,
        };
    }

    onSendDirection(direction: DirectionInterface) {
        this.store.dispatch(new SetDirection(direction));
    }

    onClearDirection() {
        this.store.dispatch(new ClearDirection());
    }

    turnOffComposizione() {
        this.store.dispatch(new TurnOffComposizione());
    }

    centraMappa() {
        this.store.dispatch(new SetCoordCentroMappa(this.richiesta.localita.coordinate));
    }

    onVisualizzaEventiRichiesta(idRichiesta: string) {
        this.store.dispatch(new SetIdRichiestaEventi(idRichiesta));
        const modal = this.modalService.open(EventiRichiestaComponent, { windowClass: 'xlModal', backdropClass: 'light-blue-backdrop', centered: true });
        modal.result.then(() => {
            },
            () => this.store.dispatch(new ClearEventiRichiesta()));
    }

}

