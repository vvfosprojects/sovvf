import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ImpostazioniSedeComponent } from './impostazioni-sede.component';

const impostazioniRoutes: Routes = [
    { path: '', component: ImpostazioniSedeComponent },
];

@NgModule({
    imports: [
        RouterModule.forChild(impostazioniRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class ImpostazioniSedeRoutingModule {
}
