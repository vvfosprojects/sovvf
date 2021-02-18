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
import { SchedeContattoState } from '../store/states/schede-contatto/schede-contatto.state';
import { ClearFiltriSchedeContatto, ReducerSetFiltroSchedeContatto } from '../store/actions/schede-contatto/schede-contatto.actions';
import { MezziInServizioState } from '../store/states/mezzi-in-servizio/mezzi-in-servizio.state';
import { ClearFiltriMezziInServizio, SetFiltroMezziInServizio } from '../store/actions/mezzi-in-servizio/mezzi-in-servizio.actions';
import { PermissionFeatures } from '../../../shared/enum/permission-features.enum';
import { RichiesteState } from '../store/states/richieste/richieste.state';
import { RichiestaModificaState } from '../store/states/scheda-telefonata/richiesta-modifica.state';
import { SintesiRichiesta } from '../../../shared/model/sintesi-richiesta.model';

@Component({
    selector: 'app-filterbar',
    templateUrl: './filterbar.component.html',
    styleUrls: ['./filterbar.component.css']
})
export class FilterbarComponent {

    @Input() colorButton: ViewInterfaceButton;
    @Input() viewState: ViewLayouts;
    @Input() nightMode: boolean;
    @Input() doubleMonitor: boolean;

    // Filtri Richieste
    @Select(FiltriRichiesteState.filtriTipologie) filtriRichieste$: Observable<VoceFiltro[]>;
    @Select(FiltriRichiesteState.filtriRichiesteSelezionati) filtriRichiesteSelezionati$: Observable<VoceFiltro[]>;

    // Ricerca Richieste
    @Select(RicercaFilterbarState.ricerca) ricercaRichieste$: Observable<string>;

    // Loading Lista Richieste
    @Select(RichiesteState.loadingRichieste) loadingRichieste$: Observable<boolean>;

    // Filtri Schede Contatto
    @Select(SchedeContattoState.filtriSchedeContatto) filtriSchedeContatto$: Observable<VoceFiltro[]>;
    @Select(SchedeContattoState.filtriSelezionati) filtriSelezionatiSchedeContatto$: Observable<VoceFiltro[]>;

    // Loading Schede Contatto
    @Select(SchedeContattoState.loadingSchedeContatto) loadingSchedeContatto$: Observable<boolean>;

    // Loading Mezzi in Servizio
    @Select(MezziInServizioState.loadingMezziInServizio) loadingMezziInServizio$: Observable<boolean>;

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
    @Select(ViewComponentState.modificaRichiestaStatus) modificaRichiestaStatus$: Observable<boolean>;
    @Select(ViewComponentState.mezziInServizioStatus) mezziInServizioStatus$: Observable<boolean>;
    @Select(ViewComponentState.filterBarCol) filterBarCol$: Observable<Grid>;

    // Modifica Richiesta
    @Select(RichiestaModificaState.richiestaModifica) richiestaModifica$: Observable<SintesiRichiesta>;

    /**
     * aggiunti viewState per verificare se è attivo richieste o mappa
     * @param:: store
     */
    @Select(ViewComponentState.mapsIsActive) mapsStatus$: Observable<boolean>;
    @Select(ViewComponentState.richiesteStatus) richiesteStatus$: Observable<boolean>;

    permessiFeature = PermissionFeatures;

    constructor(private store: Store) {
    }

    /**
     * Filtri Richieste Events
     */
    onSelezioneFiltroRichieste(filtro: VoceFiltro): void {
        this.store.dispatch(new SetFiltroSelezionatoRichieste(filtro));
    }

    onDeselezioneFiltroRichieste(filtro: VoceFiltro): void {
        this.store.dispatch(new ClearFiltroSelezionatoRichieste(filtro));
    }

    eliminaFiltriAttiviRichieste(): void {
        this.store.dispatch(new ResetFiltriSelezionatiRichieste());
    }

    /**
     * Ricerca Richieste Events
     */
    onSearch(ricerca: string): void {
        this.store.dispatch(new SetRicercaFilterbar(ricerca));
    }

    getRicercaPlaceholder(): string {
        let placeholder = 'Cosa vuoi cercare?';
        const mezziInServizioActive = this.store.selectSnapshot(ViewComponentState.mezziInServizioStatus);
        if (mezziInServizioActive) {
            placeholder = 'Che targa vuoi cercare?';
        }
        return placeholder;
    }

    /**
     * Filtri Schede Contatto Events
     */
    onSelezioneFiltroSchedeContatto(filtro: VoceFiltro): void {
        this.store.dispatch(new ReducerSetFiltroSchedeContatto(filtro));
    }

    eliminaFiltriAttiviSchedeContatto(): void {
        this.store.dispatch(new ClearFiltriSchedeContatto());
    }

    /**
     * Filtri Schede Contatto Events
     */
    onSelezioneFiltroMezziInServizio(filtro: VoceFiltro): void {
        this.store.dispatch(new SetFiltroMezziInServizio(filtro));
    }

    eliminaFiltriAttiviMezziInServizio(): void {
        this.store.dispatch(new ClearFiltriMezziInServizio());
    }

    /**
     * Marker Meteo Switch Events
     */
    onMeteoSwitch(active: boolean): void {
        this.store.dispatch(new SetMarkerMeteoSwitch(active));
    }

    toggleChiamata(): void {
        this.store.dispatch(new ToggleChiamata());
    }

    switchView(event: AppFeatures): void {
        this.store.dispatch(new ChangeView(event));
    }

    onOptionsRichieste(event: OptionsRichieste): void {
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
