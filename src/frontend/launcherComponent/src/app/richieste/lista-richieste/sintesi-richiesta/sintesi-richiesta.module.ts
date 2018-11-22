import { NgModule } from '@angular/core';
import { TimeagoModule, TimeagoIntl, TimeagoFormatter, TimeagoCustomFormatter } from 'ngx-timeago';
import { SintesiRichiestaComponent } from './sintesi-richiesta.component';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';
import { PipeModule } from 'src/app/shared/pipes/pipe.module';

@NgModule({
  imports: [
    CommonModule,
    NgbModule.forRoot(),
    PipeModule.forRoot(),
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
export class SintesiRichiestaModule { }
