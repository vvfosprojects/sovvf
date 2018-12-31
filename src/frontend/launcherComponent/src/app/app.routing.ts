import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth/_guards';
import { HomeComponent } from './auth/features/home';
import { LoginComponent } from './auth/features/login';
import { NotFoundComponent } from './auth/features/not-found/';
import { ServiziComponent } from './auth/features/servizi/';
import { AutorimessaComponent } from './auth/features/autorimessa/';
import { StatisticheComponent } from './auth/features/statistiche/';

const appRoutes: Routes = [
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'autorimessa', component: AutorimessaComponent, canActivate: [AuthGuard] },
    { path: 'servizi', component: ServiziComponent, canActivate: [AuthGuard] },
    { path: 'statistiche', component: StatisticheComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: '404', component: NotFoundComponent },
    { path: '', pathMatch: 'full', redirectTo: 'home' },
    { path: '**', redirectTo: '404' }
];

export const routing = RouterModule.forRoot(appRoutes);
