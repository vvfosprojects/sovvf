import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/auth/_guards';
import { Role } from './core/auth/_models';
import { HomeComponent } from './features/home';
import { LoginComponent } from './features/login';
import { NotFoundComponent } from './features/not-found/';
import { ServiziComponent } from './features/servizi/';
import { AutorimessaComponent } from './features/autorimessa/';
import { StatisticheComponent } from './features/statistiche/';

const appRoutes: Routes = [
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard], data: { roles: [Role.Admin] } },
    { path: 'autorimessa', component: AutorimessaComponent, canActivate: [AuthGuard], data: { roles: [Role.Admin] }  },
    { path: 'servizi', component: ServiziComponent, canActivate: [AuthGuard], data: { roles: [Role.Admin] }  },
    { path: 'statistiche', component: StatisticheComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: '404', component: NotFoundComponent },
    { path: '', pathMatch: 'full', redirectTo: 'home' },
    { path: '**', redirectTo: '404' }
];

export const routing = RouterModule.forRoot(appRoutes);
