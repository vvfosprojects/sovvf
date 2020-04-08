import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MezziRoutingModule } from './mezzi-routing.module';
import { MezziComponent } from './mezzi.component';

import { MezziInServizioModule } from '../../shared';

@NgModule({
    imports: [CommonModule, MezziRoutingModule, MezziInServizioModule],
    declarations: [MezziComponent]
})
export class MezziModule {}
