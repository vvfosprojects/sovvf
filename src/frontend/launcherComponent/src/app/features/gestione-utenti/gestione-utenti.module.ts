import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {FilterPipeModule} from 'ngx-filter-pipe';
/**
 * Component
 */
import { GestioneUtentiComponent } from './gestione-utenti.component';
import { ListaUtentiComponent } from './lista-utenti/lista-utenti.component';
/**
 * Routing
 */
import { GestioneUtentiRouting } from './gestione-utenti.routing';

@NgModule({
  declarations: [GestioneUtentiComponent, ListaUtentiComponent],
  imports: [
    CommonModule,
    FormsModule,
    GestioneUtentiRouting,
    NgbModule,
    FilterPipeModule
  ]
})
export class GestioneUtentiModule { }
