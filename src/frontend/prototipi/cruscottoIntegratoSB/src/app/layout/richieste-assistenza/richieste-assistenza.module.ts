import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RichiesteAssistenzaRoutingModule } from './richieste-assistenza-routing.module';
import { RichiesteAssistenzaComponent } from './richieste-assistenza.component';

import { RichAssModule, EventiRichAssModule } from '../../shared';

@NgModule({
    imports: [CommonModule, RichiesteAssistenzaRoutingModule, RichAssModule, EventiRichAssModule],
    declarations: [RichiesteAssistenzaComponent]
})
export class RichiesteAssistenzaModule {}
