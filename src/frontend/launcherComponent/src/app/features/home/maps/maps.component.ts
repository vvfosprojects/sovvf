import { Component, Input, isDevMode, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import * as MapManager from '../../../core/manager/maps-manager';
import { CentroMappa } from './maps-model/centro-mappa.model';
import { RichiestaMarker } from './maps-model/richiesta-marker.model';
import { SedeMarker } from './maps-model/sede-marker.model';
import { MezzoMarker } from './maps-model/mezzo-marker.model';
import { ChiamataMarker } from './maps-model/chiamata-marker.model';
import { ComposizioneMarker } from './maps-model/composizione-marker.model';
import { Observable, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ViewInterfaceMaps } from '../../../shared/interface/view.interface';
import { SintesiRichiesta } from '../../../shared/model/sintesi-richiesta.model';
import { wipeStatoRichiesta } from '../composizione-partenza/composizione-partenza.component';
import { Select } from '@ngxs/store';
import { SchedaTelefonataState } from '../chiamata/store/states/scheda-telefonata.state';

@Component({
    selector: 'app-maps',
    templateUrl: './maps.component.html',
    styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit, OnChanges, OnDestroy {

    centroMappa: CentroMappa;
    richiesteMarkers: RichiestaMarker[] = [];
    sediMarkers: SedeMarker[] = [];
    mezziMarkers: MezzoMarker[] = [];
    composizioneMarkers: ComposizioneMarker[] = [];
    chiamataMarkers: ChiamataMarker[] = [];
    subscription = new Subscription();
    @Input() viewStateMappa: ViewInterfaceMaps;
    @Input() richiestaPartenza: SintesiRichiesta;
    @Select(SchedaTelefonataState.inserisciMarkerChiamata) chiamataMarkers$: Observable<ChiamataMarker[]>;
    mapsFullyLoaded = false;

    constructor(private richiesteManager: MapManager.RichiesteMarkerManagerService,
                private sediManager: MapManager.SediMarkerManagerService,
                private mezziManager: MapManager.MezziMarkerManagerService,
                private centroManager: MapManager.CentroMappaManagerService,
                private toastr: ToastrService) {
        this.timeoutAlert('showToastr');
        /**
         *  mi iscrivo al map manager che mi ritorna il centro della mappa
         */
        this.subscription.add(this.centroManager.getCentro().subscribe((r: CentroMappa) => {
            this.centroMappa = r;
        }));
        /**
         *  mi iscrivo al map manager che mi ritorna tutti i marker di tipo richiestaMarker
         */
        this.subscription.add(this.richiesteManager.getRichiesteMarker().subscribe((r: RichiestaMarker[]) => {
            this.richiesteMarkers = r;
            /**
             *  inizializzo un contatore nel servizio per tenere traccia del numero di richieste
             */
            if (this.richiesteManager.count > 0) {
                this.richiesteManager.count = this.richiesteMarkers.length;
            }
        }));

        /**
         *  mi iscrivo al map manager che mi ritorna tutti i marker di tipo mezzoMarker
         */
        this.subscription.add(this.mezziManager.getMezziMarker().subscribe((r: MezzoMarker[]) => {
            this.mezziMarkers = r;
        }));

        /**
         *  mi iscrivo al map manager che mi ritorna tutti i marker di tipo richiestaMarker
         */
        this.subscription.add(this.sediManager.getSediMarker().subscribe((r: SedeMarker[]) => {
            this.sediMarkers = r;
        }));

        this.subscription.add(this.chiamataMarkers$.subscribe((r: ChiamataMarker[]) => this.chiamataMarkers = r));

    }

    static mapPartenzaMarker(richiesta: SintesiRichiesta): ComposizioneMarker {
        let composizione: ComposizioneMarker;
        // Todo: provvisorio in attesa che enum stato sia anche nel model del marker di mappa
        const statoProvvisorio = wipeStatoRichiesta(richiesta.stato);
        composizione = new ComposizioneMarker(
            richiesta.id, richiesta.localita, richiesta.tipologie, null,
            richiesta.priorita, statoProvvisorio, richiesta.rilevanza, false);
        return composizione;
    }

    ngOnInit() {
        isDevMode() && console.log('Componente Maps creato');
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.richiestaPartenza) {
            if (changes.richiestaPartenza.currentValue) {
                this.composizioneMarkers[0] = MapsComponent.mapPartenzaMarker(changes.richiestaPartenza.currentValue);
            }
        } else {
            this.composizioneMarkers = [];
        }
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        isDevMode() && console.log('Componente Maps distrutto');
    }

    timeoutAlert(value: string) {
        setTimeout(() => this[value](), 0);
    }

    showToastr() {
        this.toastr.info('Caricamento in corso...', 'Attendere', {
            disableTimeOut: true
        });
    }

    clearToastr() {
        this.toastr.clear();
    }

    mapIsLoaded(event) {
        if (event) {
            this.mapsFullyLoaded = true;
            if (this.richiesteMarkers.length > 0 && this.mapsFullyLoaded) {
                this.timeoutAlert('clearToastr');
            }
        }
    }

}
