import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { ChangelogState } from './store/changelog.state';
import { Observable, Subscription } from 'rxjs';
import { ChangelogInterface } from '../../shared/interface/changelog.interface';

@Component({
    selector: 'app-changelog',
    templateUrl: './changelog.component.html',
    styleUrls: ['./changelog.component.css']
})
export class ChangelogComponent implements OnInit, OnDestroy {

    @Select(ChangelogState.listaChangelog) listaChangelog$: Observable<ChangelogInterface[]>;
    listaChangelog: ChangelogInterface[];

    private subscription: Subscription = new Subscription();

    constructor() {
        this.getListaChangelog();
    }

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    getListaChangelog(): void {
        this.subscription.add(
            this.listaChangelog$.subscribe((changelogs: ChangelogInterface[]) => {
                this.listaChangelog = changelogs;
            })
        );
    }

}
