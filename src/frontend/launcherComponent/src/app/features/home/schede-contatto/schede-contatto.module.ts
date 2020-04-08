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
import { SchedaContattoComponent } from './scheda-contatto/scheda-contatto.component';
import { MergeSchedeContattoState } from '../store/states/schede-contatto/merge-schede-contatto.state';
import { SchedaCollegataComponent } from './scheda-collegata/scheda-collegata.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        ReactiveFormsModule,
        SharedModule,
        NgxsModule.forFeature(
            [
                SchedeContattoState, MergeSchedeContattoState
            ]
        )
    ],
    declarations: [
        SchedeContattoComponent,
        DettaglioSchedaModalComponent,
        SchedaContattoComponent,
        SchedaCollegataComponent
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
