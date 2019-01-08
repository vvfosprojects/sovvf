import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
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
export class ComposizioneAvanzataComponent implements OnInit, OnDestroy {
    @Input() richiesta: SintesiRichiesta;

    mezziComposizione: MezzoComposizione[];
    squadreComposizione: SquadraComposizione[];
    partenze: BoxPartenza[] = [];
    partenza: BoxPartenza;

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

        // Prendo le partenze da visualizzare nella lista
        this.subscription.add(
            this.composizioneService.getPartenze().subscribe((partenze: BoxPartenza[]) => {
                this.partenze = partenze;
                // TEST
                console.log('[CompA] Partenze ricevute dalla subscribe', partenze);
            })
        );
    }

    ngOnInit() {
        /* this.setInitCentroMappa();
        this.subscription.add(this.dismissEvents.subscribe(
            events => this.annullaPartenza(events)
        )); */
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    mezzoSelezionato(mezzo: MezzoComposizione) {
        // Se non esiste la partenza attuale la inizializzo
        this.initPartenzaVuota();

        // Imposto il mezzo per la partenza attuale
        this.setMezzo(mezzo);

        // TEST
        // console.log('[CompA] Mezzo selezionato', mezzo);
    }

    mezzoDeselezionato() {
        // Unsetto il mezzo per la partenza attuale
        this.unsetMezzo();

        // TEST
        // console.log('[CompA] Mezzo deselezionato', mezzo);
    }

    squadraSelezionata(squadra: SquadraComposizione) {
        // Se non esiste la partenza attuale la inizializzo
        this.initPartenzaVuota();

        // Setto la squadra per la partenza attuale
        this.setSquadra(squadra);

        // TEST
        // console.log('[CompA] Squadra selezionata', squadra);
    }

    squadraDeselezionata(squadra: SquadraComposizione) {
        // Unsetto la squadra per la partenza attuale
        this.unsetSquadra(squadra);

        // TEST
        // console.log('[CompA] Squadra deselezionata', squadra);
    }

    boxPartenzaSelezionato(partenza: BoxPartenza) {
        // TEST
        console.log('[CompA] BoxPartenza selezionato', partenza);
    }

    boxPartenzaDeselezionato(partenza: BoxPartenza) {
        // TEST
        console.log('[CompA] BoxPartenza deselezionato', partenza);
    }

    initPartenzaVuota() {
        if (!this.partenza) {
            this.partenza = { id: this.generateUniqueId(), squadraComposizione: [], mezzoComposizione: null, selezionato: true, hover: false };
        }
    }

    setMezzo(mezzo: MezzoComposizione) {
        this.partenza.mezzoComposizione = mezzo;

        // TEST
        console.log('[CompA] Mezzo settato, partenza', this.partenza);
    }

    unsetMezzo() {
        if (this.partenza) {
            this.partenza.mezzoComposizione = null;
        } else {
            console.error('[CompA] Non posso eliminare il mezzo se non esiste la partenza');
        }

        // TEST
        console.log('[CompA] Mezzo unsettato, partenza', this.partenza);
    }

    /* selezionaMezziComposizione() {
        this.mezziComposizione.forEach(mC => {
            mC.selezionato = true;
        });
    } */

    deselezionaMezziComposizione() {
        this.mezziComposizione.forEach(mC => {
            mC.selezionato = false;
        });
    }

    setSquadra(squadra: SquadraComposizione) {
        this.partenza.squadraComposizione.push(squadra);

        // TEST
        console.log('[CompA] Squadra settata, partenza', this.partenza);
    }

    unsetSquadra(squadra: SquadraComposizione) {
        if (this.partenza) {
            this.partenza.squadraComposizione.forEach((s: SquadraComposizione, index) => {
                s === squadra && this.partenza.squadraComposizione.splice(index, 1);
            });
        } else {
            console.error('[CompA] Non posso eliminare la squadda se non esiste la partenza');
        }
        // TEST
        console.log('[CompA] Squadra unsettata, partenza', this.partenza);
    }

    /* selezionaSquadreComposizione() {
        this.squadreComposizione.forEach(sC => {
            sC.selezionato = true;
        });
    } */

    deselezionaSquadreComposizione() {
        this.squadreComposizione.forEach(sC => {
            sC.selezionato = false;
        });
    }

    salvaPartenza() {
        this.composizioneService.nuovaPartenza(this.partenza);
        this.partenza = null;
    }

    nuovaPartenza() {
        if (this.validaBoxPartenza(this.partenza)) {
            this.deselezionaMezziComposizione();
            this.deselezionaSquadreComposizione();
            this.partenza.selezionato = false;
            this.salvaPartenza();
            this.initPartenzaVuota();
        } else {
            console.error('[CompA] BoxPartenza non valido');
        }
    }

    validaBoxPartenza(partenza: BoxPartenza) {
        if (partenza.mezzoComposizione || partenza.squadraComposizione.length > 0) {
            return true;
        }
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
