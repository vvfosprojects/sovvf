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
import { map } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { SintesiRichiesta } from '../../../../../shared/model/sintesi-richiesta.model';
import { Store } from '@ngxs/store';
import { RichiesteState } from '../../../store/states/richieste/richieste.state';
import { mezzoComposizioneBusy } from '../../../composizione-partenza/shared/functions/composizione-functions';
import { SganciamentoMezzoComposizione } from '../../../store/actions/composizione-partenza/mezzi-composizione.actions';
import { SganciamentoInterface } from 'src/app/shared/interface/sganciamento.interface';

@Component({
    selector: 'app-info-window',
    templateUrl: './info-window.component.html',
    styleUrls: ['./info-window.component.css']
})
export class InfoWindowComponent implements OnInit {

    @Input() datiMeteo: Meteo;
    @Input() compact = false;
    @Input() richiestaMarker: RichiestaMarker;
    @Input() sedeMarker: SedeMarker;
    @Input() chiamataMarker: ChiamataMarker;
    @Input() mezzoMarker: MezzoMarker;
    @Input() meteoMarker: MeteoMarker;
    @Input() tipoSedeIcona: string;
    @Input() inComposizione: boolean;
    @Output() addMezzoComposizione = new EventEmitter<string>();

    clickedPopover: NgbPopover;
    methods = new HelperSintesiRichiesta;
    subscriptionRichiestaById: Subscription = new Subscription();

    constructor(private store: Store,
        private _modalService: NgbModal,
        popoverConfig: NgbPopoverConfig,
        tooltipConfig: NgbTooltipConfig) {
        popoverConfig.container = 'body';
        popoverConfig.placement = 'bottom';
        tooltipConfig.container = 'body';
        tooltipConfig.placement = 'bottom';
    }

    openModal(mode: string, id_richiesta?: string) {
        switch (mode) {
            case 'cambioSede':
                this._modalService.open(CambioSedeModalComponent);
                break;
            case 'visualizzaRichiesta':
                let richiesta: SintesiRichiesta = null;
                let richiestaById$: Observable<SintesiRichiesta>;
                richiestaById$ = this.store.select(RichiesteState.getRichiestaById).pipe(map(fn => fn(id_richiesta)));
                this.subscriptionRichiestaById.add(
                    richiestaById$.subscribe(r => {
                        richiesta = r;

                        if (richiesta) {
                            const modal = this._modalService.open(SintesiRichiestaModalComponent, {
                                windowClass: 'xlModal',
                                backdropClass: 'light-blue-backdrop',
                                centered: true
                            });
                            modal.componentInstance.richiesta = richiesta;
                            this.subscriptionRichiestaById.unsubscribe();
                        }
                    })
                );
                break;
        }
    }

    ngOnInit() {
    }

    apriPopover(popover: NgbPopover) {
        if (this.clickedPopover) {
            this.clickedPopover.close();
        }
        popover.open();
        this.clickedPopover = popover;
    }

    onAddMezzoComposizione(mezzoMarker: MezzoMarker) {
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
