import { Routes, RouterModule }  from '@angular/router';
import { Pages } from './pages.component';
import { ModuleWithProviders } from '@angular/core';
// noinspection TypeScriptValidateTypes

// export function loadChildren(path) { return System.import(path); };

export const routes: Routes = [
  {
    path: 'login',
    loadChildren: 'app/pages/login/login.module#LoginModule'
  },
  {
    path: 'register',
    loadChildren: 'app/pages/register/register.module#RegisterModule'
  },
  {
    path: 'pages',
    component: Pages,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
      ,{ path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule' }
      ,{ path: 'situazioneMezzi', loadChildren: './situazioneMezzi/new.module#NewModule' }
      ,{ path: 'schedaTelefonata', loadChildren: './schedaTelefonata/scheda-telefonata.module#NewModule' }
      ,{ path: 'composizionePartenza', loadChildren: './composizionePartenza/composizionePartenza.module#NewModule' }
      ,{ path: 'linkState', loadChildren: './link-state/link-state.module#LinkStateModule' }
      //,{ path: 'editors', loadChildren: './editors/editors.module#EditorsModule' }
      //,{ path: 'components', loadChildren: './components/components.module#ComponentsModule' }
      //,{ path: 'charts', loadChildren: './charts/charts.module#ChartsModule' }
      //,{ path: 'ui', loadChildren: './ui/ui.module#UiModule' }
      //,{ path: 'forms', loadChildren: './forms/forms.module#FormsModule' }
      //,{ path: 'tables', loadChildren: './tables/tables.module#TablesModule' }
      //,{ path: 'maps', loadChildren: './maps/maps.module#MapsModule' }
      ,{ path: 'rigaElencoRichiesteDiAssistenza',  loadChildren: './rigaElencoRichiesteDiAssistenza/rigaElencoRichiesteDiAssistenza.module#rigaElencoRichiesteDiAssistenzaModule' }      
      ,{ path: 'schedaContatto', loadChildren: './schedaContatto/schedaContatto.module#schedaContattoModule' }      
    ]
  }


];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
