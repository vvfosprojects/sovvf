import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TreeItem, TreeviewItem } from 'ngx-treeview';
import { Observable, Subscription } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { SediTreeviewState } from '../../../shared/store/states/sedi-treeview/sedi-treeview.state';
import { ClearSediNavbarSelezionate, PatchSediNavbarSelezionate, SetSediNavbarSelezionate } from '../../../shared/store/actions/sedi-treeview/sedi-treeview.actions';
import { TreeviewEmitterInterface } from '../../../shared/interface/treeview.interface';
import { delay } from 'rxjs/operators';

@Component({
    selector: 'app-unita-operativa',
    templateUrl: './unita-operativa.component.html',
    styleUrls: ['./unita-operativa.component.css'],
})
export class UnitaOperativaComponent implements OnDestroy, OnInit {

    @Input() colorButton: string;
    @Input() cache = false;

    @Select(SediTreeviewState.listeSediNavbar) listeSedi$: Observable<TreeItem>;
    items: TreeviewItem[];

    @Select(SediTreeviewState.sediNavbarTesto) testoSedeSelezionata$: Observable<string>;

    @Select(SediTreeviewState.sediNavbarTastoConferma) tastoConferma$: Observable<boolean>;
    @Select(SediTreeviewState.sediNavbarVisible) sediNavbarVisible$: Observable<boolean>;
    sediNavbarVisible: boolean;

    private subscription = new Subscription();

    constructor(private store: Store) {
        this.subscription.add(this.sediNavbarVisible$.pipe(delay(0)).subscribe(r => this.sediNavbarVisible = r));
    }

    ngOnInit(): void {
        this.getListaSedi();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    getListaSedi(): void {
        this.subscription.add(
            this.listeSedi$.subscribe((listaSedi: TreeItem) => {
                if (listaSedi) {
                    this.items = [];
                    this.items[0] = new TreeviewItem(listaSedi);
                }
            })
        );
    }

    onPatch($event: TreeviewEmitterInterface): void {
        this.store.dispatch(new PatchSediNavbarSelezionate($event.idSelezionati, $event.multi));
    }

    onAnnulla(): void {
        this.store.dispatch(new ClearSediNavbarSelezionate());
    }

    onConferma(): void {
        this.store.dispatch(new SetSediNavbarSelezionate());
    }

}
