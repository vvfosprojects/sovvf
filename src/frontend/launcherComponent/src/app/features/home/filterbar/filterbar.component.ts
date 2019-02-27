import { Component, Input, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
// View
import { ViewInterfaceButton } from '../../../shared/interface/view.interface';
// Filtri Richieste
import { GetFiltriRichieste, ResetFiltriSelezionati, SetFiltroSelezionato } from './store/actions/filtri-richieste.actions';
import { FiltriRichiesteState } from './store/states/filtri-richieste.state';
import { VoceFiltro } from './filtri-richieste/voce-filtro.model';
// Ricerca Richieste
import { RicercaRichiesteState } from './store/states/ricerca-richieste.state';
// Marker Meteo Switch
import { MarkerMeteoState } from './store/states/marker-meteo-switch.state';
import { SetMarkerMeteoSwitch } from './store/actions/marker-meteo-switch.actions';
import { SetRicerca } from './store/actions/ricerca-richieste.actions';
import { AppFeatures } from '../../../shared/enum/app-features.enum';
import { ChangeView, SwitchComposizione, ToggleChiamata } from '../store/actions/view.actions';
import { ViewComponentState } from '../store/states/view.state';
import { Composizione } from '../../../shared/enum/composizione.enum';
import { Grid } from '../../../shared/enum/layout.enum';

@Component({
    selector: 'app-filterbar',
    templateUrl: './filterbar.component.html',
    styleUrls: ['./filterbar.component.css']
})
export class FilterbarComponent implements OnInit {

    @Input() colorButton: ViewInterfaceButton;

    // Filtri Richieste
    @Select(FiltriRichiesteState.filtriTipologie) filtri$: Observable<VoceFiltro[]>;
    @Select(FiltriRichiesteState.filtriSelezionati) filtriSelezionati$: Observable<VoceFiltro[]>;

    // Ricerca Richieste
    @Select(RicercaRichiesteState.ricerca) ricerca$: Observable<any>;

    // Marker Meteo Switch
    @Select(MarkerMeteoState.active) stateSwitch$: Observable<boolean>;

    // View State
    @Select(ViewComponentState.composizioneMode) composizioneMode$: Observable<Composizione>;
    @Select(ViewComponentState.composizioneStatus) composizioneStatus$: Observable<boolean>;
    @Select(ViewComponentState.filterBarCol) filterBarCol$: Observable<Grid>;

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
        this.store.dispatch(new SetMarkerMeteoSwitch(active));
    }

    compPartenzaSwitch(event: Composizione) {
        this.store.dispatch(new SwitchComposizione(event));
    }

    toggleChiamata() {
        this.store.dispatch(new ToggleChiamata());
    }

    switchView(event: AppFeatures) {
        this.store.dispatch(new ChangeView(event));
    }

}
