import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/auth/_guards';
import { Role } from './core/auth/_models';
import { HomeComponent } from './features/home/home.component';

const appRoutes: Routes = [
    { path: 'login', loadChildren: './features/login/login.module#LoginModule' },
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard], data: { roles: [Role.Admin] } },
    { path: 'autorimessa', loadChildren: './features/autorimessa/autorimessa.module#AutorimessaModule', canActivate: [AuthGuard], data: { roles: [Role.Admin] } },
    { path: 'logged', loadChildren: './features/logged/logged.module#LoggedModule', },
    { path: 'servizi', loadChildren: './features/servizi/servizi.module#ServiziModule', canActivate: [AuthGuard], data: { roles: [Role.Admin] } },
    { path: 'statistiche', loadChildren: './features/statistiche/statistiche.module#StatisticheModule' },
    { path: '404', loadChildren: './features/not-found/not-found.module#NotFoundModule' },
    { path: '', pathMatch: 'full', redirectTo: 'home' },
    { path: '**', redirectTo: '404' }
];

export const APP_ROUTING = RouterModule.forRoot(appRoutes, { enableTracing: false });
