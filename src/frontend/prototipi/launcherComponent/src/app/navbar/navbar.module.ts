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
import { OperatoreComponent } from './operatore/operatore.component';
import { UnitaOperativaComponent } from './unita-operativa/unita-operativa.component';
import { TurnoService } from './navbar-service/turno-service/turno.service';
import { TurnoServiceFake } from './navbar-service/turno-service/turno.service.fake';
import { UnitaOperativaService } from './navbar-service/unita-operativa-service/unita-operativa.service';
import { UnitaOperativaServiceFake } from './navbar-service/unita-operativa-service/unita-operativa.service.fake';

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
    declarations: [
        NavbarComponent,
        TurnoComponent,
        ClockComponent,
        CambioSedeModalNavComponent,
        OperatoreComponent,
        UnitaOperativaComponent
    ],
    exports: [NavbarComponent],
    providers: [
        {provide: TurnoService, useClass: TurnoServiceFake},
        {provide: UnitaOperativaService, useClass: UnitaOperativaServiceFake}
    ]
})
export class NavbarModule {
}
