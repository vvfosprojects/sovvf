import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './auth/features/home';
import { LoginComponent } from './auth/features/login';
import { AuthGuard } from './auth/_guards';
import { NotFoundComponent } from './auth/features/not-found/not-found.component';
import { ServiziComponent } from './auth/features/servizi/servizi.component';
import { AutorimessaComponent } from './auth/features/autorimessa/autorimessa.component';
import { StatisticheComponent } from './auth/features/statistiche/statistiche.component';

const appRoutes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'autorimessa', component: AutorimessaComponent, canActivate: [AuthGuard] },
    { path: 'servizi', component: ServiziComponent, canActivate: [AuthGuard] },
    { path: 'statistiche', component: StatisticheComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: '404', component: NotFoundComponent },
    { path: '**', redirectTo: '404' }
];

export const routing = RouterModule.forRoot(appRoutes);
