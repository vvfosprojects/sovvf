import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
// View
import { ViewInterfaceButton, ViewInterfaceComposizione } from '../../../shared/interface/view.interface';
// Filtri Richieste
import { GetFiltriRichieste, ResetFiltriSelezionati, SetFiltroSelezionato } from './store/actions/filtri-richieste.actions';
import { FiltriRichiesteState } from './store/states/filtri-richieste.state';
import { VoceFiltro } from './filtri-richieste/voce-filtro.model';
// Ricerca Richieste
import { RicercaRichiesteState } from './store/states/ricerca-richieste.state';
// Marker Meteo Switch
import { MarkerMeteoState } from './store/states/marker-meteo-switch.state';
import { SetMarkerMeteo } from './store/actions/marker-meteo-switch.actions';
import { SetRicerca } from './store/actions/ricerca-richieste.actions';
import { AppFeatures } from '../../../shared/enum/app-features.enum';

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

    // Ricerca Richieste
    @Select(RicercaRichiesteState.ricerca) ricerca$: Observable<any>;

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
     * Ricerca Richieste Events
     */
    onSearch(ricerca: any) {
        this.store.dispatch(new SetRicerca(ricerca));
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
        this.buttonSwitchView.emit({ event: AppFeatures.Chiamata, chiamata: value });
    }

    buttonView(event: AppFeatures) {
        let method = '';
        switch (event) {
            case AppFeatures.Default:
                method = AppFeatures.Default;
                break;
            case AppFeatures.Mappa:
                method = AppFeatures.Mappa;
                break;
            case AppFeatures.Richieste:
                method = AppFeatures.Richieste;
                break;
        }
        this.buttonSwitchView.emit({ event: method });
    }

}
