import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutorimessaRouting } from './autorimessa.routing';
import { AutorimessaComponent } from './autorimessa.component';

@NgModule({
    declarations: [AutorimessaComponent],
    imports: [
        CommonModule,
        AutorimessaRouting
    ]
})
export class AutorimessaModule {
}
