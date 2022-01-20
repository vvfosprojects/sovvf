import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { EventoEmergenza, ZonaEmergenza } from '../../model/zona-emergenza.model';
import { ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Navigate } from '@ngxs/router-plugin';
import { RoutesPath } from '../../../../shared/enum/routes-path.enum';
import { SetSediNavbarVisible } from '../../../../shared/store/actions/sedi-treeview/sedi-treeview.actions';
import { Observable, Subscription } from 'rxjs';
import { GetTipologieEmergenza, GetZonaEmergenzaById } from '../../store/actions/zone-emergenza/zone-emergenza.actions';
import { StopBigLoading } from '../../../../shared/store/actions/loading/loading.actions';
import { ZoneEmergenzaState } from '../../store/states/zone-emergenza/zone-emergenza.state';
import { ViewportState } from '../../../../shared/store/states/viewport/viewport.state';
import { ResetForm } from '@ngxs/form-plugin';

@Component({
    selector: 'app-dettaglio-sedi-zona-emergenza',
    templateUrl: './dettaglio-sedi.component.html',
    styleUrls: ['./dettaglio-sedi.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class DettaglioSediComponent implements OnInit, OnDestroy {

    @Select(ViewportState.doubleMonitor) doubleMonitor$: Observable<boolean>;
    doubleMonitor: boolean;
    @Select(ZoneEmergenzaState.zonaEmergenzaById) zonaEmergenzaById$: Observable<ZonaEmergenza>;
    zonaEmergenzaById: ZonaEmergenza;

    idZonaEmergenza: string;

    private subscriptions: Subscription = new Subscription();

    constructor(private route: ActivatedRoute,
                private store: Store) {
        this.idZonaEmergenza = this.route.snapshot.paramMap.get('id');
        if (!this.idZonaEmergenza) {
            this.store.dispatch(new Navigate(['/' + RoutesPath.ZoneEmergenza]));
        }

        this.store.dispatch(new GetZonaEmergenzaById(this.idZonaEmergenza));

        this.getDoubleMonitorMode();
        this.getZonaEmergenzaById();
    }

    ngOnInit(): void {
        this.store.dispatch([
            new SetSediNavbarVisible(false),
            new GetTipologieEmergenza(),
            new StopBigLoading()
        ]);
    }

    ngOnDestroy(): void {
        this.store.dispatch([
            new SetSediNavbarVisible(),
            new ResetForm({ path: 'zoneEmergenza.craZonaEmergenzaForm' })
        ]);
        this.subscriptions.unsubscribe();
    }

    getDoubleMonitorMode(): void {
        this.subscriptions.add(
            this.doubleMonitor$.subscribe((doubleMonitor: boolean) => {
                this.doubleMonitor = doubleMonitor;
            })
        );
    }

    getZonaEmergenzaById(): void {
        this.subscriptions.add(
            this.zonaEmergenzaById$.subscribe((zonaEmergenza: ZonaEmergenza) => {
                if (zonaEmergenza) {
                    this.zonaEmergenzaById = zonaEmergenza;
                }
            })
        );
    }

    getEventiCreazioneCraZonaEmergenza(): EventoEmergenza[] {
        return this.zonaEmergenzaById?.listaEventi.filter((e: EventoEmergenza) => e.tipoEvento === 'CreazioneCra');
    }

    goToGestioneEmergenze(): void {
        this.store.dispatch(new Navigate(['/' + RoutesPath.ZoneEmergenza]));
    }
}
