import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {PipeModule} from './pipes/pipe.module';
import * as Shared from './index';
import { NgxsModule } from '@ngxs/store';
import { UtentiState } from './store/states/lista-utenti.state';
import { UserService } from '../core/auth/_services';

@NgModule({
    imports: [
        CommonModule,
        NgbModule,
        PipeModule,
        NgxsModule.forFeature(
            [
                UtentiState
            ],
        )
    ],
    declarations: [
        Shared.DebounceClickDirective,
        Shared.DebounceKeyUpDirective,
        Shared.ComponenteComponent,
        Shared.CompetenzaComponent,
        Shared.MezzoComponent,
        Shared.LoaderComponent
    ],
    exports: [
        Shared.DebounceClickDirective,
        Shared.DebounceKeyUpDirective,
        Shared.ComponenteComponent,
        Shared.CompetenzaComponent,
        Shared.MezzoComponent,
        Shared.LoaderComponent
    ],
    providers: [
        UserService
    ]
})
export class SharedModule {

    static forRoot() {
        return {
            ngModule: SharedModule,
            providers: [],
        };
    }
}
