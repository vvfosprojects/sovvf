import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ImpostazioniComponent } from './impostazioni.component';

const impostazioniRoutes: Routes = [
    { path: '', component: ImpostazioniComponent },
];

@NgModule({
    imports: [
        RouterModule.forChild(impostazioniRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class ImpostazioniRoutingModule {
}
