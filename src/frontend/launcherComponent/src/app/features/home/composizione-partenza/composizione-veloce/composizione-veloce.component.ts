import { Component, Input, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';

// Model
import { BoxPartenza } from '../interface/box-partenza-interface';
import { SintesiRichiesta } from 'src/app/shared/model/sintesi-richiesta.model';

// Service
import { CentroMappa } from '../../maps/maps-model/centro-mappa.model';
import { Observable, Subscription } from 'rxjs';
import { Coordinate } from '../../../../shared/model/coordinate.model';
import { DirectionInterface } from '../../maps/maps-interface/direction-interface';
import { MarkerService } from '../../maps/service/marker-service/marker-service.service';
import { CenterService } from '../../maps/service/center-service/center-service.service';
import { MapsEvent } from '../../../../shared/enum/maps-event.enum';
import { Composizione } from '../../../../shared/enum/composizione.enum';

@Component({
    selector: 'app-composizione-veloce',
    templateUrl: './composizione-veloce.component.html',
    styleUrls: ['./composizione-veloce.component.css']
})
export class FasterComponent implements OnInit, OnDestroy {
    @Input() richiesta: SintesiRichiesta;
    @Input() preAccoppiati: BoxPartenza[];
    @Input() dismissEvents: Observable<boolean>;

    preAccoppiatiSelezionati: BoxPartenza[] = [];
    centroMappa: CentroMappa;
    isDeselezionato: boolean;

    Composizione = Composizione;

    subscription = new Subscription();

    @Output() centroMappaEmit: EventEmitter<CentroMappa> = new EventEmitter();
    @Output() sendDirection: EventEmitter<DirectionInterface> = new EventEmitter();
    @Output() clearDirection: EventEmitter<any> = new EventEmitter();


    constructor(private markerService: MarkerService,
        private centerService: CenterService) {
    }

    ngOnInit() {
        this.setInitCentroMappa();
        this.subscription.add(this.dismissEvents.subscribe(
            events => this.annullaPartenza(events)
        ));
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    preAccoppiatoSelezionato(preAcc: BoxPartenza) {
        this.selezionaPreaccoppiato(preAcc);
        if (preAcc.mezzoComposizione && preAcc.mezzoComposizione.coordinate) {
            this.mezzoCoordinate(preAcc.mezzoComposizione.coordinate);
        }
    }

    preAccoppiatoDeselezionato(preAcc: BoxPartenza) {
        this.deselezionaPreaccoppiato(preAcc);
        this.annullaPartenza(true);
        this.centraMappa(this.richiesta, MapsEvent.Centra);
    }

    selezionaPreaccoppiato(preAcc: BoxPartenza) {
        preAcc.selezionato = true;
        this.preAccoppiatiSelezionati.push(preAcc);
    }

    deselezionaPreaccoppiato(preAcc: BoxPartenza) {
        this.preAccoppiatiSelezionati.forEach((pA, index) => {
            if (preAcc === pA) {
                preAcc.selezionato = false;
                this.preAccoppiatiSelezionati.splice(index, 1);
            }
        });
    }

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
            this.centraMappa(null, '', this.centroMappa);

            this.clearDirection.emit();
        }
    }

    setInitCentroMappa(): void {
        const currentZoom = this.centerService.getCurrentZoom();
        this.centroMappa = new CentroMappa(this.richiesta.localita.coordinate, currentZoom);
        this.centroMappaEmit.emit(this.centroMappa);
        this.centraMappa(this.richiesta, MapsEvent.Centra);
    }

    centraMappa(richiesta: SintesiRichiesta, action: string, centroMappa?: CentroMappa): void {
        this.markerService.partenza(richiesta ? richiesta.id : null, action, centroMappa);
    }

    annullaPartenza(event: boolean): void {
        if (event) {
            this.clearDirection.emit();
        }
    }
}
