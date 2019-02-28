import { Component, EventEmitter, Input, isDevMode, OnDestroy, OnInit, Output } from '@angular/core';
import { SintesiRichiesta } from '../../../shared/model/sintesi-richiesta.model';
import { CenterService } from '../maps/service/center-service/center-service.service';
import { CentroMappa } from '../maps/maps-model/centro-mappa.model';
import { Subject, Subscription, Observable } from 'rxjs';
import { MarkerService } from '../maps/service/marker-service/marker-service.service';
import { Store, Select } from '@ngxs/store';
import { AllFalseBoxRichieste, AllTrueBoxMezzi, BoxClickState, BoxClickStateModel, ReducerBoxClick, UndoAllBoxes } from '../boxes/store';
import { MezzoComposizione } from './interface/mezzo-composizione-interface';
import { SquadraComposizione } from './interface/squadra-composizione-interface';
import { BoxPartenza } from './interface/box-partenza-interface';
import { Composizione } from '../../../shared/enum/composizione.enum';
import { StatoRichiesta } from '../../../shared/enum/stato-richiesta.enum';
import { GetMezziComposizione } from './store/actions/mezzi-composizione.actions';
import { GetSquadreComposizione } from './store/actions/squadre-composizione.actions';
import { MezziComposizioneState, SquadreComposizioneState } from './store';
import { PreAccoppiatiState } from './store/states/pre-accoppiati.state';
import { GetPreAccoppiati } from './store/actions/pre-accoppiati.actions';
import { DirectionInterface } from '../maps/maps-interface/direction-interface';
import { SetDirection, ClearDirection } from '../maps/store/actions/maps-direction.actions';
import { makeCopy, wipeStatoRichiesta } from '../../../shared/helper/function';
import { TurnOffComposizione } from '../store/actions/view.actions';

@Component({
    selector: 'app-composizione-partenza',
    templateUrl: './composizione-partenza.component.html',
    styleUrls: ['./composizione-partenza.component.css']
})
export class ComposizionePartenzaComponent implements OnInit, OnDestroy {
    @Input() richiesta: SintesiRichiesta;
    @Input() compPartenzaMode: string;

    dismissPartenzaSubject: Subject<boolean> = new Subject<boolean>();
    Composizione = Composizione;

    subscription = new Subscription();

    @Select(MezziComposizioneState.mezziComposizione) mezziComposizione$: Observable<MezzoComposizione[]>;
    mezziComposizione: MezzoComposizione[];

    @Select(SquadreComposizioneState.squadreComposizione) squadraComposizione$: Observable<SquadraComposizione[]>;
    squadreComposizione: SquadraComposizione[];

    @Select(PreAccoppiatiState.preAccoppiati) preAccoppiati$: Observable<BoxPartenza[]>;
    preAccoppiati: BoxPartenza[];

    centroMappa: CentroMappa;

    prevStateBoxClick: BoxClickStateModel;

    constructor(private store: Store,
                private centerService: CenterService,
                private markerS: MarkerService) {

        // Prendo i mezzi da visualizzare nella lista
        this.subscription.add(
            this.mezziComposizione$.subscribe((mezziComp: MezzoComposizione[]) => {
                this.mezziComposizione = makeCopy(mezziComp);
            })
        );

        // Prendo le squadre da visualizzare nella lista
        this.subscription.add(
            this.squadraComposizione$.subscribe((squadreComp: SquadraComposizione[]) => {
                this.squadreComposizione = makeCopy(squadreComp);
            })
        );

        // Restituisce i PreAccoppiati
        this.subscription.add(
            this.preAccoppiati$.subscribe((preAccoppiati: BoxPartenza[]) => {
                this.preAccoppiati = makeCopy(preAccoppiati);
            })
        );
    }

    ngOnInit() {
        this.prevStateBoxClick = this.store.selectSnapshot(BoxClickState); // Todo: da spostare dentro ViewState
        this.centroMappa = this.centerService.centroMappaIniziale;
        if (this.richiesta) {
            this.store.dispatch(new GetMezziComposizione());
            this.store.dispatch(new GetSquadreComposizione());
            this.store.dispatch(new GetPreAccoppiati());
            this.store.dispatch(new AllFalseBoxRichieste());
            this.store.dispatch(new AllTrueBoxMezzi());
            this.store.dispatch(new ReducerBoxClick('richieste', wipeStatoRichiesta(this.richiesta.stato)));
        } else {
            this.dismissPartenza();
        }
        isDevMode() && console.log('Componente Composizione creato');
    }

    ngOnDestroy() {
        this.store.dispatch(new UndoAllBoxes(this.prevStateBoxClick)); // Todo: da spostare dentro ViewState
        isDevMode() && console.log('Componente Composizione distrutto');
    }

    dismissPartenza(): void {
        this.centerService.sendCentro(this.centroMappa);
        this.dismissPartenzaSubject.next(true);
        this.markerS.noAction();
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

    getCentroMappa(event: CentroMappa): void {
        this.centroMappa = event;
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

}

