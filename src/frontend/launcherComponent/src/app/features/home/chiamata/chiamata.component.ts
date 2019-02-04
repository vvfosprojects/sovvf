import { Component, EventEmitter, isDevMode, OnDestroy, OnInit, Output } from '@angular/core';
import { MarkerService } from '../maps/service/marker-service/marker-service.service';
import { CenterService } from '../maps/service/center-service/center-service.service';
import { Subscription } from 'rxjs';
import { APP_TIPOLOGIE, TipologieInterface } from '../../../core/settings/tipologie';
import { ClipboardService } from 'ngx-clipboard';
import { CentroMappa } from '../maps/maps-model/centro-mappa.model';
import { SchedaTelefonataInterface } from './scheda-telefonata/scheda-telefonata.component';
import { FormChiamataModel } from './scheda-telefonata/model/form-scheda-telefonata.model';
import { ChiamataMarker } from '../maps/maps-model/chiamata-marker.model';
import { Coordinate } from '../../../shared/model/coordinate.model';


@Component({
    selector: 'app-chiamata',
    templateUrl: './chiamata.component.html',
    styleUrls: ['./chiamata.component.css']
})
export class ChiamataComponent implements OnInit, OnDestroy {

    @Output() annullaChiamata = new EventEmitter(); // questo diventa toggleChiamata
    @Output() chiamataMarker = new EventEmitter<ChiamataMarker>();

    subscription = new Subscription();
    tipologie: TipologieInterface[] = APP_TIPOLOGIE;
    centroMappa: CentroMappa;
    coordinate: Coordinate;
    /**
     * ID CHIAMATA FAKE
     */
    idChiamata = `RM-0${Math.floor(Math.random() * 5) + 23}`;

    constructor(private markerService: MarkerService,
                private centerService: CenterService,
                private _clipboardService: ClipboardService) {

        this.centroMappa = this.centerService.centroMappaIniziale;
        this.subscription.add(
            this.centerService.getCentro().subscribe(r => {
                if (this.coordinate) {
                    const xyChiamata = [Math.floor(this.coordinate.latitudine * 1000) / 1000, Math.floor(this.coordinate.longitudine * 1000) / 1000];
                    const xyCentro = [Math.floor(r.coordinate.latitudine * 1000) / 1000, Math.floor(r.coordinate.longitudine * 1000) / 1000];
                    if (xyChiamata[0] !== xyCentro[0] && xyChiamata[1] !== xyCentro[1]) {
                        this.centroMappa = r;
                    }
                }
            })
        );
    }

    ngOnInit(): void {
        isDevMode() && console.log('Componente Chiamata creato');
    }

    ngOnDestroy(): void {
        isDevMode() && console.log('Componente Chiamata distrutto');
    }

    getSchedaTelefonata($event: SchedaTelefonataInterface): void {
        switch ($event.azione) {
            case 'copiaIndirizzo':
                this.toClipboard($event.chiamata);
                break;
            case 'annullata':
                this.markerService.chiamata(null, '', this.centroMappa);
                this.annullaChiamata.emit({ event: 'chiamata', chiamata: false });
                break;
            case 'cerca':
                const marker = new ChiamataMarker(this.idChiamata, $event.chiamata.localita);
                this.coordinate = $event.chiamata.localita.coordinate;
                this.chiamataMarker.emit(marker);
                this.markerService.chiamata(marker, 'centra');
                break;
            case 'inserita':
                console.log(`Chiamata inserita: ${$event.chiamata}`);
                break;
            default:
                return;
        }
    }

    toClipboard(chiamata: FormChiamataModel) {
        const copiedText = chiamata.localita.coordinate.latitudine.toString() + ', ' + chiamata.localita.coordinate.longitudine.toString();
        this._clipboardService.copyFromContent(copiedText);
    }

}
