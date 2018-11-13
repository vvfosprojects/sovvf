import { Component, OnInit } from '@angular/core';
import { trigger, state, transition, style, animate } from '@angular/animations';
import { TipologieService } from '../../shared/tipologie/tipologie.service';
import { FilterbarService } from '../../filterbar/filterbar-service/filterbar-service.service';
import { ClipboardService } from 'ngx-clipboard';
import { Localita } from 'src/app/shared/model/localita.model';
import { Coordinate } from 'src/app/shared/model/coordinate.model';
import * as MapManager from '../../core/manager/maps-manager';
import { ChiamataMarker } from '../../maps/maps-model/chiamata-marker.model';
import { MarkerService } from '../../maps/service/marker-service/marker-service.service';
import { CenterService } from '../../maps/service/center-service/center-service.service';
import { CentroMappa } from '../../maps/maps-model/centro-mappa.model';

@Component({
    selector: 'app-scheda-telefonata',
    templateUrl: './scheda-telefonata.component.html',
    styleUrls: ['./scheda-telefonata.component.css'],
    animations: [
        trigger('hideShowAnimator', [
            state('true', style({opacity: 1})),
            state('false', style({opacity: 0})),
            transition('0 => 1', animate('.1s')),
            transition('1 => 0', animate('.1s'))
        ])
    ]
})
export class SchedaTelefonataComponent implements OnInit {
    coords: Localita;
    tipologie: any;
    hideShowAnimator = false;

    centroMappa: CentroMappa;

    constructor(private tipologieS: TipologieService,
                private viewService: FilterbarService,
                private _clipboardService: ClipboardService,
                private chiamataManager: MapManager.ChiamataMarkerManagerService,
                private markerService: MarkerService,
                private centerService: CenterService) {
    }

    ngOnInit() {
        this.tipologieS.getTipologie().subscribe(t => {
            this.tipologie = t;
            setTimeout(() => {
                this.hideShowAnimator = true;
            }, 1);
        });

        this.centroMappa = this.centerService.centroMappaIniziale;
        this.centerService.getCentro().subscribe(r => {
            if (this.coords) {
                const xyChiamata = [Math.floor(this.coords.coordinate.latitudine * 1000) / 1000, Math.floor(this.coords.coordinate.longitudine * 1000) / 1000];
                const xyCentro = [Math.floor(r.coordinate.latitudine * 1000) / 1000, Math.floor(r.coordinate.longitudine * 1000) / 1000];
                if (xyChiamata[0] !== xyCentro[0] && xyChiamata[1] !== xyCentro[1]) {
                    this.centroMappa = r;
                }
            }
        });
    }

    handleAddressChange(result) {
        this.coords = new Localita(new Coordinate(result.geometry.location.lat(), result.geometry.location.lng()));
        const chiamataCorrente = new ChiamataMarker('RM-004', this.coords);
        this.chiamataManager.chiamataMarker[0] = chiamataCorrente;
        this.markerService.chiamata(chiamataCorrente, 'centra');
    }

    copy(lat: number, lng: number) {
        const copiedText = lat.toString() + ', ' + lng.toString();
        this._clipboardService.copyFromContent(copiedText);
        // console.log(copiedText);
    }

    annullaChiamata() {
        this.hideShowAnimator = false;
        setTimeout(() => {
            this.viewService.sendView({
                richieste: true,
                mappa: true,
                split: true,
                chiamata: false,
            });
        }, 100);
        const chiamataVuota = new ChiamataMarker('RM-004', new Localita(new Coordinate(null, null)));
        this.chiamataManager.chiamataMarker[0] = chiamataVuota;
        this.markerService.chiamata(null, '', this.centroMappa);
    }
}
