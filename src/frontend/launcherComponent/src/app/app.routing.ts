import { Routes, RouterModule } from '@angular/router';
import { RoutesPath } from './shared/enum/routes-path.enum';
import { Role } from './shared/model/utente.model';
import { AuthGuard } from './core/auth/auth.guard';

const appRoutes: Routes = [
    { path: RoutesPath.Login, loadChildren: './features/login/login.module#LoginModule' },
    { path: RoutesPath.Auth, loadChildren: './features/auth/auth.module#AuthModule' },
    { path: RoutesPath.Home, loadChildren: './features/home/home.module#HomeModule', canActivate: [AuthGuard] },
    {
        path: RoutesPath.Autorimessa,
        loadChildren: './features/autorimessa/autorimessa.module#AutorimessaModule',
        canActivate: [AuthGuard],
        data: { roles: [Role.Amministratore, Role.GestoreRichieste, Role.GestoreChiamate] }
    },
    {
        path: RoutesPath.Logged,
        loadChildren: './features/logged/logged.module#LoggedModule',
        canActivate: [AuthGuard]
    },
    {
        path: RoutesPath.Servizi,
        loadChildren: './features/servizi/servizi.module#ServiziModule',
        canActivate: [AuthGuard],
        data: { roles: [Role.Amministratore, Role.GestoreRichieste, Role.GestoreChiamate] }
    },
    {
        path: RoutesPath.Statistiche,
        loadChildren: './features/statistiche/statistiche.module#StatisticheModule',
        canActivate: [AuthGuard]
    },
    {
        path: RoutesPath.GestioneUtenti,
        loadChildren: './features/gestione-utenti/gestione-utenti.module#GestioneUtentiModule',
        canActivate: [AuthGuard],
        data: { roles: [Role.Amministratore] }
    },
    {
        path: RoutesPath.Rubrica,
        loadChildren: './features/rubrica/rubrica.module#RubricaModule',
        canActivate: [AuthGuard]
    },
    {
        path: RoutesPath.TrasferimentoChiamata,
        loadChildren: './features/trasferimento-chiamata/trasferimento-chiamata.module#TrasferimentoChiamataModule',
        canActivate: [AuthGuard]
    },
    {
        path: RoutesPath.Changelog,
        loadChildren: './features/changelog/changelog.module#ChangelogModule',
        canActivate: [AuthGuard]
    },
    {
        path: RoutesPath.Impostazioni,
        loadChildren: './features/impostazioni/impostazioni.module#ImpostazioniModule',
        canActivate: [AuthGuard]
    },
    { path: RoutesPath.NotFound, loadChildren: './features/not-found/not-found.module#NotFoundModule' },
    { path: '', pathMatch: 'full', redirectTo: RoutesPath.Home },
    {
        path: RoutesPath.CasLogout,
        redirectTo: 'auth/' + RoutesPath.CasLogout,
        pathMatch: 'full'
    },
    {
        path: RoutesPath.UtenteNonAbilitato,
        redirectTo: 'auth/' + RoutesPath.UtenteNonAbilitato,
        pathMatch: 'full'
    },
    { path: '**', redirectTo: RoutesPath.NotFound }
];

export const APP_ROUTING = RouterModule.forRoot(appRoutes, { enableTracing: false });
