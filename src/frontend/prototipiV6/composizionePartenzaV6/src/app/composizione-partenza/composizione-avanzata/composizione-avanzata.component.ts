import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, OnChanges } from '@angular/core';
import { NgbPopoverConfig, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';

// Service
import { PartenzaService } from '../service/partenza/partenza.service';
import { CompPartenzaManagerService } from '../../core/manager/comp-partenza-manager/comp-partenza-manager.service';
import { ComposizioneAvanzataService } from '../service/composizione-avanzata/composizione-avanzata.service';
import { DirectionService } from '../../maps/service/direction-service/direction-service.service';
import { CenterService } from '../../maps/service/center-service/center-service.service';
import { MarkerService } from '../../maps/service/marker-service/marker-service.service';

// Interface
import { BoxPartenza } from '../interface/box-partenza-interface';
import { MezzoComposizione } from '../interface/mezzo-composizione-interface';
import { SquadraComposizione } from '../interface/squadra-composizione-interface';
import { DirectionInterface } from '../../maps/service/direction-service/direction-interface';

// Model
import { SintesiRichiesta } from '../../shared/model/sintesi-richiesta.model';
import { CentroMappa } from '../../maps/maps-model/centro-mappa.model';
import { Squadra } from '../../shared/model/squadra.model';
import { Coordinate } from '../../shared/model/coordinate.model';

@Component({
    selector: 'app-composizione-avanzata',
    templateUrl: './composizione-avanzata.component.html',
    styleUrls: ['./composizione-avanzata.component.css']
})
export class ComposizioneAvanzataComponent implements OnInit, OnChanges, OnDestroy {
    @Input() richiesta: SintesiRichiesta;

    mezziComposizione: MezzoComposizione[];
    squadreComposizione: SquadraComposizione[];
    partenze: BoxPartenza[] = [];
    idPartenzaCorrente: string;
    indexPartenzaCorrente: number;

    buttonConferma = false;

    subscription = new Subscription();
    centroMappa: CentroMappa;
    @Input() dismissEvents: Observable<boolean>;
    @Output() centroMappaEmit: EventEmitter<CentroMappa> = new EventEmitter();


    constructor(private composizioneService: ComposizioneAvanzataService,
        private compPartenzaManager: CompPartenzaManagerService,
        private popoverConfig: NgbPopoverConfig,
        private tooltipConfig: NgbTooltipConfig) {
        // Popover options
        this.popoverConfig.container = 'body';
        this.popoverConfig.placement = 'top';
        // Tooltip options
        this.tooltipConfig.container = 'body';
        this.tooltipConfig.placement = 'top';

        // Prendo i mezzi da visualizzare nella lista
        this.subscription.add(
            this.compPartenzaManager.getMezziComposizione().subscribe((mezziComp: MezzoComposizione[]) => {
                this.mezziComposizione = mezziComp;
            })
        );

        // Prendo le squadre da visualizzare nella lista
        this.subscription.add(
            this.compPartenzaManager.getSquadre().subscribe((squadreComp: SquadraComposizione[]) => {
                this.squadreComposizione = squadreComp;
            })
        );
    }

    ngOnInit() {
        /* this.setInitCentroMappa();
        this.subscription.add(this.dismissEvents.subscribe(
            events => this.annullaPartenza(events)
        )); */
    }

    ngOnChanges() {
        this.buttonConferma = this.validaBoxPartenze();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    setPartenzaAttuale(idPartenzaCorrente: string) {
        if (this.partenze.length > 0) {
            this.partenze.forEach((p, index) => {
                if (p.id === idPartenzaCorrente) {
                    this.indexPartenzaCorrente = index;
                }
            });
        }
    }

    mezzoSelezionato(mezzo: MezzoComposizione) {
        // Imposto il mezzo per la partenza attuale
        this.setMezzo(mezzo);
    }

    mezzoDeselezionato() {
        // Unsetto il mezzo per la partenza attuale
        this.unsetMezzo();
    }

    squadraSelezionata(squadra: SquadraComposizione) {
        // Setto la squadra per la partenza attuale
        this.setSquadra(squadra);
    }

    squadraDeselezionata(squadra: SquadraComposizione) {
        // Unsetto la squadra per la partenza attuale
        this.unsetSquadra(squadra);
    }

    boxPartenzaSelezionato(partenza: BoxPartenza) {
        this.selezionaBoxPartenza(partenza);
        this.idPartenzaCorrente = partenza.id;
        this.setPartenzaAttuale(this.idPartenzaCorrente);
        this.selezionaBoxPartenza(partenza);
    }

    initPartenzaVuota() {
        this.partenze.push({ id: this.generateUniqueId(), squadraComposizione: [], mezzoComposizione: null, selezionato: true, hover: false });
        const length = this.partenze.length;
        this.idPartenzaCorrente = this.partenze[length - 1].id;
        this.setPartenzaAttuale(this.idPartenzaCorrente);
        // TEST
        // console.log('Partenze', this.partenze);
        // console.log('Id Partenza Corrente:', this.idPartenzaCorrente);
        // console.log('Index Partenza Corrente:', this.indexPartenzaCorrente);
    }

    // MEZZO //
    setMezzo(mezzo: MezzoComposizione) {
        if (this.partenze[this.indexPartenzaCorrente]) {
            this.partenze[this.indexPartenzaCorrente].mezzoComposizione = mezzo;
        } else {
            this.initPartenzaVuota();
            this.setMezzo(mezzo);
        }
        // TEST
        // console.log('[CompA] Mezzo settato, partenza', this.partenze[this.indexPartenzaCorrente]);
    }

    unsetMezzo() {
        if (this.partenze[this.indexPartenzaCorrente]) {
            this.partenze[this.indexPartenzaCorrente].mezzoComposizione = null;
        } else {
            console.error('[CompA] Non posso eliminare il mezzo se non esiste la partenza');
        }
        // TEST
        // console.log('[CompA] Mezzo unsettato, partenza', this.partenze[this.indexPartenzaCorrente]);
    }

    selezionaMezzoPartenza(partenza: BoxPartenza) {
        this.deselezionaMezziComposizione();
        if (partenza.mezzoComposizione) {
            partenza.mezzoComposizione.selezionato = true;
        }
    }

    deselezionaMezziComposizione() {
        this.mezziComposizione.forEach(mC => {
            mC.selezionato = false;
        });
    }

    // SQUADRA //
    setSquadra(squadra: SquadraComposizione) {
        if (this.partenze[this.indexPartenzaCorrente]) {
            this.partenze[this.indexPartenzaCorrente].squadraComposizione.push(squadra);
        } else {
            this.initPartenzaVuota();
            this.setSquadra(squadra);
        }
        // TEST
        // console.log('[CompA] Squadra settata, partenza', this.partenze[this.indexPartenzaCorrente]);
    }

    unsetSquadra(squadra: SquadraComposizione) {
        if (this.partenze[this.indexPartenzaCorrente]) {
            this.partenze[this.indexPartenzaCorrente].squadraComposizione.forEach((s: SquadraComposizione, index) => {
                s === squadra && this.partenze[this.indexPartenzaCorrente].squadraComposizione.splice(index, 1);
            });
        } else {
            console.error('[CompA] Non posso eliminare la squadda se non esiste la partenza');
        }
        // TEST
        // console.log('[CompA] Squadra unsettata, partenza', this.partenze[this.indexPartenzaCorrente]);
    }

    selezionaSquadrePartenza(partenza: BoxPartenza) {
        this.deselezionaSquadreComposizione();
        partenza.squadraComposizione.forEach(s => {
            s.selezionato = true;
        });
    }

    deselezionaSquadreComposizione() {
        this.squadreComposizione.forEach(sC => {
            sC.selezionato = false;
        });
    }

    // BOX PARTENZA //
    selezionaBoxPartenza(partenza: BoxPartenza, noValidate?: boolean) {
        if (!noValidate) {
            if (this.validaBoxPartenza(this.partenze[this.indexPartenzaCorrente])) {
                this.deselezionaBoxPartenza(this.partenze[this.indexPartenzaCorrente]);
            } else {
                this.eliminaBoxPartenza(this.partenze[this.indexPartenzaCorrente]);
            }
        }
        if (this.partenze.length > 0) {
            partenza.selezionato = true;
            this.selezionaSquadrePartenza(this.partenze[this.indexPartenzaCorrente]);
            this.selezionaMezzoPartenza(this.partenze[this.indexPartenzaCorrente]);
        }
    }

    deselezionaBoxPartenza(partenza: BoxPartenza) {
        if (partenza) {
            partenza.selezionato = false;
        }
    }

    eliminaBoxPartenza(partenza: BoxPartenza) {
        if (this.partenze.length > 0) {
            this.partenze.forEach((p, index) => {
                if (partenza === p) {
                    this.partenze.splice(index, 1);
                }
            });
            this.deselezionaMezziComposizione();
            this.deselezionaSquadreComposizione();
            if (this.partenze[this.partenze.length - 1]) {
                this.setPartenzaAttuale(this.partenze[this.partenze.length - 1].id);
                this.selezionaBoxPartenza(this.partenze[this.partenze.length - 1], true);
            }
        }
    }

    nuovaPartenza(noValidate?: boolean) {
        if (!noValidate) {
            if (this.validaBoxPartenza(this.partenze[this.indexPartenzaCorrente])) {
                this.deselezionaMezziComposizione();
                this.deselezionaSquadreComposizione();
                this.deselezionaBoxPartenza(this.partenze[this.indexPartenzaCorrente]);
                this.initPartenzaVuota();
            } else {
                console.error('[CompA] BoxPartenza non valido');
            }
        } else {
            this.initPartenzaVuota();
        }
    }

    validaBoxPartenza(partenza: BoxPartenza) {
        if ((partenza.mezzoComposizione && partenza.squadraComposizione.length > 0) || (!partenza.mezzoComposizione && partenza.squadraComposizione.length > 0)) {
            return true;
        }
    }

    validaBoxPartenze(): boolean {
        let result = false;
        if (this.partenze.length > 0) {
            const partenzeLength = this.partenze.length;
            let partenzeValidate = 0;

            this.partenze.forEach(p => {
                if (this.validaBoxPartenza(p)) {
                    partenzeValidate += 1;

                    if (partenzeValidate === partenzeLength) {
                        result = true;
                    }
                }
            });
        }
        return result;
    }

    generateUniqueId(): string {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    /* mezzoCoordinate(event: Coordinate): void {
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
            this.directionService.sendDirection(direction);
        } else {
            console.error('coordinate mezzo / coordinate richiesta non presenti');
            this.directionService.clearDirection();
            this.centraMappa(null, '', this.centroMappa);
        }
    }

    setInitCentroMappa(): void {
        const currentZoom = this.centerService.getCurrentZoom();
        this.centroMappa = new CentroMappa(this.richiesta.localita.coordinate, currentZoom);
        this.centroMappaEmit.emit(this.centroMappa);
        this.centraMappa(this.richiesta, 'centra');
    }

    centraMappa(richiesta: SintesiRichiesta, action: string, centroMappa?: CentroMappa): void {
        this.markerService.partenza(richiesta ? richiesta.id : null, action, centroMappa);
    }

    annullaPartenza(event: boolean): void {
        if (event) {
            this.directionService.clearDirection();
        }
    } */
}
