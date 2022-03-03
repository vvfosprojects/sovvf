import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SelezioneSedeComponent } from './selezione-sede.component';

const loginRoutes: Routes = [
    { path: '', component: SelezioneSedeComponent },
];

@NgModule({
    imports: [RouterModule.forChild(loginRoutes)],
    exports: [RouterModule]
})
export class SelezioneSedeRouting {
}
