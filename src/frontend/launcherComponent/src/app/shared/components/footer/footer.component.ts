import { Component, Input, OnDestroy } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { VersionInterface } from '../../interface/version.interface';
import { Observable, Subscription } from 'rxjs';
import { Select } from '@ngxs/store';
import { NewVersionState } from '../../store/states/nuova-versione/nuova-versione.state';
import { ViewportState } from '../../store/states/viewport/viewport.state';
import { AppState } from '../../store/states/app/app.state';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: [ './footer.component.scss' ]
})
export class FooterComponent implements OnDestroy {

    private subscription = new Subscription();

    @Select(NewVersionState.version) version$: Observable<VersionInterface>;
    version: VersionInterface;

    @Select(ViewportState.footerFixed) footerFixed$: Observable<boolean>;
    fixed: boolean;

    @Select(AppState.appIsLoaded) isLoaded$: Observable<boolean>;
    isReady: boolean;

    @Input() userLogged: boolean;

    isTest: string;

    constructor() {
        this.isTest = environment.productionTest ? ' (ATTENZIONE QUESTA E\' UNA VERSIONE DI TEST) ' : '';
        this.subscription.add(this.version$.subscribe((r: VersionInterface) => this.version = r));
        this.subscription.add(this.footerFixed$.subscribe((r: boolean) => this.fixed = r));
        this.subscription.add(this.isLoaded$.subscribe((r: boolean) => this.isReady = r));
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
