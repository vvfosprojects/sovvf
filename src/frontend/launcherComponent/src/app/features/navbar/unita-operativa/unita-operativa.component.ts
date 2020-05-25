import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TreeItem, TreeviewItem } from 'ngx-treeview';
import { Observable, Subscription } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { SediTreeviewState } from '../../../shared/store/states/sedi-treeview/sedi-treeview.state';
import {
    ClearSediNavbarSelezionate,
    PatchSediNavbarSelezionate,
    SetSediNavbarSelezionate
} from '../../../shared/store/actions/sedi-treeview/sedi-treeview.actions';
import { TreeviewEmitterInterface } from '../../../shared/interface/treeview.interface';
import { delay } from 'rxjs/operators';


@Component({
    selector: 'app-unita-operativa',
    templateUrl: './unita-operativa.component.html',
    styleUrls: [ './unita-operativa.component.css' ],
})
export class UnitaOperativaComponent implements OnDestroy, OnInit {

    subscription = new Subscription();

    @Input() colorButton: string;

    @Select(SediTreeviewState.listeSediNavbar) listeSedi$: Observable<TreeItem>;
    items: TreeviewItem[];

    @Select(SediTreeviewState.sediNavbarTesto) testoSedeSelezionata$: Observable<string>;

    @Select(SediTreeviewState.sediNavbarTastoConferma) tastoConferma$: Observable<boolean>;
    @Select(SediTreeviewState.sediNavbarVisible) sediNavbarVisible$: Observable<boolean>;
    sediNavbarVisible: boolean;

    constructor(private store: Store) {
    }

    ngOnInit(): void {
        this.subscription.add(
            this.listeSedi$.subscribe((listaSedi: TreeItem) => {
                if (listaSedi) {
                    this.items = [];
                    this.items[0] = new TreeviewItem(listaSedi);
                }
            })
        );
        this.subscription.add(this.sediNavbarVisible$.pipe(delay(100)).subscribe(r => this.sediNavbarVisible = r));
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    onPatch($event: TreeviewEmitterInterface) {
        this.store.dispatch(new PatchSediNavbarSelezionate($event.idSelezionati, $event.multi));
    }

    onAnnulla() {
        this.store.dispatch(new ClearSediNavbarSelezionate());
    }

    onConferma() {
        this.store.dispatch(new SetSediNavbarSelezionate());
    }

}
