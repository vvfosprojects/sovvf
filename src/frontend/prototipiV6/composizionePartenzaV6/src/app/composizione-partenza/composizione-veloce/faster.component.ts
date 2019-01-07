import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';

// Model
import { BoxPartenza } from '../interface/box-partenza-interface';
import { SintesiRichiesta } from 'src/app/shared/model/sintesi-richiesta.model';

// Service
import { CompPartenzaManagerService } from 'src/app/core/manager/comp-partenza-manager/comp-partenza-manager.service';
import { PreAccoppiatiService } from '../service/pre-accoppiati/pre-accoppiati.service';
import { PartenzaService } from '../service/partenza/partenza.service';
import { CentroMappa } from '../../maps/maps-model/centro-mappa.model';
import { Observable, Subscription } from 'rxjs';
import { Coordinate } from '../../shared/model/coordinate.model';
import { DirectionInterface } from '../../maps/service/direction-service/direction-interface';
import { ComposizioneAvanzataService } from '../service/composizione-avanzata/composizione-avanzata.service';
import { DirectionService } from '../../maps/service/direction-service/direction-service.service';
import { MarkerService } from '../../maps/service/marker-service/marker-service.service';
import { CenterService } from '../../maps/service/center-service/center-service.service';

@Component({
    selector: 'app-faster',
    templateUrl: './faster.component.html',
    styleUrls: ['./faster.component.css']
})
export class FasterComponent implements OnInit, OnDestroy {
    @Input() richiesta: SintesiRichiesta;

    preAccoppiati: BoxPartenza[];
    preAccoppiatiSelezionati: BoxPartenza[] = [];

    centroMappa: CentroMappa;
    subscription = new Subscription();
    isDeselezionato: boolean;
    @Input() dismissEvents: Observable<boolean>;
    @Output() centroMappaEmit: EventEmitter<CentroMappa> = new EventEmitter();

    constructor(private compPartenzaManager: CompPartenzaManagerService,
                private preAccoppiatiS: PreAccoppiatiService,
                private partenzaS: PartenzaService,
                private directionService: DirectionService,
                private markerService: MarkerService,
                private centerService: CenterService) {
        // Restituisce i PreAccoppiati
        this.compPartenzaManager.getPreAccoppiati().subscribe((preAccoppiati: BoxPartenza[]) => {
            this.preAccoppiati = preAccoppiati;
            console.log(preAccoppiati);
        });
        // Restituisce i PreAccoppiati selezionati
        this.preAccoppiatiS.getPreAccoppiatiSelezionati().subscribe((res: any) => {
            this.preAccoppiatiSelezionati = res;
        });
    }

    ngOnInit() {
        this.setInitCentroMappa();
        this.subscription.add(this.dismissEvents.subscribe(
            events => this.annullaPartenza(events)
        ));
        this.subscription.add(this.preAccoppiatiS.isDeselezionato().subscribe(
            status => {
                this.isDeselezionato = status;
            }
        ));
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    preAccoppiatoSelezionato(preAcc: BoxPartenza) {
        this.preAccoppiatiS.sendPreAccoppiatoSelezionato(preAcc);
        this.mezzoCoordinate(preAcc.mezzo.coordinate);
    }

    mezzoCoordinate(event: Coordinate): void {
        if (event && this.richiesta.localita.coordinate && !this.isDeselezionato) {
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
    }
}
