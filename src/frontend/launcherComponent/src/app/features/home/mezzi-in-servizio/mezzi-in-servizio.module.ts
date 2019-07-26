import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { MezziInServizioComponent } from './mezzi-in-servizio..component';
import { MezziInServizioService } from 'src/app/core/service/mezzi-in-servizio-service/mezzi-in-servizio.service';
import { environment } from 'src/environments/environment';
import { MezziInServizioFakeService } from 'src/app/core/service/mezzi-in-servizio-service/mezzi-in-servizio.service.fake';
import { NgxsModule } from '@ngxs/store';
import { MezziInServizioState } from '../store/states/mezzi-in-servizio/mezzi-in-servizio.state';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        ReactiveFormsModule,
        SharedModule,
        NgxsModule.forFeature(
            [
                MezziInServizioState
            ]
        ),
    ],
    declarations: [
        MezziInServizioComponent
    ],
    exports: [
        MezziInServizioComponent
    ],
    providers: [
        { provide: MezziInServizioService, useClass: environment.fakeProvider ? MezziInServizioFakeService : MezziInServizioService }
    ]
})
export class MezziInServizioModule {
}
