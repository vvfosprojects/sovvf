import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormschedacontattoComponent } from "app/formschedacontatto/formschedacontatto.component";
import { SintesiSchedaComponent } from "app/sintesi-scheda/sintesi-scheda.component";
//import { ListaSchedeComponent } from "app/lista-schede/lista-schede.component";

export const routes: Routes = [
    { path: '', component: SintesiSchedaComponent },
    { path: 'show/:id', component: FormschedacontattoComponent },
    { path: '**', redirectTo: 'not-found' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
