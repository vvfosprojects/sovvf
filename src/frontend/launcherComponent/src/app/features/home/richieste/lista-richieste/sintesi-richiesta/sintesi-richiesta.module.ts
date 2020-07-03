import {NgModule} from '@angular/core';
import {TimeagoFormatter, TimeagoIntl, TimeagoModule} from 'ngx-timeago';
import {SintesiRichiestaComponent} from './sintesi-richiesta.component';
import {CommonModule} from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {SharedModule} from 'src/app/shared/shared.module';
import {TimeagoVVFFormatter} from './helper/timeago-custom-formatter/timago-custom-formatter';

@NgModule({
    imports: [
        CommonModule,
        NgbModule,
        SharedModule.forRoot(),
        TimeagoModule.forRoot({
            intl: TimeagoIntl,
            formatter: { provide: TimeagoFormatter, useClass: TimeagoVVFFormatter }
        })
    ],
    declarations: [
        SintesiRichiestaComponent
    ],
    exports: [
        SintesiRichiestaComponent
    ],
})
export class SintesiRichiestaModule {
}
