import { Component, Input } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ViewInterfaceButton, ViewLayouts } from '../../../shared/interface/view.interface';
import { ClearFiltroSelezionatoRichieste, ResetFiltriSelezionatiRichieste, SetFiltroSelezionatoRichieste } from '../store/actions/filterbar/filtri-richieste.actions';
import { FiltriRichiesteState } from '../store/states/filterbar/filtri-richieste.state';
import { VoceFiltro } from './filtri-richieste/voce-filtro.model';
import { RicercaFilterbarState } from '../store/states/filterbar/ricerca-filterbar.state';
import { MarkerMeteoState } from '../store/states/filterbar/marker-meteo-switch.state';
import { SetMarkerMeteoSwitch } from '../store/actions/filterbar/marker-meteo-switch.actions';
import { SetRicercaFilterbar } from '../store/actions/filterbar/ricerca-richieste.actions';
import { AppFeatures } from '../../../shared/enum/app-features.enum';
import { ChangeView, ToggleChiamata, ToggleMezziInServizio } from '../store/actions/view/view.actions';
import { ViewComponentState } from '../store/states/view/view.state';
import { Composizione } from '../../../shared/enum/composizione.enum';
import { Grid } from '../../../shared/enum/layout.enum';
import { OptionsRichieste } from '../../../shared/enum/options-richieste';
import { ClearRichiesteEspanse } from '../store/actions/richieste/richieste-espanse.actions';
import { HomeState } from '../store/states/home.state';
import { SchedeContattoState } from '../store/states/schede-contatto/schede-contatto.state';
import { ClearFiltriSchedeContatto, ReducerSetFiltroSchedeContatto, SetFiltroKeySchedeContatto } from '../store/actions/schede-contatto/schede-contatto.actions';
import { MezziInServizioState } from '../store/states/mezzi-in-servizio/mezzi-in-servizio.state';
import { ClearFiltriMezziInServizio, SetFiltroMezziInServizio, SetRicercaMezziInServizio } from '../store/actions/mezzi-in-servizio/mezzi-in-servizio.actions';
import { PermissionFeatures } from '../../../shared/enum/permission-features.enum';
import { RichiesteState } from '../store/states/richieste/richieste.state';

@Component({
    selector: 'app-filterbar',
    templateUrl: './filterbar.component.html',
    styleUrls: ['./filterbar.component.css']
})
export class FilterbarComponent {

    @Input() colorButton: ViewInterfaceButton;
    @Input() viewState: ViewLayouts;

    permessiFeature = PermissionFeatures;

    // Filtri Richieste
    @Select(FiltriRichiesteState.filtriTipologie) filtriRichieste$: Observable<VoceFiltro[]>;
    @Select(FiltriRichiesteState.filtriRichiesteSelezionati) filtriRichiesteSelezionati$: Observable<VoceFiltro[]>;

    // Ricerca Richieste
    @Select(RicercaFilterbarState.ricerca) ricercaRichieste$: Observable<string>;

    // Loading LIsta Richieste
    @Select(RichiesteState.loadingRichieste) loadingRichieste$: Observable<boolean>;

    // Filtri Schede Contatto
    @Select(SchedeContattoState.filtriSchedeContatto) filtriSchedeContatto$: Observable<VoceFiltro[]>;
    @Select(SchedeContattoState.filtriSelezionati) filtriSelezionatiSchedeContatto$: Observable<VoceFiltro[]>;

    // Ricerca Schede Contatto
    @Select(SchedeContattoState.ricerca) ricercaSchedeContatto$: Observable<string>;

    // Filtri Mezzi in Servizio
    @Select(MezziInServizioState.filtriMezziInServizio) filtriMezziInServizio$: Observable<VoceFiltro[]>;
    @Select(MezziInServizioState.filtriSelezionati) filtriSelezionatiMezziInServizio$: Observable<VoceFiltro[]>;

