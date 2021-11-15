import { Component, OnDestroy, OnInit } from '@angular/core';
import { ZonaEmergenza } from '../model/zona-emergenza.model';
import { ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Navigate } from '@ngxs/router-plugin';
import { RoutesPath } from '../../../shared/enum/routes-path.enum';
import { SetSediNavbarVisible } from '../../../shared/store/actions/sedi-treeview/sedi-treeview.actions';
import { Observable, Subscription } from 'rxjs';
import { GetZonaEmergenzaById } from '../store/actions/zone-emergenza/zone-emergenza.actions';
import { StopBigLoading } from '../../../shared/store/actions/loading/loading.actions';
import { ZoneEmergenzaState } from '../store/states/zone-emergenza/zone-emergenza.state';
import { ViewportState } from '../../../shared/store/states/viewport/viewport.state';

@Component({
    selector: 'app-dettaglio-zona-emergenza',
    templateUrl: './dettaglio-zona-emergenza.component.html',
    styleUrls: ['./dettaglio-zona-emergenza.component.css']
})
export class DettaglioZonaEmergenzaComponent implements OnInit, OnDestroy {

    @Select(ViewportState.doubleMonitor) doubleMonitor$: Observable<boolean>;
    doubleMonitor: boolean;
    @Select(ZoneEmergenzaState.zonaEmergenzaById) zonaEmergenzaById$: Observable<ZonaEmergenza>;
    zonaEmergenzaById: ZonaEmergenza;

    idZonaEmergenza: string;

    private subscriptions: Subscription = new Subscription();

    constructor(private route: ActivatedRoute,
                private store: Store) {
        this.getDoubleMonitorMode();
        this.getZonaEmergenzaById();

        this.idZonaEmergenza = this.route.snapshot.paramMap.get('id');
        if (!this.idZonaEmergenza) {
            this.store.dispatch(new Navigate(['/' + RoutesPath.ZoneEmergenza]));
        }
        this.store.dispatch(new GetZonaEmergenzaById(this.idZonaEmergenza));
    }

    ngOnInit(): void {
        this.store.dispatch([
            new SetSediNavbarVisible(false),
            new StopBigLoading()
        ]);
    }

    ngOnDestroy(): void {
        this.store.dispatch([
            new SetSediNavbarVisible()
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

    goToGestioneEmergenze(): void {
        this.store.dispatch(new Navigate(['/' + RoutesPath.ZoneEmergenza]));
    }
}
