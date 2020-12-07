import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxsModule } from '@ngxs/store';
import { MergeSchedeContattoState } from '../store/states/schede-contatto/merge-schede-contatto.state';
import { NgxPaginationModule } from 'ngx-pagination';
import { RichiesteModule } from '../richieste/richieste.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        ReactiveFormsModule,
        SharedModule,
        NgxsModule.forFeature([
            MergeSchedeContattoState
        ]),
        NgxPaginationModule,
        RichiesteModule
    ]
})
export class SchedeContattoModule {
}
