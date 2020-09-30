import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
/**
 * Service
 */
import { TurnoExtraService } from '../../core/service/turno-service/turno-extra.service';
import { TurnoExtraServiceFake } from '../../core/service/turno-service/turno-extra-service.fake.service';
/**
 * Component
 */
import { OperatoreComponent } from './operatore/operatore.component';
import { UnitaOperativaComponent } from './unita-operativa/unita-operativa.component';
import { ClockComponent } from './clock/clock.component';
import { NavbarComponent } from './navbar.component';
import { TurnoComponent } from './turno/turno.component';
import { AnnuncioNuovaVersioneModalComponent } from '../../shared/modal/annuncio-nuova-versione-modal/annuncio-nuova-versione-modal.component';
import { NuoveFeaturesInfoModalComponent } from '../../shared/modal/nuove-features-info-modal/nuove-features-info-modal.component';
/**
 * Module
 */
import { SharedModule } from '../../shared/shared.module';
import { FilterPipeModule } from 'ngx-filter-pipe';
/**
 * Ngxs
 */
import { NgxsModule } from '@ngxs/store';
/**
 * Ngxs State
 */
import { TurnoState } from './store/states/turno.state';
import { NavbarState } from './store/states/navbar.state';

@NgModule({
    imports: [
        CommonModule,
        NgbModule,
        SharedModule.forRoot(),
        BrowserAnimationsModule,
        FilterPipeModule,
        FormsModule,
        RouterModule,
        NgxsModule.forFeature(
            [
                NavbarState,
                TurnoState
            ]
        ),
    ],
    declarations: [
        NavbarComponent,
        TurnoComponent,
        ClockComponent,
        OperatoreComponent,
        UnitaOperativaComponent
    ],
    entryComponents: [
        AnnuncioNuovaVersioneModalComponent,
        NuoveFeaturesInfoModalComponent
    ],
    exports: [NavbarComponent],
    providers: [
        { provide: TurnoExtraService, useClass: TurnoExtraServiceFake },
    ]
})
export class NavbarModule {
}
