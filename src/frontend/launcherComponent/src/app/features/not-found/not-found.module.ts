import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotFoundRouting } from './not-found.routing';
import { NotFoundComponent } from './not-found.component';

@NgModule({
    declarations: [NotFoundComponent],
    imports: [
        CommonModule,
        NotFoundRouting
    ]
})
export class NotFoundModule {
}
