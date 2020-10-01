import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { ChangelogState } from './store/changelog.state';
import { Observable, Subscription } from 'rxjs';
import { ChangelogInterface } from '../../shared/interface/changelog.interface';
import { SetCurrentUrl } from '../../shared/store/actions/app/app.actions';
import { RoutesPath } from '../../shared/enum/routes-path.enum';
import { SetSediNavbarVisible } from '../../shared/store/actions/sedi-treeview/sedi-treeview.actions';
import { StopBigLoading } from '../../shared/store/actions/loading/loading.actions';

@Component({
    selector: 'app-changelog',
    templateUrl: './changelog.component.html',
    styleUrls: ['./changelog.component.css']
})
export class ChangelogComponent implements OnInit, OnDestroy {

    @Select(ChangelogState.listaChangelog) listaChangelog$: Observable<ChangelogInterface[]>;
    listaChangelog: ChangelogInterface[];

    private subscriptions: Subscription = new Subscription();

    constructor(private store: Store) {
        this.getListaChangelog();
    }

    ngOnInit(): void {
        this.store.dispatch([
            new SetCurrentUrl(RoutesPath.Changelog),
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

    getListaChangelog(): void {
        this.subscriptions.add(
            this.listaChangelog$.subscribe((changelogs: ChangelogInterface[]) => {
                this.listaChangelog = changelogs;
            })
        );
    }

}
