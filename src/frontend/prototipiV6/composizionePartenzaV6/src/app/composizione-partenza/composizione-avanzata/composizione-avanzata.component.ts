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

    subscription = new Subscription();
    centroMappa: CentroMappa;
    @Input() dismissEvents: Observable<boolean>;
    @Output() centroMappaEmit: EventEmitter<CentroMappa> = new EventEmitter();


    constructor(private partenzaS: PartenzaService,
        private composizioneService: ComposizioneAvanzataService,
        private compPartenzaManager: CompPartenzaManagerService,
        popoverConfig: NgbPopoverConfig,
        tooltipConfig: NgbTooltipConfig) {
        // Popover options
        popoverConfig.container = 'body';
        popoverConfig.placement = 'top';
        // Tooltip options
        tooltipConfig.container = 'body';
        tooltipConfig.placement = 'top';

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
        // TEST
        console.log('[CompA] Mezzo selezionato', mezzo);
    }

    mezzoDeselezionato(mezzo: MezzoComposizione) {
        // TEST
        console.log('[CompA] Mezzo deselezionato', mezzo);
    }

    squadraSelezionata(squadra: SquadraComposizione) {
        // TEST
        console.log('[CompA] Squadra selezionata', squadra);
    }

    squadraDeselezionata(squadra: SquadraComposizione) {
        // TEST
        console.log('[CompA] Squadra deselezionata', squadra);
    }

    boxPartenzaSelezionato(partenza: BoxPartenza) {
        // TEST
        console.log('[CompA] BoxPartenza selezionato', partenza);
    }

    boxPartenzaDeselezionato(partenza: BoxPartenza) {
        // TEST
        console.log('[CompA] BoxPartenza deselezionato', partenza);
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
