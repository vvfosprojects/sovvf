import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/**
 * Component
 */
import { RubricaComponent } from './rubrica.component';
import { AddVoceRubricaModalComponent } from './add-voce-rubrica-modal/add-voce-rubrica-modal.component';
import { TabellaVociRubricaComponent } from './tabella-voci-rubrica/tabella-voci-rubrica.component';
import { VociRubricaPerPaginaComponent } from './tabella-voci-rubrica/voci-rubrica-per-pagina/voci-rubrica-per-pagina.component';
import { RisultatiPaginazioneComponent } from './tabella-voci-rubrica/risultati-paginazione/risultati-paginazione.component';
/**
 * Routing
 */
import { RubricaRouting } from './rubrica.routing';



@NgModule({
  declarations: [RubricaComponent, AddVoceRubricaModalComponent, TabellaVociRubricaComponent, VociRubricaPerPaginaComponent, RisultatiPaginazioneComponent],
  imports: [
    CommonModule,
    RubricaRouting
  ],
  entryComponents: [AddVoceRubricaModalComponent],
  providers: [
  ]
})
export class RubricaModule { }
