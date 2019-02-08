import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';

// View
import { ViewInterfaceButton, ViewInterfaceComposizione } from '../../../shared/interface/view.interface';

// Filtri Richieste
import { GetFiltriRichieste, SetFiltroSelezionato, ResetFiltriSelezionati } from './filtri-richieste/store/actions/filtri-richieste.actions';
import { FiltriRichiesteState } from './filtri-richieste/store/states/filtri-richieste.state';
import { VoceFiltro } from './filtri-richieste/voce-filtro.model';

// Marker Meteo Switch
import { MarkerMeteoState } from './marker-meteo-switch/store/states/marker-meteo-switch.state';
import { SetMarkerMeteo } from './marker-meteo-switch/store/actions/marker-meteo-switch.actions';

@Component({
    selector: 'app-filterbar',
    templateUrl: './filterbar.component.html',
    styleUrls: ['./filterbar.component.css']
})
export class FilterbarComponent implements OnInit {

    @Input() compPartenzaState: ViewInterfaceComposizione;
    @Input() colorButton: ViewInterfaceButton;
    @Output() buttonSwitchView = new EventEmitter<object>();
    @Output() buttonCompPartenzaMode = new EventEmitter<string>();

    // Filtri Richieste
    @Select(FiltriRichiesteState.filtriTipologie) filtri$: Observable<VoceFiltro[]>;
    @Select(FiltriRichiesteState.filtriSelezionati) filtriSelezionati$: Observable<VoceFiltro[]>;

    // Marker Meteo Switch
    @Select(MarkerMeteoState.active) stateSwitch$: Observable<boolean>;

    constructor(private store: Store) {
    }

    ngOnInit() {
        this.store.dispatch(new GetFiltriRichieste());
    }

    /**
     * Filtri Richieste Events
     */
    onSelezioneFiltro(filtro: VoceFiltro) {
        this.store.dispatch(new SetFiltroSelezionato(filtro));
    }
    onDeselezioneFiltro(filtro: VoceFiltro) {
        this.store.dispatch(new SetFiltroSelezionato(filtro));
    }
    eliminaFiltriAttivi() {
        this.store.dispatch(new ResetFiltriSelezionati());
    }

    /**
     * Marker Meteo Switch Events
     */
    onChange(active: boolean) {
        this.store.dispatch(new SetMarkerMeteo(active));
    }

    compPartenzaSwitch(event: string) {
        this.buttonCompPartenzaMode.emit(event);
    }

    chiamata(value: boolean) {
        this.buttonSwitchView.emit({ event: 'chiamata', chiamata: value });
    }

    buttonView(event: string) {
        let method = '';
        switch (event) {
            case 'normale':
                method = 'normale';
                break;
            case 'soloMappa':
                method = 'soloMappa';
                break;
            case 'soloRichieste':
                method = 'soloRichieste';
                break;
        }
        this.buttonSwitchView.emit({ event: method });
    }

}
