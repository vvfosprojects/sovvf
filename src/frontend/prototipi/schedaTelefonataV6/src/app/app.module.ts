import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SchedaTelefonataComponent } from './chiamata/scheda-telefonata/scheda-telefonata.component';
import { ChiamataModule } from './chiamata/chiamata.module';

@NgModule({
  declarations: [
    AppComponent,
    SchedaTelefonataComponent
  ],
  imports: [
    ChiamataModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
