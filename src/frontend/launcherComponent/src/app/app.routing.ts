import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './auth/home';
import {LoginComponent} from './auth/login';
import {AuthGuard} from './auth/_guards';

const appRoutes: Routes = [
    {path: '', component: HomeComponent, canActivate: [AuthGuard]},
    {path: 'login', component: LoginComponent},
    {path: '**', redirectTo: ''}
];

export const routing = RouterModule.forRoot(appRoutes);
