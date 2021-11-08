import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { RoutesPath } from 'src/app/shared/enum/routes-path.enum';
import { SetCurrentUrl } from 'src/app/shared/store/actions/app/app.actions';
import { SetSediNavbarVisible } from 'src/app/shared/store/actions/sedi-treeview/sedi-treeview.actions';
import { Observable, Subscription } from 'rxjs';
import { StopBigLoading } from '../../shared/store/actions/loading/loading.actions';
import { ImpostazioniState } from '../../shared/store/states/impostazioni/impostazioni.state';
import { ViewportState } from 'src/app/shared/store/states/viewport/viewport.state';

@Component({
    selector: 'app-dashboard-portale',
    templateUrl: './dashboard-portale.component.html',
    styleUrls: ['./dashboard-portale.component.css']
})
export class DashboardPortaleComponent implements OnInit, OnDestroy {

    @Select(ViewportState.doubleMonitor) doubleMonitor$: Observable<boolean>;
    doubleMonitor: boolean;
    @Select(ImpostazioniState.ModalitaNotte) nightMode$: Observable<boolean>;


    private subscriptions: Subscription = new Subscription();

    constructor(private store: Store) {
        this.getDoubleMonitorMode();
    }

    ngOnInit(): void {
        this.store.dispatch([
            new SetCurrentUrl(RoutesPath.DashboardPortale),
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
}
