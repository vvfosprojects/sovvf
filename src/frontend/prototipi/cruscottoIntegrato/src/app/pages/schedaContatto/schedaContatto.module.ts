//import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { schedaContattoComponent } from './schedaContatto.component';
import { FormschedacontattoComponent } from './formschedacontatto/formschedacontatto.component';
import { FriendlyDatePipe } from './shared/pipes/friendly-date.pipe';
import { FriendlyHourPipe } from './shared/pipes/friendly-hour.pipe';

@NgModule({
  declarations: [
    schedaContattoComponent,
    FormschedacontattoComponent,
    FriendlyDatePipe,
    FriendlyHourPipe
  ],
  imports: [
    //BrowserModule,
    FormsModule,
    HttpModule,
    NgbModule.forRoot()
  ],
  providers: [],
  bootstrap: [schedaContattoComponent]
})
export class schedaContattoModule { }