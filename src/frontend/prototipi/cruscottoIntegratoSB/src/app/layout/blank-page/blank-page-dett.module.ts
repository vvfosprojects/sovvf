import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlankPageRoutingModule } from './blank-page-routing.module';
import { BlankPageComponentDett } from './blank-page-dett.component';

import { InfoAggregateModule } from '../../shared';

@NgModule({
    imports: [CommonModule, BlankPageRoutingModule],
    declarations: [BlankPageComponentDett]
})
export class BlankPageDettModule {}
