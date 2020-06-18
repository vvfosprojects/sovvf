import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { CasLoggedComponent } from './cas-logged.component';
import { CasLogoutComponent } from './cas-logout.component';
import { RoutesPath } from '../../shared/enum/routes-path.enum';
import { UtenteNonAbilitatoComponent } from './utente-non-abilitato/utente-non-abilitato.component';

const routes: Routes = [
    {
        path: '',
        component: CasLoggedComponent
    },
    {
        path: 'caslogout',
        component: CasLogoutComponent
    },
    {
        path: RoutesPath.UtenteNonAbilitato,
        component: UtenteNonAbilitatoComponent
    }
];

@NgModule({
    declarations: [ CasLoggedComponent, CasLogoutComponent, UtenteNonAbilitatoComponent ],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(routes)
    ]
})
export class AuthModule {
}
