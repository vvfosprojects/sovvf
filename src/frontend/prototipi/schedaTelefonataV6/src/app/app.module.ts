import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ChiamataModule } from './chiamata/chiamata.module';
import { SharedModule } from './shared/shared.module';

import { AppComponent } from './app.component';
import { SchedaTelefonataComponent } from './chiamata/scheda-telefonata/scheda-telefonata.component';

@NgModule({
  declarations: [
    AppComponent,
    SchedaTelefonataComponent
  ],
  imports: [
    ChiamataModule,
    SharedModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
