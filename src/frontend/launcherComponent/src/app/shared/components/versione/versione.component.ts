import { Component, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { NewVersionState } from '../../store/states/nuova-versione/nuova-versione.state';
import { VersionInterface } from '../../interface/version.interface';
import { delay } from 'rxjs/operators';
import { Navigate } from '@ngxs/router-plugin';
import { RoutesPath } from '../../enum/routes-path.enum';

@Component({
    selector: 'app-versione',
    templateUrl: './versione.component.html',
    styleUrls: ['./versione.component.scss']
})
export class VersioneComponent implements OnDestroy {

    @Select(NewVersionState.version) version$: Observable<VersionInterface>;
    version: VersionInterface;

    private subscription = new Subscription();

    constructor(private store: Store) {
        this.subscription.add(this.version$.pipe(delay(0)).subscribe((r: VersionInterface) => this.version = r));
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    goToListaChangelog(): void {
        this.store.dispatch(new Navigate([RoutesPath.Changelog]));
    }
}
