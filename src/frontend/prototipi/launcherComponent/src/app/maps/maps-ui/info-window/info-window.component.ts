import {Component, Input, OnInit} from '@angular/core';
import {Meteo} from '../../../shared/model/meteo.model';
import {RichiestaMarker} from '../../maps-model/richiesta-marker.model';
import {SedeMarker} from '../../maps-model/sede-marker.model';
import {MezzoMarker} from '../../maps-model/mezzo-marker.model';
import {CambioSedeModalComponent} from './cambio-sede-modal/cambio-sede-modal.component';
import {NgbModal, NgbPopoverConfig, NgbTooltipConfig} from '@ng-bootstrap/ng-bootstrap';
import {ColoriStatoMezzo} from './_colori';

@Component({
    selector: 'app-info-window',
    templateUrl: './info-window.component.html',
    styleUrls: ['./info-window.component.css']
})
export class InfoWindowComponent implements OnInit {

    @Input() datiMeteo: Meteo;
    @Input() richiestaMarker: RichiestaMarker;
    @Input() sedeMarker: SedeMarker;
    @Input() mezzoMarker: MezzoMarker;
    @Input() tipoSedeIcona: string;
    stato = new ColoriStatoMezzo();

    constructor(private _modalService: NgbModal, popoverConfig: NgbPopoverConfig, tooltipConfig: NgbTooltipConfig) {
        popoverConfig.container = 'body';
        popoverConfig.placement = 'bottom';
        popoverConfig.autoClose = 'inside';
        tooltipConfig.container = 'body';
        tooltipConfig.placement = 'bottom';
    }

    openModal() {
        this._modalService.open(CambioSedeModalComponent);
    }

    ngOnInit() {
    }

    coloraIcona(nome): any {
        const colori = [
            {
                icon: 'fa fa-fire',
                color: 'text-danger'
            },
            {
                icon: 'fa fa-exclamation-triangle',
                color: 'text-warning'
            },
            {
                icon: 'fa fa-medkit',
                color: 'text-primary'
            }
        ];

        const colore = colori.find(x => x.icon === nome);
        if (nome === undefined || nome === '') {
            return 'fa fa-exclamation-triangle text-warning';
        } else if (colore !== undefined) {
            return nome + ' ' + colore.color;
        } else {
            return nome + ' guida';
        }
    }

    vettorePallini(richiesta) {
        return new Array(richiesta.priorita);
    }

    vettoreBuchini(richiesta) {
        const MAX_PRIORITA = 5;
        return new Array(MAX_PRIORITA - richiesta.priorita);
    }

    dettagliMezzo(stato, tipostato) {
        return this.stato.getColor(stato, tipostato);
    }

}
