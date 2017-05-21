import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { routing } from './composizionePartenza.routing';
import { ComponenteSquadraComponent } from "app/pages/composizionePartenza/componente-squadra/componente-squadra.component";
import { SquadraComponent } from "app/pages/composizionePartenza/squadra/squadra.component";
import { ListaSquadreComponent } from "app/pages/composizionePartenza/lista-squadre/lista-squadre.component";
import { TruncatePipe } from "app/pages/composizionePartenza/shared/pipes/truncate.pipe";
import { MezzoComponent } from "app/pages/composizionePartenza/mezzo/mezzo.component";
import { ListaMezziComponent } from "app/pages/composizionePartenza/lista-mezzi/lista-mezzi.component";
import { CompositoreComponent } from "app/pages/composizionePartenza/compositore/compositore.component";
import { MezzoInPartenzaComponent } from "app/pages/composizionePartenza/mezzo-in-partenza/mezzo-in-partenza.component";
import { ComponenteInPartenzaComponent } from "app/pages/composizionePartenza/componente-in-partenza/componente-in-partenza.component";
import { TagCapopartenzaComponent } from "app/pages/composizionePartenza/shared/components/tag-capopartenza/tag-capopartenza.component";
import { TagAutistaComponent } from "app/pages/composizionePartenza/shared/components/tag-autista/tag-autista.component";
import { CanDragDirective } from "app/pages/composizionePartenza/shared/directives/dnd/can-drag.directive";
import { CanDropDirective } from "app/pages/composizionePartenza/shared/directives/dnd/can-drop.directive";
import { DropAreaComponent } from "app/pages/composizionePartenza/drop-area/drop-area.component";
import { ListaSquadreService } from "app/pages/composizionePartenza/lista-squadre/lista-squadre.service";
import { ListaMezziService } from "app/pages/composizionePartenza/lista-mezzi/lista-mezzi.service";
import { CompositoreService } from "app/pages/composizionePartenza/compositore/compositore.service";
import { DndHandlerService } from "app/pages/composizionePartenza/compositore/dnd-handler.service";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        routing
    ],
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
    providers: [
        ListaSquadreService,
        ListaMezziService,
        CompositoreService,
        DndHandlerService
    ]
})
export class NewModule { }