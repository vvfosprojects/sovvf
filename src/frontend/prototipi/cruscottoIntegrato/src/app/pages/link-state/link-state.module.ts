import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LinkStateComponent } from './link-state.component';
import { routing } from './link-state.routing';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    routing
  ],
  declarations: [
    LinkStateComponent
  ]
})
export class LinkStateModule {}