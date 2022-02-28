import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelezioneSedeRouting } from './selezione-sede.routing';
import { SelezioneSedeComponent } from './selezione-sede.component';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
    declarations: [SelezioneSedeComponent],
    imports: [
        CommonModule,
        SelezioneSedeRouting,
        FormsModule,
        ReactiveFormsModule,
        NgSelectModule
    ]
})
export class SelezioneSedeModule {
}
