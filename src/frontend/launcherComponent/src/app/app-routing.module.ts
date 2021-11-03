import { Routes, RouterModule } from '@angular/router';
import { RoutesPath } from './shared/enum/routes-path.enum';
import { Role } from './shared/model/utente.model';
import { AuthGuard } from './core/auth/auth.guard';

const appRoutes: Routes = [
    {
        path: RoutesPath.Login,
        loadChildren: () => import('./features/login/login.module').then(m => m.LoginModule)
    },
    {
        path: RoutesPath.Auth,
        loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
    },
    {
        path: RoutesPath.Home,
        loadChildren: () => import('./features/home/home.module').then(m => m.HomeModule),
        canActivate: [AuthGuard]
    },
    {
        path: RoutesPath.Autorimessa,
        loadChildren: () => import('./features/autorimessa/autorimessa.module').then(m => m.AutorimessaModule),
        canActivate: [AuthGuard],
        data: { roles: [Role.Amministratore, Role.GestoreRichieste, Role.GestoreChiamate] }
    },
    {
        path: RoutesPath.Logged,
        loadChildren: () => import('./features/logged/logged.module').then(m => m.LoggedModule),
        canActivate: [AuthGuard]
    },
    {
        path: RoutesPath.Servizi,
        loadChildren: () => import('./features/servizi/servizi.module').then(m => m.ServiziModule),
        canActivate: [AuthGuard],
        data: { roles: [Role.Amministratore, Role.GestoreRichieste, Role.GestoreChiamate] }
    },
    {
        path: RoutesPath.Statistiche,
        loadChildren: () => import('./features/statistiche/statistiche.module').then(m => m.StatisticheModule),
        canActivate: [AuthGuard]
    },
    {
        path: RoutesPath.GestioneUtenti,
        loadChildren: () => import('./features/gestione-utenti/gestione-utenti.module').then(m => m.GestioneUtentiModule),
        canActivate: [AuthGuard],
        data: { roles: [Role.Amministratore] }
    },
    {
        path: RoutesPath.Rubrica,
        loadChildren: () => import('./features/rubrica/rubrica.module').then(m => m.RubricaModule),
        canActivate: [AuthGuard]
    },
    {
        path: RoutesPath.RubricaPersonale,
        loadChildren: () => import('./features/rubrica-personale/rubrica-personale.module').then(m => m.RubricaPersonaleModule),
        canActivate: [AuthGuard]
    },
    {
        path: RoutesPath.TrasferimentoChiamata,
        loadChildren: () => import('./features/trasferimento-chiamata/trasferimento-chiamata.module').then(m => m.TrasferimentoChiamataModule),
        canActivate: [AuthGuard]
    },
    {
        path: RoutesPath.Changelog,
        loadChildren: () => import('./features/changelog/changelog.module').then(m => m.ChangelogModule),
        canActivate: [AuthGuard]
    },
    {
        path: RoutesPath.ImpostazioniSede,
        loadChildren: () => import('./features/impostazioni-sede/impostazioni-sede.module').then(m => m.ImpostazioniSedeModule),
        canActivate: [AuthGuard]
    },
    {
        path: RoutesPath.POS,
        loadChildren: () => import('./features/pos/pos.module').then(m => m.PosModule),
        canActivate: [AuthGuard]
    },
    {
        path: RoutesPath.AreaDocumentale,
        loadChildren: () => import('./features/area-documentale/area-documentale.module').then(m => m.AreaDocumentaleModule),
        canActivate: [AuthGuard]
    },
    {
        path: RoutesPath.DashboardPortale,
        loadChildren: () => import('./features/dashboard-portale/dashboard-portale.module').then(m => m.DashboardPortaleModule),
    },
    {
        path: RoutesPath.ZoneEmergenza,
        loadChildren: () => import('./features/zone-emergenza/zone-emergenza.module').then(m => m.ZoneEmergenzaModule),
    },
    {
        path: RoutesPath.Profilo,
        loadChildren: () => import('./features/profilo/profilo.module').then(m => m.ProfiloModule),
        canActivate: [AuthGuard]
    },
    {
        path: RoutesPath.Preferenze,
        loadChildren: () => import('./features/preferenze/preferenze.module').then(m => m.PreferenzeModule),
        canActivate: [AuthGuard]
    },
    {
        path: RoutesPath.NotFound,
        loadChildren: () => import('./features/not-found/not-found.module').then(m => m.NotFoundModule),
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: RoutesPath.Home
    },
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
