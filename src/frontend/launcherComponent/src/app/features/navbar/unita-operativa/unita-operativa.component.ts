import { Component, OnDestroy } from '@angular/core';
import { TreeItem, TreeviewItem } from 'ngx-treeview';
import { Observable, Subscription } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { SediTreeviewState } from '../store/states/sedi-treeview/sedi-treeview.state';
import { ClearSediNavbarSelezionate, PatchSediNavbarSelezionate, SetSediNavbarSelezionate } from '../store/actions/sedi-treeview/sedi-treeview.actions';
import { TreeviewEmitterInterface } from '../../../shared/components/treeview/treeview-emitter.interface';


@Component({
    selector: 'app-unita-operativa',
    templateUrl: './unita-operativa.component.html',
    styleUrls: ['./unita-operativa.component.css'],
})
export class UnitaOperativaComponent implements OnDestroy {

    subscription = new Subscription();

    @Select(SediTreeviewState.listeSediNavbar) listeSedi$: Observable<TreeItem>;
    items: TreeviewItem[];

    @Select(SediTreeviewState.sediNavbarTesto) sedeSelezionata$: Observable<string>;

    @Select(SediTreeviewState.sediNavbarTastoConferma) tastoConferma$: Observable<boolean>;
    tastoConferma: boolean;

    constructor(private store: Store) {

        this.subscription.add(
            this.listeSedi$.subscribe((listaSedi: TreeItem) => {
                this.items = [];
                this.items[0] = new TreeviewItem(listaSedi);
            })
        );

        this.subscription.add(this.tastoConferma$.subscribe(
            (tasto: boolean) => {
                this.tastoConferma = tasto;
            })
        );
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    onPatch($event: TreeviewEmitterInterface) {
        this.store.dispatch(new PatchSediNavbarSelezionate($event.idSelezionati, $event.ricorsivo));
    }

    onAnnulla() {
        this.store.dispatch(new ClearSediNavbarSelezionate());
    }

    onConferma() {
        this.store.dispatch(new SetSediNavbarSelezionate());
    }

}
