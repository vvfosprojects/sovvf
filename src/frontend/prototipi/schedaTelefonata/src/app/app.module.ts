import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { FormChiamataComponent } from './form-chiamata/form-chiamata.component';
import { MultiselectDropdownModule  } from 'angular-2-dropdown-multiselect';

@NgModule({
  declarations: [
    AppComponent,
    FormChiamataComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    MultiselectDropdownModule 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
