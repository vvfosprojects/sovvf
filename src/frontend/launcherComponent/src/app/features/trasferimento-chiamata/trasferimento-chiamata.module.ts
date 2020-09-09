import { TrasferimentoChiamataComponent } from './trasferimento-chiamata.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { TreeviewModule } from 'ngx-treeview';
import { NgxsModule } from '@ngxs/store';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TrasferimentoChiamataRouting } from './trasferimento-chiamata.routing';
import { RicercaTrasferimentoChiamataComponent } from './ricerca-trasferimento-chiamata/ricerca-trasferimento-chiamata.component';
import { TabellaTrasferimentoChiamataComponent } from './tabella-trasferimento-chiamata/tabella-trasferimento-chiamata.component';
import { TrasferimentoChiamataState } from './store/states/trasferimento-chiamata/trasferimento-chiamata.state';
import { RicercaTrasferimentoChiamataState } from './store/states/ricerca-trasferimento-chiamata/ricerca-trasferimento-chiamata.state';
import { TrasferimentoChiamataModalComponent } from 'src/app/shared/modal/trasferimento-chiamata-modal/trasferimento-chiamata-modal.component';
import { ConfirmModalComponent } from '../../shared/modal/confirm-modal/confirm-modal.component';


@NgModule({
  declarations: [
      TrasferimentoChiamataComponent,
      RicercaTrasferimentoChiamataComponent,
      TabellaTrasferimentoChiamataComponent
  ],
  imports: [
      CommonModule,
      TrasferimentoChiamataRouting,
      TreeviewModule.forRoot(),
      SharedModule.forRoot(),
      NgxsModule.forFeature([
        TrasferimentoChiamataState,
        RicercaTrasferimentoChiamataState
      ]),
      NgxsFormPluginModule.forRoot(),
      FormsModule,
      NgSelectModule,
      NgxPaginationModule,
      NgbModule
  ],
  entryComponents: [
      TrasferimentoChiamataModalComponent,
      ConfirmModalComponent
  ],
  providers: []
})

export class TrasferimentoChiamataModule { }
