import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { AuthGuard } from '../shared';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'dashboard' },
            { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule', canActivate: [AuthGuard] },
            { path: 'charts', loadChildren: './charts/charts.module#ChartsModule', canActivate: [AuthGuard]  },
            { path: 'tables', loadChildren: './tables/tables.module#TablesModule' , canActivate: [AuthGuard]  },
            { path: 'forms', loadChildren: './form/form.module#FormModule', canActivate: [AuthGuard]  },
            { path: 'bs-element', loadChildren: './bs-element/bs-element.module#BsElementModule', canActivate: [AuthGuard]  },
            { path: 'grid', loadChildren: './grid/grid.module#GridModule', canActivate: [AuthGuard]  },
            { path: 'components', loadChildren: './bs-component/bs-component.module#BsComponentModule', canActivate: [AuthGuard]  },
            { path: 'blank-page', loadChildren: './blank-page/blank-page.module#BlankPageModule', canActivate: [AuthGuard]  },
       //     { path: 'blank-page-dett', loadChildren: './blank-page/blank-page.module#BlankPageModule', canActivate: [AuthGuard]  },
            { path: 'scheda-contatto/:id', loadChildren: './scheda-contatto/scheda-contatto.module#SchedaContattoModule', canActivate: [AuthGuard]  },
            { path: 'lista-schede', loadChildren: './lista-schede/lista-schede.module#ListaSchedeModule', canActivate: [AuthGuard]  },
            { path: 'richieste-assistenza', loadChildren: './richieste-assistenza/richieste-assistenza.module#RichiesteAssistenzaModule', canActivate: [AuthGuard]  },
            { path: 'gestione-permessi', loadChildren: './gestione-permessi/gestione-permessi.module#GestionePermessiModule', canActivate: [AuthGuard]  },
            { path: 'mezzi', loadChildren: './mezzi/mezzi.module#MezziModule', canActivate: [AuthGuard]  },
            { path: 'composizione-partenza', loadChildren: './composizione-partenza/composizione-partenza.module#ComposizionePartenzaModule', canActivate: [AuthGuard]  },
            { path: 'form-chiamata', loadChildren: './form-chiamata/form-chiamata.module#FormChiamataModule', canActivate: [AuthGuard]  }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule {}
