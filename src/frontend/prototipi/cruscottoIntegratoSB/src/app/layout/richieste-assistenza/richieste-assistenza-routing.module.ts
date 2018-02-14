import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RichiesteAssistenzaComponent } from './richieste-assistenza.component';

const routes: Routes = [
    {
        path: '',
        component: RichiesteAssistenzaComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RichiesteAssistenzaRoutingModule {}
