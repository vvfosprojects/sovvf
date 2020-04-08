import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ComposizionePartenzaComponent } from './composizione-partenza.component';

const routes: Routes = [
    {
        path: '',
        component: ComposizionePartenzaComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ComposizionePartenzaRoutingModule {}
