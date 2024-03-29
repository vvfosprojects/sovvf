import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CentroMappa } from './maps-model/centro-mappa.model';
import { ChiamataMarker } from './maps-model/chiamata-marker.model';
import { ComposizioneMarker } from './maps-model/composizione-marker.model';
import { Observable, Subscription } from 'rxjs';
import { ViewInterfaceMaps } from '../../shared/interface/view.interface';
import { Select, Store } from '@ngxs/store';
import { CentroMappaState } from './store/states/centro-mappa.state';
import { ChiamateMarkersState } from './store/states/chiamate-markers.state';
import { ComposizionePartenzaState } from '../home/store/states/composizione-partenza/composizione-partenza.state';
import { AreaMappa } from './maps-model/area-mappa-model';
import { MapsDirectionState } from './store/states/maps-direction.state';
import { DirectionInterface } from './maps-interface/direction.interface';
import { FiltriRichiesteState } from '../home/store/states/filterbar/filtri-richieste.state';
import { VoceFiltro } from '../home/filterbar/filtri-richieste/voce-filtro.model';
import { ViewComponentState } from '../home/store/states/view/view.state';
import { SetMapLoaded } from '../../shared/store/actions/app/app.actions';
import { RouterState } from '@ngxs/router-plugin';
import { RichiestaSelezionataState } from '../home/store/states/richieste/richiesta-selezionata.state';
import { RichiestaModificaState } from '../home/store/states/form-richiesta/richiesta-modifica.state';
import { SintesiRichiesta } from '../../shared/model/sintesi-richiesta.model';
import { RichiestaGestioneState } from '../home/store/states/richieste/richiesta-gestione.state';
import { MezziInServizioState } from '../home/store/states/mezzi-in-servizio/mezzi-in-servizio.state';
import { SchedeContattoState } from '../home/store/states/schede-contatto/schede-contatto.state';
import { DirectionTravelDataInterface } from './maps-interface/direction-travel-data.interface';
import SpatialReference from '@arcgis/core/geometry/SpatialReference';

@Component({
    selector: 'app-maps',
    templateUrl: './maps.component.html',
    styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit, OnDestroy {

    @Input() viewStateMappa: ViewInterfaceMaps;
    @Input() boxAttivi: boolean;
    @Input() tastoChiamataMappaActive: boolean;
    @Input() tastoZonaEmergenzaMappaActive: boolean;
    @Input() visualizzaPercorsiRichiesta: boolean;

    @Select(CentroMappaState.centroMappa) centroMappa$: Observable<CentroMappa>;
    centroMappa: CentroMappa;
    @Select(ChiamateMarkersState.chiamateMarkers) chiamataMarkers$: Observable<ChiamataMarker[]>;
    @Select(ComposizionePartenzaState.richiestaComposizioneMarker) composizioneMarkers$: Observable<ComposizioneMarker[]>;
    @Select(MapsDirectionState.direction) direction$: Observable<DirectionInterface>;
    @Select(MapsDirectionState.travelDataNuovaPartenza) travelDataNuovaPartenza$: Observable<DirectionTravelDataInterface>;

    // Richiesta Selezionata
    @Select(RichiestaSelezionataState.idRichiestaSelezionata) idRichiestaSelezionata$: Observable<string>;
    // Richiesta Modifica
    @Select(RichiestaModificaState.richiestaModifica) richiestaModifica$: Observable<SintesiRichiesta>;
    // Richiesta Gestione
    @Select(RichiestaGestioneState.richiestaGestione) richiestaGestione$: Observable<SintesiRichiesta>;
    // Richiesta Composizione
    @Select(ComposizionePartenzaState.richiestaComposizione) richiestaComposizione$: Observable<SintesiRichiesta>;
    // Richieste Status
    @Select(ViewComponentState.richiesteStatus) richiesteStatus$: Observable<boolean>;
    // Filtri Richieste Selezionati
    @Select(FiltriRichiesteState.filtriRichiesteSelezionati) filtriRichiesteSelezionati$: Observable<VoceFiltro[]>;
    // Status "Schede Contatto"
    @Select(ViewComponentState.schedeContattoStatus) schedeContattoStatus$: Observable<boolean>;
    // Scheda Contatto Selezionata
    @Select(SchedeContattoState.codiceSchedaContattoSelezionata) idSchedaContattoSelezionata$: Observable<string>;
    // Status "Composizione Partenza"
    @Select(ViewComponentState.composizioneStatus) composizioneStatus$: Observable<boolean>;
    // Status "Mezzi in Servizio"
    @Select(ViewComponentState.mezziInServizioStatus) mezziInServizioStatus$: Observable<boolean>;
    // Mezzo In Servizio Selezionato
    @Select(MezziInServizioState.idMezzoInServizioSelezionato) idMezzoInServizioSelezionato$: Observable<string>;

    mapsFullyLoaded = false;
    activeRoute: string;

    private subscription: Subscription = new Subscription();

    constructor(private store: Store) {
        this.getCentroMappa();
    }

    ngOnInit(): void {
        this.activeRoute = this.store.selectSnapshot(RouterState.url);
        console.log('Componente Maps creato');
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
        console.log('Componente Maps distrutto');
    }

    getCentroMappa(): void {
        this.subscription.add(
            this.centroMappa$.subscribe((r: CentroMappa) => {
                this.centroMappa = r;
            })
        );
    }

    mapIsLoaded(areaMappa: AreaMappa, spatialReference?: SpatialReference): void {
        if (areaMappa) {
            this.mapsFullyLoaded = true;
            if (this.mapsFullyLoaded) {
                setTimeout(() => {
                    this.store.dispatch(new SetMapLoaded(true, { spatialReference }));
                }, 2000);
            }
        }
    }
}
