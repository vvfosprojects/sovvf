import { Component, Input, isDevMode, OnDestroy, OnInit } from '@angular/core';
import { SintesiRichiesta } from '../../../shared/model/sintesi-richiesta.model';
import { Observable, Subject, Subscription } from 'rxjs';
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
import { TurnOffComposizione } from '../store/actions/view/view.actions';
import { GetInitCentroMappa, SetCoordCentroMappa } from '../store/actions/maps/centro-mappa.actions';
import { ClearMarkerState } from '../store/actions/maps/marker.actions';
import { ComposizionePartenzaState } from '../store/states/composizione-partenza/composizione-partenza.state';
import { ClearBoxPartenze } from '../store/actions/composizione-partenza/box-partenza.actions';
import { ClearListaMezziComposizione, ClearSelectedMezziComposizione } from '../store/actions/composizione-partenza/mezzi-composizione.actions';
import { ClearEventiRichiesta, SetIdRichiestaEventi } from '../store/actions/eventi/eventi-richiesta.actions';
import { EventiRichiestaComponent } from '../eventi/eventi-richiesta.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClearPreaccoppiati } from '../store/actions/composizione-partenza/composizione-veloce.actions';
import { ClearListaSquadreComposizione, ClearSelectedSquadreComposizione } from '../store/actions/composizione-partenza/squadre-composizione.actions';
import { SetComposizioneMode, ConfirmPartenze } from '../store/actions/composizione-partenza/composizione-partenza.actions';
import { HelperSintesiRichiesta } from '../richieste/helper/_helper-sintesi-richiesta';
import { UtenteState } from '../../navbar/store/states/operatore/utente.state';
import { AttivitaUtente } from '../../../shared/model/attivita-utente.model';
import { AddPresaInCarico, DeletePresaInCarico } from '../store/actions/richieste/richiesta-attivita-utente.actions';
import { MezzoActionInterface } from '../../../shared/interface/mezzo-action.interface';
import { ActionMezzo } from '../store/actions/richieste/richieste.actions';
import { SganciamentoInterface } from 'src/app/shared/interface/sganciamento.interface';
import { SganciamentoMezzoModalComponent } from './shared/sganciamento-mezzo-modal/sganciamento-mezzo-modal.component';
import { RichiesteState } from '../store/states/richieste/richieste.state';
import { map } from 'rxjs/operators';
import { Partenza } from 'src/app/shared/model/partenza.model';
import { TurnoState } from '../../navbar/store/states/turno/turno.state';
import { ConfermaPartenze } from './interface/conferma-partenze-interface';

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

    @Select(ComposizioneVeloceState.preAccoppiati) preAccoppiati$: Observable<BoxPartenza[]>;
    @Select(ComposizionePartenzaState.richiestaComposizione) richiestaComposizione$: Observable<SintesiRichiesta>;
    richiesta: SintesiRichiesta;

    prevStateBoxClick: BoxClickStateModel;

    methods = new HelperSintesiRichiesta;

    disablePrenota: boolean;
    prenotato: boolean;

    constructor(private modalService: NgbModal, private store: Store) {
        this.subscription.add(
            this.richiestaComposizione$.subscribe((r: SintesiRichiesta) => {
                this.richiesta = r;
                this.disablePrenota = !(r && r.stato !== StatoRichiesta.Chiusa);
                this.prenotato = this._checkPrenotato(r);
            })
        );
    }

    ngOnInit() {
        this.prevStateBoxClick = this.store.selectSnapshot(BoxClickState);
        if (this.richiesta) {
            this.store.dispatch([
                new AllFalseBoxRichieste(),
                new AllTrueBoxMezzi(),
                new ReducerBoxClick('richieste', wipeStatoRichiesta(this.richiesta.stato))
            ]);
            // this.store.dispatch(new GetFiltriComposizione());
        }
        isDevMode() && console.log('Componente Composizione creato');
    }

    ngOnDestroy() {
        this.store.dispatch(new UndoAllBoxes(this.prevStateBoxClick));
        this.subscription.unsubscribe();
        isDevMode() && console.log('Componente Composizione distrutto');
    }

    dismissPartenza(): void {
        this.dismissPartenzaSubject.next(true);
        this.store.dispatch([
            new ClearMarkerState(),
            new GetInitCentroMappa()
        ]);
        // Pulisco le liste
        const compMode = this.store.selectSnapshot(ComposizionePartenzaState).composizioneMode;
        if (compMode === Composizione.Avanzata) {
            this.store.dispatch([
                new ClearSelectedMezziComposizione(),
                new ClearSelectedSquadreComposizione(),
                new ClearListaSquadreComposizione(),
                new ClearListaMezziComposizione(),
                new ClearBoxPartenze()
            ]);
        } else if (compMode === Composizione.Veloce) {
            this.store.dispatch(new ClearPreaccoppiati());
        }
        // Reimposto la composizioneMode su Avanzata
        this.store.dispatch(new SetComposizioneMode(Composizione.Avanzata));
        // console.log('Composizione Mode', compMode);
        this.centraMappa();
        this.turnOffComposizione();
    }

    cardClasses(r: SintesiRichiesta) {
        return this.methods.cardBorder(r);
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

    _checkPrenotato(sintesi: SintesiRichiesta): boolean {
        if (sintesi) {
            if (sintesi.listaUtentiPresaInCarico && sintesi.listaUtentiPresaInCarico.length > 0) {
                const currentUserId = this.store.selectSnapshot(UtenteState.utente).id;
                return !!(sintesi.listaUtentiPresaInCarico.filter((attivita: AttivitaUtente) => attivita.idUtente === currentUserId).length > 0);
            } else {
                return false;
            }
        }
    }

    onPrenota($event) {
        $event ? this.store.dispatch(new AddPresaInCarico(this.richiesta)) : this.store.dispatch(new DeletePresaInCarico(this.richiesta));
    }

    onActionMezzo(actionMezzo: MezzoActionInterface) {
        this.store.dispatch(new ActionMezzo(actionMezzo));
    }

    onSganciamento(sganciamentoObj: SganciamentoInterface) {
        let richiestaDa = {} as SintesiRichiesta;
        let partenzaDaSganciare = {} as Partenza;
        const richiestaById$ = this.store.select(RichiesteState.richiestaById).pipe(map(fn => fn(sganciamentoObj.idRichiestaDa)));
        this.subscription.add(
            richiestaById$.subscribe(r => {
                richiestaDa = r;
                // tslint:disable-next-line:max-line-length
                partenzaDaSganciare = richiestaDa.partenzeRichiesta && richiestaDa.partenzeRichiesta.length > 0 ? richiestaDa.partenzeRichiesta.filter(x => x.mezzo.codice === sganciamentoObj.idMezzo)[0] : null;
                // console.log('richiestaDa', richiestaDa);
            })
        );

        if (richiestaDa && partenzaDaSganciare) {
            const modalSganciamento = this.modalService.open(SganciamentoMezzoModalComponent, { windowClass: 'xlModal', backdropClass: 'light-blue-backdrop', centered: true });
            modalSganciamento.componentInstance.icona = { descrizione: 'truck', colore: 'secondary' };
            modalSganciamento.componentInstance.titolo = 'Sganciamento Mezzo';
            modalSganciamento.componentInstance.richiestaDa = richiestaDa;
            modalSganciamento.componentInstance.bottoni = [
                { type: 'ko', descrizione: 'Annulla', colore: 'danger' },
                { type: 'ok', descrizione: 'Sgancia', colore: 'success' },
            ];

            modalSganciamento.result.then(
                (val) => {
                    switch (val) {
                        case 'ok':
                            // TODO: ricavare la partenza tramite id del mezzo e idRichiesta del mezzo
                            const partenzaObj: ConfermaPartenze = {
                                partenze: [partenzaDaSganciare],
                                idRichiesta: this.store.selectSnapshot(ComposizionePartenzaState.richiestaComposizione).codice,
                                turno: this.store.selectSnapshot(TurnoState.turno).corrente,
                                idRichiestaDaSganciare: sganciamentoObj.idRichiestaDa,
                                idMezzoDaSganciare: sganciamentoObj.idMezzo
                            };
                            this.store.dispatch(new ConfirmPartenze(partenzaObj));
                            // console.log('Partenza sganciata', partenzaObj);
                            break;
                        case 'ko':
                            console.log('Azione annullata');
                            break;
                    }
                    console.log('Modal chiusa con val ->', val);
                },
                (err) => console.error('Modal chiusa senza bottoni. Err ->', err)
            );
            console.log('sganciamentoObj', sganciamentoObj);
        } else {
            console.error('[SganciamentoMezzo] Errore! richiestaDa / partenzaDaSganciare non presente');
        }

    }
}

