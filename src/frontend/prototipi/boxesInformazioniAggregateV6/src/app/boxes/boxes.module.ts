import {NgModule} from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {CommonModule} from '@angular/common';
import {BoxFunzionariComponent} from './info-aggregate/box-funzionari/box-funzionari.component';
import {BoxInterventiComponent} from './info-aggregate/box-interventi/box-interventi.component';
import {BoxMezziComponent} from './info-aggregate/box-mezzi/box-mezzi.component';
import {BoxMeteoComponent} from './info-aggregate/box-meteo/box-meteo.component';
import {PipeModule} from '../shared/pipes/pipe.module';
import {InfoAggregateComponent} from './info-aggregate/info-aggregate.component';

@NgModule({
    imports: [
        CommonModule,
        NgbModule,
        PipeModule.forRoot(),
    ],
    declarations: [
        InfoAggregateComponent,
        BoxFunzionariComponent,
        BoxInterventiComponent,
        BoxMezziComponent,
        BoxMeteoComponent],
    exports: [
        InfoAggregateComponent,
        BoxFunzionariComponent,
        BoxInterventiComponent,
        BoxMezziComponent,
        BoxMeteoComponent
    ]
})
export class BoxesModule {

}
