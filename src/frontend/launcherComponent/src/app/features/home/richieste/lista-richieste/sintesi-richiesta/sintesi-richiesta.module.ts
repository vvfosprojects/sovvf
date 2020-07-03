import {NgModule} from '@angular/core';
import {TimeagoCustomFormatter, TimeagoFormatter, TimeagoIntl, TimeagoModule} from 'ngx-timeago';
import {SintesiRichiestaComponent} from './sintesi-richiesta.component';
import {CommonModule} from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {SharedModule} from 'src/app/shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        NgbModule,
        SharedModule.forRoot(),
        TimeagoModule.forRoot({
            intl: TimeagoIntl,
            formatter: { provide: TimeagoFormatter, useClass: TimeagoCustomFormatter }
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
