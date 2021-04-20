import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodaChiamateComponent } from './coda-chiamate.component';
import { NgxsModule } from '@ngxs/store';
import { GraficoDistaccamentiComponent } from './grafico-distaccamenti/grafico-distaccamenti.component';
import { CodaChiamateState } from '../store/states/coda-chiamate/coda-chiamate.state';
import { BarChartModule } from '@swimlane/ngx-charts';
import { DettaglioDistaccamentoModalComponent } from './dettaglio-distaccamento-modal/dettaglio-distaccamento-modal.component';
import { CodaChiamateService } from '../../../core/service/coda-chiamate-service/coda-chiamate.service';
import { SharedModule } from '../../../shared/shared.module';
import { TimeagoModule } from 'ngx-timeago';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        CodaChiamateComponent,
        GraficoDistaccamentiComponent,
        DettaglioDistaccamentoModalComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgxsModule.forFeature(
            [
                CodaChiamateState
            ]
        ),
        BarChartModule,
        SharedModule,
        TimeagoModule,
        NgbTooltipModule
    ],
    exports: [
        CodaChiamateComponent
    ],
    providers: [
        CodaChiamateService
    ]
})
export class CodaChiamateModule {
}
