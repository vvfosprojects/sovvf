import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
/**
 * Component
*/
import { TrasferimentoChiamataComponent } from './trasferimento-chiamata.component';

const trasferimentoChiamataRoutes: Routes = [
  { path: '', component: TrasferimentoChiamataComponent },

];

@NgModule({
    imports: [RouterModule.forChild(trasferimentoChiamataRoutes)],
    exports: [RouterModule]
  })
  export class TrasferimentoChiamataRouting { }