import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { NgbPopoverConfig, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';

// Interface
import { MezzoComposizione } from '../interface/mezzo-composizione-interface';
import { SquadraComposizione } from '../interface/squadra-composizione-interface';
import { DirectionInterface } from '../../maps/maps-interface/direction-interface';
import { SintesiRichiesta } from '../../../../shared/model/sintesi-richiesta.model';
import { Composizione } from '../../../../shared/enum/composizione.enum';

// Ngxs
import { Select, Store } from '@ngxs/store';
import { makeCopy } from '../../../../shared/helper/function';
import { ComposizionePartenzaState } from '../../store/states/composizione-partenza/composizione-partenza.state';
import { MezziComposizioneState } from '../../store/states/composizione-partenza/mezzi-composizione.state';
import { SquadreComposizioneState } from '../../store/states/composizione-partenza/squadre-composizione.state';
import {
    HoverInMezzoComposizione,
    HoverOutMezzoComposizione,
    RequestRemoveBookMezzoComposizione,
    UnselectMezzoComposizione,
    ReducerSelectMezzoComposizione
} from '../../store/actions/composizione-partenza/mezzi-composizione.actions';
import { BoxPartenzaState } from '../../store/states/composizione-partenza/box-partenza.state';
import { BoxPartenza } from '../interface/box-partenza-interface';
import {
    AddBoxPartenza,
    AddSquadraBoxPartenza, ClearBoxPartenze,
    RemoveBoxPartenza,
    RemoveMezzoBoxPartenzaSelezionato, RemoveSquadraBoxPartenza, RequestAddBoxPartenza, RequestSelectBoxPartenza,
} from '../../store/actions/composizione-partenza/box-partenza.actions';
import {
    HoverInSquadraComposizione,
    HoverOutSquadraComposizione,
    SelectSquadraComposizione,
    UnselectSquadraComposizione
} from '../../store/actions/composizione-partenza/squadre-composizione.actions';
import {
    ConfirmPartenze,
    GetFiltriComposizione
} from '../../store/actions/composizione-partenza/composizione-partenza.actions';
import { TurnoState } from '../../../navbar/store/states/turno/turno.state';
import { GetListeComposizioneAvanzata } from '../../store/actions/composizione-partenza/composizione-avanzata.actions';
import { SganciamentoInterface } from 'src/app/shared/interface/sganciamento.interface';
import { MezzoDirection } from '../../../../shared/interface/mezzo-direction';
import { squadraComposizioneBusy } from '../shared/functions/composizione-functions';
import { ConfermaPartenze } from '../interface/conferma-partenze-interface';

@Component({
    selector: 'app-composizione-avanzata',
    templateUrl: './composizione-avanzata.component.html',
    styleUrls: ['./composizione-avanzata.component.css']
})
export class ComposizioneAvanzataComponent implements OnInit, OnChanges, OnDestroy {

    @Input() richiesta: SintesiRichiesta;
    @Input() disablePrenota: boolean;
    @Input() prenotato: boolean;

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

    // Filtri Composizione
    @Select(ComposizionePartenzaState.filtriSelezionati) filtriSelezionati$: Observable<any>;
    filtriSelezionati: any;

    // BoxPartenza Composizione
    @Select(BoxPartenzaState.boxPartenzaList) boxPartenzaList$: Observable<BoxPartenza[]>;
    boxPartenzaList: BoxPartenza[];
    @Select(BoxPartenzaState.idBoxPartenzaSelezionato) idBoxPartenzaSelezionato$: Observable<string>;
    idBoxPartenzaSelezionato: string;

    @Select(BoxPartenzaState.disableConfirmPartenza) disableConfirmPartenza$: Observable<boolean>;
    @Select(BoxPartenzaState.disableNuovaPartenza) disableNuovaPartenza$: Observable<boolean>;

    Composizione = Composizione;
    subscription = new Subscription();

    @Output() centraMappa = new EventEmitter();
    @Output() sendDirection = new EventEmitter<DirectionInterface>();
    @Output() clearDirection = new EventEmitter();
    @Output() prenota = new EventEmitter<boolean>();
    @Output() sganciamento = new EventEmitter<SganciamentoInterface>();

    constructor(private popoverConfig: NgbPopoverConfig,
        private tooltipConfig: NgbTooltipConfig,
        private store: Store) {

        // Popover options
        this.popoverConfig.container = 'body';
        this.popoverConfig.placement = 'top';
        // Tooltip options
        this.tooltipConfig.container = 'body';
        this.tooltipConfig.placement = 'top';

        // Prendo i mezzi da visualizzare nella lista
        this.subscription.add(
            this.mezziComposizione$.subscribe((mezziComp: MezzoComposizione[]) => {
                this.mezziComposizione = mezziComp;
                console.log('mezziComposizione', this.mezziComposizione);
            })
        );
        // Prendo il mezzo selezionato
        this.subscription.add(
            this.idMezzoSelezionato$.subscribe((idMezzo: string) => {
                this.idMezzoSelezionato = idMezzo;
                // console.log(idMezzo);
            })
        );
        // Prendo i mezzi in prenotazione
        this.subscription.add(
            this.idMezziInPrenotazione$.subscribe((idMezzi: string[]) => {
                this.idMezziInPrenotazione = idMezzi;
                // console.log(idMezzi);
            })
        );
        // Prendo i mezzi prenotati
        this.subscription.add(
            this.idMezziPrenotati$.subscribe((idMezzi: string[]) => {
                this.idMezziPrenotati = idMezzi;
                // console.log(idMezzi);
            })
        );
        // Prendo il mezzo hover
        this.subscription.add(
            this.idMezzoHover$.subscribe((idMezzo: string) => {
                this.idMezzoHover = idMezzo;
                // console.log(idMezzo);
            })
        );
        // Prendo il mezzo bloccato
        this.subscription.add(
            this.idMezziBloccati$.subscribe((idMezzi: string[]) => {
                this.idMezziBloccati = idMezzi;
                // console.log(idMezzo);
            })
        );

        // Prendo le squadre da visualizzare nella lista
        this.subscription.add(
            this.squadraComposizione$.subscribe((squadreComp: SquadraComposizione[]) => {
                this.squadreComposizione = makeCopy(squadreComp);
                // console.log(this.squadreComposizione);
            })
        );
        // Prendo la squadra selezionata
        this.subscription.add(
            this.idSquadreSelezionate$.subscribe((idSquadre: string[]) => {
                this.idSquadreSelezionate = idSquadre;
                // console.log(idSquadre);
            })
        );
        // Prendo la squadra hover
        this.subscription.add(
            this.idSquadraHover$.subscribe((idSquadra: string) => {
                this.idSquadraHover = idSquadra;
                // console.log(idSquadra);
            })
        );

        // Prendo i filtri selezionati
        this.subscription.add(
            this.filtriSelezionati$.subscribe((filtriSelezionati: any) => {
                this.filtriSelezionati = makeCopy(filtriSelezionati);
                // console.log(this.filtriSelezionati);
            })
        );

        // Prendo i box partenza
        this.subscription.add(
            this.boxPartenzaList$.subscribe((boxPartenza: BoxPartenza[]) => {
                this.boxPartenzaList = boxPartenza;
                // console.log(boxPartenza);
            })
        );
        // Prendo il box partenza selezionato
        this.subscription.add(
            this.idBoxPartenzaSelezionato$.subscribe((idBoxPartenza: string) => {
                this.idBoxPartenzaSelezionato = idBoxPartenza;
                // console.log(idBoxPartenza);
            })
        );

    }

    ngOnInit() {
        this.store.dispatch(new GetFiltriComposizione());
    }

    ngOnChanges() {
    }

    ngOnDestroy(): void {
        this.store.dispatch(new ClearBoxPartenze());
        this.subscription.unsubscribe();
    }

    mezzoSelezionato(mezzoComposizione: MezzoComposizione) {
        this.store.dispatch([
            new ReducerSelectMezzoComposizione(mezzoComposizione),
        ]);
        // console.log('Mezzo selezionato', mezzoComposizione);
    }

    mezzoDeselezionato() {
        this.store.dispatch(new UnselectMezzoComposizione());
        const boxPartenzaSelezionato = this.boxPartenzaList.filter(x => x.id === this.idBoxPartenzaSelezionato)[0];
        // TODO: testare
        if (boxPartenzaSelezionato && (!boxPartenzaSelezionato.squadraComposizione || boxPartenzaSelezionato.squadraComposizione.length <= 0)) {
            this.store.dispatch(new GetListeComposizioneAvanzata(null, null, true));
        }
        this.store.dispatch([
            new RemoveMezzoBoxPartenzaSelezionato(),
        ]);
        this.onClearDirection();
        console.log('Mezzo deselezionato');
    }

    mezzoHoverIn(mezzoComposizione: MezzoComposizione) {
        this.store.dispatch([
            new HoverInMezzoComposizione(mezzoComposizione.id),
        ]);
    }

    mezzoHoverOut() {
        this.store.dispatch([
            new HoverOutMezzoComposizione(),
        ]);
    }

    squadraSelezionata(squadraComposizione: SquadraComposizione) {
        if (squadraComposizione && !squadraComposizioneBusy(squadraComposizione.squadra.stato)) {
            if (this.boxPartenzaList.length <= 0) {
                this.store.dispatch(new AddBoxPartenza());
            }
            this.store.dispatch(new SelectSquadraComposizione(squadraComposizione));
            const boxPartenzaSelezionato = this.boxPartenzaList.filter(x => x.id === this.idBoxPartenzaSelezionato)[0];
            // TODO: testare
            if (boxPartenzaSelezionato && !boxPartenzaSelezionato.mezzoComposizione) {
                this.store.dispatch(new GetListeComposizioneAvanzata(null, true, null));
            }
            this.store.dispatch(new AddSquadraBoxPartenza(squadraComposizione));
            // console.log('Squadra selezionata', squadraComposizione);
        }
    }

    squadraDeselezionata(squadraComposizione: SquadraComposizione) {
        this.store.dispatch(new UnselectSquadraComposizione(squadraComposizione));
        const boxPartenzaSelezionato = this.boxPartenzaList.filter(x => x.id === this.idBoxPartenzaSelezionato)[0];
        // TODO: testare
        if (boxPartenzaSelezionato && !boxPartenzaSelezionato.mezzoComposizione) {
            this.store.dispatch(new GetListeComposizioneAvanzata(null, true, null));
        }
        this.store.dispatch(new RemoveSquadraBoxPartenza(squadraComposizione.id));
        // console.log('Squadra deselezionata', squadraComposizione);
    }

    squadraHoverIn(squadraComposizione: SquadraComposizione) {
        this.store.dispatch(new HoverInSquadraComposizione(squadraComposizione.id));
    }

    squadraHoverOut(squadraComposizione: SquadraComposizione) {
        this.store.dispatch(new HoverOutSquadraComposizione(squadraComposizione.id));
    }

    checkSquadraSelezione(idSquadra: string) {
        let selected = false;
        this.idSquadreSelezionate.forEach((id: string) => {
            if (id === idSquadra) {
                selected = true;
            }
        });
        return selected;
    }

    boxPartenzaSelezionato(boxPartenza: BoxPartenza) {
        this.store.dispatch(new RequestSelectBoxPartenza(boxPartenza.id));
    }

    nuovaPartenza() {
        this.store.dispatch(new RequestAddBoxPartenza());
    }

    eliminaBoxPartenza(boxPartenza: BoxPartenza) {
        if (boxPartenza.mezzoComposizione && boxPartenza.mezzoComposizione.istanteScadenzaSelezione) {
            const mezzoComp = boxPartenza.mezzoComposizione;
            this.store.dispatch(new RequestRemoveBookMezzoComposizione(mezzoComp, boxPartenza));
        } else {
            this.store.dispatch(new RemoveBoxPartenza(boxPartenza, true));
        }
        this.onClearDirection();
    }

    // Interazione con Mappa
    mezzoCoordinate(obj: MezzoDirection): void {
        if (obj.coordinateMezzo && this.richiesta.localita.coordinate) {
            if (this.idMezziPrenotati.indexOf(obj.idMezzo) <= -1) {
                const direction: DirectionInterface = {
                    origin: {
                        lat: obj.coordinateMezzo.latitudine,
                        lng: obj.coordinateMezzo.longitudine
                    },
                    destination: {
                        lat: this.richiesta.localita.coordinate.latitudine,
                        lng: this.richiesta.localita.coordinate.longitudine
                    },
                    isVisible: true
                };

                this.sendDirection.emit(direction);
            }
        } else {
            this.onClearDirection();
            console.error('coordinate mezzo / coordinate richiesta non presenti');
        }
    }

    confermaPartenze() {
        const partenze = makeCopy(this.boxPartenzaList);
        const partenzeMappedArray = partenze.map(obj => {
            const rObj = {};
            if (obj.mezzoComposizione) {
                obj.mezzoComposizione.mezzo.stato = 'In Viaggio';
                rObj['mezzo'] = obj.mezzoComposizione.mezzo;
            } else {
                rObj['mezzo'] = null;
            }
            if (obj.squadraComposizione.length > 0) {
                rObj['squadre'] = obj.squadraComposizione.map((squadraComp: SquadraComposizione) => {
                    return squadraComp.squadra;
                });
            } else {
                rObj['squadre'] = [];
            }
            return rObj;
        });
        const partenzeObj: ConfermaPartenze = {
            partenze: partenzeMappedArray,
            idRichiesta: this.store.selectSnapshot(ComposizionePartenzaState.richiestaComposizione).codice,
            turno: this.store.selectSnapshot(TurnoState.turno).corrente
        };
        // console.log('mappedArray', partenzeMappedArray);
        this.store.dispatch(new ConfirmPartenze(partenzeObj));
    }

    onClearDirection(): void {
        this.clearDirection.emit();
        this.centraMappa.emit();
    }
}
