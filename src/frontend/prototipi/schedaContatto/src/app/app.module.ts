import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { FormschedacontattoComponent } from './formschedacontatto/formschedacontatto.component';
import { FriendlyDatePipe } from './shared/pipes/friendly-date.pipe';

@NgModule({
  declarations: [
    AppComponent,
    FormschedacontattoComponent,
    FriendlyDatePipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }



