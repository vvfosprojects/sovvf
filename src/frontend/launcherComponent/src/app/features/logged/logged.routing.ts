import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoggedComponent } from './logged.component';

const loggedRoutes: Routes = [
  { path: '', component: LoggedComponent },

];

@NgModule({
  imports: [RouterModule.forChild(loggedRoutes)],
  exports: [RouterModule]
})
export class LoggedRouting { }
