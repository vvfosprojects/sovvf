import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClockComponent } from './clock/clock.component';
import { NavbarComponent } from './navbar.component';
import { TurnoComponent } from './turno/turno.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PipeModule } from '../shared/pipes/pipe.module';
import { SharedModule } from '../shared/shared.module';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { routing } from '../app.routing';
import { FormsModule } from '@angular/forms';
import { CambioSedeModalNavComponent } from './cambio-sede-modal-nav/cambio-sede-modal-nav.component';

@NgModule({
    imports: [
        CommonModule,
        NgbModule.forRoot(),
        PipeModule.forRoot(),
        SharedModule.forRoot(),
        FilterPipeModule,
        routing,
        FormsModule
    ],
    entryComponents: [CambioSedeModalNavComponent],
    declarations: [NavbarComponent, TurnoComponent, ClockComponent, CambioSedeModalNavComponent],
    exports: [NavbarComponent]
})
export class NavbarModule {
}
