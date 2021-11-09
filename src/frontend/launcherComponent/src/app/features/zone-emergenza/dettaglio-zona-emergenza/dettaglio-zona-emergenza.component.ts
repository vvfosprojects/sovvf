import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ZonaEmergenza } from '../model/zona-emergenza.model';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import { Navigate } from '@ngxs/router-plugin';
import { RoutesPath } from '../../../shared/enum/routes-path.enum';
import { SetSediNavbarVisible } from '../../../shared/store/actions/sedi-treeview/sedi-treeview.actions';
import { Subscription } from 'rxjs';
import { SetCurrentUrl } from '../../../shared/store/actions/app/app.actions';
import { GetTipologieEmergenza } from '../store/actions/zone-emergenza/zone-emergenza.actions';
import { StopBigLoading } from '../../../shared/store/actions/loading/loading.actions';

@Component({
    selector: 'app-dettaglio-zona-emergenza',
    templateUrl: './dettaglio-zona-emergenza.component.html',
    styleUrls: ['./dettaglio-zona-emergenza.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DettaglioZonaEmergenzaComponent implements OnInit, OnDestroy {

    idZonaEmergenza: string;

    private subscriptions: Subscription = new Subscription();

    constructor(private route: ActivatedRoute,
                private store: Store) {
        this.idZonaEmergenza = this.route.snapshot.paramMap.get('id');

        if (!this.idZonaEmergenza) {
            this.store.dispatch(new Navigate(['/' + RoutesPath.ZoneEmergenza]));
        }
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

}