    // Marker Meteo Switch
    @Select(MarkerMeteoState.active) stateSwitch$: Observable<boolean>;

    // View State
    @Select(ViewComponentState.composizioneMode) composizioneMode$: Observable<Composizione>;
    @Select(ViewComponentState.composizioneStatus) composizioneStatus$: Observable<boolean>;
    @Select(ViewComponentState.schedeContattoStatus) schedeContattoStatus$: Observable<boolean>;
    @Select(ViewComponentState.chiamataStatus) chiamataStatus$: Observable<boolean>;
    @Select(ViewComponentState.mezziInServizio) mezziInServizioStatus$: Observable<boolean>;
    @Select(ViewComponentState.filterBarCol) filterBarCol$: Observable<Grid>;

    /**
     * aggiunti viewState per verificare se è attivo richieste o mappa
     * @param store
     */
    @Select(ViewComponentState.mapsIsActive) mapsStatus$: Observable<boolean>;
    @Select(ViewComponentState.richiesteIsActive) richiesteStatus$: Observable<boolean>;
    @Select(HomeState.markerOnLoading) markerOnLoading$: Observable<boolean>;

    constructor(private store: Store) {
    }

    /**
     * Filtri Richieste Events
     */
    onSelezioneFiltroRichieste(filtro: VoceFiltro) {
        this.store.dispatch(new SetFiltroSelezionatoRichieste(filtro));
    }

    onDeselezioneFiltroRichieste(filtro: VoceFiltro) {
        this.store.dispatch(new ClearFiltroSelezionatoRichieste(filtro));
    }

    eliminaFiltriAttiviRichieste() {
        this.store.dispatch(new ResetFiltriSelezionatiRichieste());
    }

    /**
     * Ricerca Richieste Events
     */
    onSearch(ricerca: string) {
        this.store.dispatch(new SetRicercaFilterbar(ricerca));
    }

    getRicercaPlaceholder() {
        const placeholderDefault = 'Cosa vuoi cercare?';
        let placeholder = placeholderDefault;
        const mezziInServizioActive = this.store.selectSnapshot(ViewComponentState.mezziInServizio);
        if (mezziInServizioActive) {
            placeholder = 'Che targa vuoi cercare?';
        }
        return placeholder;
    }

    /**
     * Filtri Schede Contatto Events
     */
    onSelezioneFiltroSchedeContatto(filtro: VoceFiltro) {
        this.store.dispatch(new ReducerSetFiltroSchedeContatto(filtro));
    }

    eliminaFiltriAttiviSchedeContatto() {
        this.store.dispatch(new ClearFiltriSchedeContatto());
    }

    /**
     * Ricerca Schede Contatto Events
     */
    onSearchSchedeContatto(ricerca: any) {
        this.store.dispatch(new SetFiltroKeySchedeContatto(ricerca));
    }


    /**
     * Filtri Schede Contatto Events
     */
    onSelezioneFiltroMezziInServizio(filtro: VoceFiltro) {
        this.store.dispatch(new SetFiltroMezziInServizio(filtro));
    }

    eliminaFiltriAttiviMezziInServizio() {
        this.store.dispatch(new ClearFiltriMezziInServizio());
    }

    /**
     * Marker Meteo Switch Events
     */
    onMeteoSwitch(active: boolean) {
        this.store.dispatch(new SetMarkerMeteoSwitch(active));
    }

    toggleChiamata() {
        this.store.dispatch(new ToggleChiamata());
    }

    switchView(event: AppFeatures) {
        this.store.dispatch(new ChangeView(event));
    }

    onOptionsRichieste(event: OptionsRichieste) {
        switch (event) {
            case OptionsRichieste.Restringi:
                this.store.dispatch(new ClearRichiesteEspanse());
                break;
            case OptionsRichieste.MezziInServizio:
                this.store.dispatch(new ToggleMezziInServizio());
                break;
        }
    }
}
