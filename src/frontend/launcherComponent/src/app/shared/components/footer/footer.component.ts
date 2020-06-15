import { Component, OnDestroy } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { VersionInterface } from '../../interface/version.interface';
import { Observable, Subscription } from 'rxjs';
import { Select } from '@ngxs/store';
import { NewVersionState } from '../../store/states/nuova-versione/nuova-versione.state';
import { ViewportState } from '../../store/states/viewport/viewport.state';
import { delay } from 'rxjs/operators';

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

    @Select(ViewportState.footerVisible) isVisible$: Observable<boolean>;
    isVisible: boolean;

    isTest: string;

    constructor() {
        this.isTest = environment.productionTest ? ' (ATTENZIONE, E\' UNA VERSIONE DI TEST!) ' : '';
        this.subscription.add(this.version$.pipe(delay(0)).subscribe((r: VersionInterface) => this.version = r));
        this.subscription.add(this.footerFixed$.pipe(delay(0)).subscribe((r: boolean) => this.fixed = r));
        this.subscription.add(this.isVisible$.pipe(delay(0)).subscribe((r: boolean) => this.isVisible = r));
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
