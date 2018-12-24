import { Component, OnInit, Input, OnChanges, Output, EventEmitter, OnDestroy } from '@angular/core';
import { NgbPopoverConfig, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';

// Service
import { PartenzaService } from '../service/partenza/partenza.service';
import { CompPartenzaManagerService } from '../../core/manager/comp-partenza-manager/comp-partenza-manager.service';
import { CompMezzoSquadraService } from '../service/comp-mezzo-squadra/comp-mezzo-squadra.service';
import { DirectionService } from '../../maps/service/direction-service/direction-service.service';
import { CenterService } from '../../maps/service/center-service/center-service.service';

// Model
import { BoxPartenza } from '../model/box-partenza.model';
import { Squadra } from '../../shared/model/squadra.model';
import { SintesiRichiesta } from '../../shared/model/sintesi-richiesta.model';
import { MezzoComposizione } from '../interface/composizione-partenza-interface';
import { Coordinate } from '../../shared/model/coordinate.model';
import { DirectionInterface } from '../../maps/service/direction-service/direction-interface';
import { CentroMappa } from '../../maps/maps-model/centro-mappa.model';
import { MarkerService } from '../../maps/service/marker-service/marker-service.service';
import { Observable, Subscription } from 'rxjs';

@Component({
    selector: 'app-slower',
    templateUrl: './slower.component.html',
    styleUrls: ['./slower.component.css']
})
export class SlowerComponent implements OnInit, OnDestroy {
    @Input() richiesta: SintesiRichiesta;

    mezziComposizione: MezzoComposizione[];
    squadre: Squadra[];
    partenze: BoxPartenza[];

    subscription = new Subscription();
    centroMappa: CentroMappa;
    @Input() dismissEvents: Observable<boolean>;
    @Output() centroMappaEmit: EventEmitter<CentroMappa> = new EventEmitter();


    constructor(private partenzaS: PartenzaService,
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
            this.compPartenzaManager.getSquadre().subscribe((squadre: Squadra[]) => {
                this.squadre = squadre;
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
