import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { ComponenteSquadraComponent } from './componente-squadra/componente-squadra.component';
import { SquadraComponent } from './squadra/squadra.component';
import { ListaSquadreComponent } from './lista-squadre/lista-squadre.component';
import { ListaSquadreService } from './lista-squadre/lista-squadre.service';
import { TruncatePipe } from './shared/pipes/truncate.pipe';
import { MezzoComponent } from './mezzo/mezzo.component';
import { ListaMezziComponent } from './lista-mezzi/lista-mezzi.component';
import { ListaMezziService } from './lista-mezzi/lista-mezzi.service';
import { CompositoreComponent } from './compositore/compositore.component';

@NgModule({
  declarations: [
    AppComponent,
    ComponenteSquadraComponent,
    SquadraComponent,
    ListaSquadreComponent,
    TruncatePipe,
    MezzoComponent,
    ListaMezziComponent,
    CompositoreComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [ ListaSquadreService, ListaMezziService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
