import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {PipeModule} from './pipes/pipe.module';
import * as Shared from './index';

@NgModule({
    imports: [
        CommonModule,
        NgbModule,
        PipeModule
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
