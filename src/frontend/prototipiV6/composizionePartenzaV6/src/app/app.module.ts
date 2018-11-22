import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';

// Modules
import { ComposizionePartenzaModule } from './composizione-partenza/composizione-partenza.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    ComposizionePartenzaModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
