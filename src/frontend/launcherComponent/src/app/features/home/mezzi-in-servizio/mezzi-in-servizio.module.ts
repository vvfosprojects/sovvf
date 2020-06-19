import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { MezziInServizioComponent } from './mezzi-in-servizio..component';
import { MezziInServizioService } from 'src/app/core/service/mezzi-in-servizio-service/mezzi-in-servizio.service';
import { NgxsModule } from '@ngxs/store';
import { MezziInServizioState } from '../store/states/mezzi-in-servizio/mezzi-in-servizio.state';
import { EventiRichiestaState } from '../store/states/eventi/eventi-richiesta.state';
import { MezzoInServizioComponent } from './mezzo-in-servizio/mezzo-in-servizio.component';
import { FilterPipeModule } from 'ngx-filter-pipe';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        ReactiveFormsModule,
        SharedModule,
        NgxsModule.forFeature(
            [
                MezziInServizioState,
                EventiRichiestaState
            ]
        ),
        FilterPipeModule,
    ],
    declarations: [
        MezziInServizioComponent,
        MezzoInServizioComponent
    ],
    exports: [
        MezziInServizioComponent
    ],
    providers: [
        MezziInServizioService
    ]
})
export class MezziInServizioModule {
}
