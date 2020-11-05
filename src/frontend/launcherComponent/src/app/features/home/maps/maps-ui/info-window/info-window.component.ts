import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Meteo } from '../../../../../shared/model/meteo.model';
import { RichiestaMarker } from '../../maps-model/richiesta-marker.model';
import { SedeMarker } from '../../maps-model/sede-marker.model';
import { MezzoMarker } from '../../maps-model/mezzo-marker.model';
import { CambioSedeModalComponent } from './cambio-sede-modal/cambio-sede-modal.component';
import { NgbModal, NgbPopover, NgbPopoverConfig, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { ChiamataMarker } from '../../maps-model/chiamata-marker.model';
import { MeteoMarker } from '../../maps-model/meteo-marker.model';
import { HelperSintesiRichiesta } from '../../../richieste/helper/_helper-sintesi-richiesta';
import { SintesiRichiestaModalComponent } from './sintesi-richiesta-modal/sintesi-richiesta-modal.component';
import { Store } from '@ngxs/store';
import { mezzoComposizioneBusy } from '../../../../../shared/helper/composizione-functions';
import { SganciamentoMezzoComposizione } from '../../../../../shared/store/actions/mezzi-composizione/mezzi-composizione.actions';
import { SganciamentoInterface } from 'src/app/shared/interface/sganciamento.interface';
import { SetRichiestaById } from '../../../store/actions/richieste/richieste.actions';
import { SchedaContattoMarker } from '../../maps-model/scheda-contatto-marker.model';

@Component({
    selector: 'app-info-window',
    templateUrl: './info-window.component.html',
    styleUrls: ['./info-window.component.css']
})
export class InfoWindowComponent {

    @Input() disabilitaIndicatoriMezzo = false;
    @Input() datiMeteo: Meteo;
    @Input() compact = false;
    @Input() richiestaMarker: RichiestaMarker;
    @Input() sedeMarker: SedeMarker;
    @Input() chiamataMarker: ChiamataMarker;
    @Input() mezzoMarker: MezzoMarker;
    @Input() meteoMarker: MeteoMarker;
    @Input() schedaContattoMarker: SchedaContattoMarker;
    @Input() tipoSedeIcona: string;
    @Input() inComposizione: boolean;
    @Output() addMezzoComposizione = new EventEmitter<string>();

    clickedPopover: NgbPopover;
    methods = new HelperSintesiRichiesta();

    constructor(private store: Store,
                private modalService: NgbModal,
                popoverConfig: NgbPopoverConfig,
                tooltipConfig: NgbTooltipConfig) {
        popoverConfig.container = 'body';
        popoverConfig.placement = 'bottom';
        tooltipConfig.container = 'body';
        tooltipConfig.placement = 'bottom';
    }

    openModal(mode: string, idRichiesta?: string): void {
        switch (mode) {
            case 'cambioSede':
                this.modalService.open(CambioSedeModalComponent, { centered: true });
                break;
            case 'visualizzaRichiesta':
                this.store.dispatch(new SetRichiestaById(idRichiesta));
                this.modalService.open(SintesiRichiestaModalComponent, {
                    windowClass: 'xlModal',
                    backdropClass: 'light-blue-backdrop',
                    centered: true
                });
                break;
        }
    }

    apriPopover(popover: NgbPopover): void {
        if (this.clickedPopover) {
            this.clickedPopover.close();
        }
        popover.open();
        this.clickedPopover = popover;
    }

    onAddMezzoComposizione(mezzoMarker: MezzoMarker): void {
        console.log(mezzoMarker);
        if (!mezzoComposizioneBusy(mezzoMarker.mezzo.stato)) {
            this.addMezzoComposizione.emit(mezzoMarker.mezzo.codice);
        } else {
            const sganciamentoObj = {} as SganciamentoInterface;
            sganciamentoObj.idMezzoDaSganciare = mezzoMarker.mezzo.codice;
            sganciamentoObj.idRichiestaDaSganciare = mezzoMarker.mezzo.idRichiesta;
            this.store.dispatch(new SganciamentoMezzoComposizione(sganciamentoObj));
            // console.log('sganciamentoObj', sganciamentoObj);
        }
    }
}
