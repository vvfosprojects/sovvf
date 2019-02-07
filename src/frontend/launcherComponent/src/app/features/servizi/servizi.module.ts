import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiziRouting } from './servizi.routing';
import { ServiziComponent } from './servizi.component';

@NgModule({
    declarations: [ServiziComponent],
    imports: [
        CommonModule,
        ServiziRouting
    ]
})
export class ServiziModule {
}
