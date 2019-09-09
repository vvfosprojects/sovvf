import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxsModule } from '@ngxs/store';
import { SchedeContattoState } from '../store/states/schede-contatto/schede-contatto.state';
import { SchedeContattoComponent } from './schede-contatto.component';
import { DettaglioSchedaModalComponent } from './dettaglio-scheda-modal/dettaglio-scheda-modal.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        ReactiveFormsModule,
        SharedModule,
        NgxsModule.forFeature(
            [
                SchedeContattoState
            ]
        ),
    ],
    declarations: [
        SchedeContattoComponent,
        DettaglioSchedaModalComponent
    ],
    exports: [
        SchedeContattoComponent
    ],
    entryComponents: [
        DettaglioSchedaModalComponent
    ]
})
export class SchedeContattoModule {
}
