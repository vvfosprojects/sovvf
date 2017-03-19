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
import { CompositoreService } from './compositore/compositore.service';
import { MezzoInPartenzaComponent } from './mezzo-in-partenza/mezzo-in-partenza.component';
import { ComponenteInPartenzaComponent } from './componente-in-partenza/componente-in-partenza.component';
import { TagCapopartenzaComponent } from './shared/components/tag-capopartenza/tag-capopartenza.component';
import { TagAutistaComponent } from './shared/components/tag-autista/tag-autista.component';
import { CanDragDirective } from './shared/directives/dnd/can-drag.directive';
import { CanDropDirective } from './shared/directives/dnd/can-drop.directive';
import { DndHandlerService } from './compositore/dnd-handler.service';
import { DropAreaComponent } from './drop-area/drop-area.component';

@NgModule({
  declarations: [
    AppComponent,
    ComponenteSquadraComponent,
    SquadraComponent,
    ListaSquadreComponent,
    TruncatePipe,
    MezzoComponent,
    ListaMezziComponent,
    CompositoreComponent,
    MezzoInPartenzaComponent,
    ComponenteInPartenzaComponent,
    TagCapopartenzaComponent,
    TagAutistaComponent,
    CanDragDirective,
    CanDropDirective,
    DropAreaComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [ 
    ListaSquadreService, 
    ListaMezziService,
    CompositoreService,
    DndHandlerService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
