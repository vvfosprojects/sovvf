import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { InfoAggregateComponent } from './info-aggregate.component';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { MezzoinservizioComponent } from './mezzoinservizio/mezzoinservizio.component';
import { FriendlyDatePipe } from './shared-mezzi-in-servizio/pipes/friendly-date.pipe';
import { FriendlyHourPipe } from './shared-mezzi-in-servizio/pipes/friendly-hour.pipe';
import { TruncatePipe } from './shared-mezzi-in-servizio/pipes/truncate.pipe';
import { TagCapopartenzaComponent } from './shared-mezzi-in-servizio/components/tag-capopartenza/tag-capopartenza.component';
import { TagAutistaComponent } from './shared-mezzi-in-servizio/components/tag-autista/tag-autista.component';
import { ListaMezziComponent } from './lista-mezzi/lista-mezzi.component';
import { ListaMezziService } from "./lista-mezzi/lista-mezzi.service";
import { ListaMezziService_Fake } from "./lista-mezzi/lista-mezzi-fake.service";
import { ListaMezziService_FakeJson } from "./lista-mezzi/lista-mezzi-fake-json.service";


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        NgbModule.forRoot()
    ],
    declarations: [
        MezzoinservizioComponent,
        FriendlyDatePipe,
        FriendlyHourPipe,
        TruncatePipe,
        TagCapopartenzaComponent,
        TagAutistaComponent,
        ListaMezziComponent
    ],
    exports: [
        MezzoinservizioComponent,
        FriendlyDatePipe,
        FriendlyHourPipe,
        TruncatePipe,
        TagCapopartenzaComponent,
        TagAutistaComponent,
        ListaMezziComponent
    ],
    providers: [
        { provide: ListaMezziService, useClass: ListaMezziService_FakeJson },
      ]
})
export class MezziInServizioModule { }