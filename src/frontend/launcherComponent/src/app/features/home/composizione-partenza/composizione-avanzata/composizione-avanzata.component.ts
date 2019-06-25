import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { NgbPopoverConfig, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';

// Interface
import { MezzoComposizione } from '../interface/mezzo-composizione-interface';
import { SquadraComposizione } from '../interface/squadra-composizione-interface';
import { DirectionInterface } from '../../maps/maps-interface/direction-interface';
import { SintesiRichiesta } from '../../../../shared/model/sintesi-richiesta.model';
import { Coordinate } from '../../../../shared/model/coordinate.model';
import { Composizione } from '../../../../shared/enum/composizione.enum';
import { ToastrType } from '../../../../shared/enum/toastr';

// Ngxs
import { Select, Store } from '@ngxs/store';
import { makeCopy } from '../../../../shared/helper/function';
import { ComposizionePartenzaState } from '../../store/states/composizione-partenza/composizione-partenza-state';
import { MezziComposizioneState } from '../../store/states/composizione-partenza/mezzi-composizione.state';
import { SquadreComposizioneState } from '../../store/states/composizione-partenza/squadre-composizione.state';
import {
    HoverInMezzoComposizione,
    HoverOutMezzoComposizione,
    RequestRemoveBookMezzoComposizione,
    SelectMezzoComposizione,
    UnselectMezzoComposizione
} from '../../store/actions/composizione-partenza/mezzi-composizione.actions';
import { BoxPartenzaState } from '../../store/states/composizione-partenza/box-partenza.state';
import { BoxPartenza } from '../interface/box-partenza-interface';
import {
    AddBoxPartenza,
    AddMezzoBoxPartenzaSelezionato,
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
import { ShowToastr } from '../../../../shared/store/actions/toastr/toastr.actions';
import { ConfirmPartenze, GetFiltriComposizione } from '../../store/actions/composizione-partenza/composizione-partenza.actions';
import { TurnoState } from '../../../navbar/store/states/turno/turno.state';

@Component({
    selector: 'app-composizione-avanzata',
    templateUrl: './composizione-avanzata.component.html',
    styleUrls: ['./composizione-avanzata.component.css']
})
export class ComposizioneAvanzataComponent implements OnInit, OnChanges, OnDestroy {

    @Input() richiesta: SintesiRichiesta;

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

    Composizione = Composizione;
    subscription = new Subscription();

    @Input() dismissEvents: Observable<boolean>;
    @Output() centraMappa = new EventEmitter();
    @Output() sendDirection: EventEmitter<DirectionInterface> = new EventEmitter();
    @Output() clearDirection: EventEmitter<any> = new EventEmitter();

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
                // console.log(this.mezziComposizione);
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
        // Aggiungo il primo box partenza vuoto
        this.store.dispatch(new AddBoxPartenza());
        this.store.dispatch(new GetFiltriComposizione());
        this.subscription.add(this.dismissEvents.subscribe(
            events => this.annullaPartenza(events)
        ));
    }

    ngOnChanges() {
    }

    ngOnDestroy(): void {
        this.store.dispatch(new ClearBoxPartenze());
        this.subscription.unsubscribe();
    }

    mezzoSelezionato(mezzoComposizione: MezzoComposizione) {
        if (this.boxPartenzaList.length <= 0) {
            this.store.dispatch(new AddBoxPartenza());
        }
        if (this.idMezziPrenotati.indexOf(mezzoComposizione.id) === -1 && this.idMezziInPrenotazione.indexOf(mezzoComposizione.id) === -1) {
            this.store.dispatch(new SelectMezzoComposizione(mezzoComposizione));
            // this.store.dispatch(new GetListeCoposizioneAvanzata());
            this.store.dispatch(new AddMezzoBoxPartenzaSelezionato(mezzoComposizione));
        } else if (this.idMezziPrenotati.indexOf(mezzoComposizione.id) !== -1) {
            this.store.dispatch(new ShowToastr(ToastrType.Warning, 'Impossibile assegnare il mezzo', 'Il mezzo è già presente in un\'altra partenza'));
        } else if (this.idMezziInPrenotazione.indexOf(mezzoComposizione.id) !== -1) {
            this.store.dispatch(new ShowToastr(ToastrType.Warning, 'Impossibile assegnare il mezzo', 'Il mezzo è in prenotazione da un altro utente'));
        }
        // console.log('Mezzo selezionato', mezzoComposizione);
    }

    mezzoDeselezionato(mezzoComposizione: MezzoComposizione) {
        this.store.dispatch(new UnselectMezzoComposizione(mezzoComposizione));
        this.store.dispatch(new RemoveMezzoBoxPartenzaSelezionato(mezzoComposizione));
        this.clearDirection.emit();
        // console.log('Mezzo deselezionato', mezzoComposizione);
    }

    mezzoHoverIn(mezzoComposizione: MezzoComposizione) {
        this.store.dispatch(new HoverInMezzoComposizione(mezzoComposizione.id));
    }

    mezzoHoverOut(mezzoComposizione: MezzoComposizione) {
        this.store.dispatch(new HoverOutMezzoComposizione(mezzoComposizione.id));
    }

    squadraSelezionata(squadraComposizione: SquadraComposizione) {
        if (this.boxPartenzaList.length <= 0) {
            this.store.dispatch(new AddBoxPartenza());
        }
        this.store.dispatch(new SelectSquadraComposizione(squadraComposizione));
        this.store.dispatch(new AddSquadraBoxPartenza(squadraComposizione));
        // console.log('Squadra selezionata', squadraComposizione);
    }

    squadraDeselezionata(squadraComposizione: SquadraComposizione) {
        this.store.dispatch(new UnselectSquadraComposizione(squadraComposizione));
        this.store.dispatch(new RemoveSquadraBoxPartenza(squadraComposizione.id));
        this.clearDirection.emit();
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

    getBoxPartenzaAttuale(idBoxPartenza: string): BoxPartenza {
        let returnBox: BoxPartenza;
        returnBox = null;
        this.boxPartenzaList.forEach((box: BoxPartenza) => {
            if (idBoxPartenza === box.id) {
                returnBox = box;
            }
        });
        return returnBox;
    }

    nuovaPartenza() {
        this.store.dispatch(new RequestAddBoxPartenza());
    }

    eliminaBoxPartenza(boxPartenza: BoxPartenza) {
        if (boxPartenza.mezzoComposizione && boxPartenza.mezzoComposizione.istanteScadenzaSelezione) {
            const mezzoComp = boxPartenza.mezzoComposizione;
            this.store.dispatch(new RequestRemoveBookMezzoComposizione(mezzoComp, boxPartenza));
        } else {
            this.store.dispatch(new RemoveBoxPartenza(boxPartenza));
        }
    }

    // Id Maker
    generateUniqueId(): string {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    // Interazione con Mappa
    mezzoCoordinate(event: Coordinate): void {
        if (event && this.richiesta.localita.coordinate) {
            const direction: DirectionInterface = {
                origin: {
                    lat: event.latitudine,
                    lng: event.longitudine
                },
                destination: {
                    lat: this.richiesta.localita.coordinate.latitudine,
                    lng: this.richiesta.localita.coordinate.longitudine
                },
                isVisible: true
            };

            this.sendDirection.emit(direction);
        } else {
            console.error('coordinate mezzo / coordinate richiesta non presenti');
            this.clearDirection.emit();
        }
    }

    confermaPartenze() {
        const partenze = this.boxPartenzaList;
        const partenzeMappedArray = partenze.map(obj => {
            const rObj = {};
            if (obj.mezzoComposizione) {
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
        const partenzeObj = {
            'partenze': partenzeMappedArray,
            'idRichiesta': this.store.selectSnapshot(ComposizionePartenzaState.richiestaComposizione).codice,
            'turno': this.store.selectSnapshot(TurnoState.turno).corrente
        };
        this.store.dispatch(new ConfirmPartenze(partenzeObj));
        // console.log('mappedArray', partenzeMappedArray);
    }

    annullaPartenza(event: boolean): void {
        if (event) {
            this.clearDirection.emit();
        }
    }
}
