// //import { BrowserModule } from '@angular/platform-browser';
// import { NgModule } from '@angular/core';
// import { CommonModule }  from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { HttpModule } from '@angular/http';
// import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

// import { schedaContattoComponent } from './schedaContatto.component';
// import { FormschedacontattoComponent } from './formschedacontatto/formschedacontatto.component';
// import { FriendlyDatePipe } from './shared/pipes/friendly-date.pipe';
// import { FriendlyHourPipe } from './shared/pipes/friendly-hour.pipe';

// @NgModule({
//   declarations: [
//     schedaContattoComponent,
//     FormschedacontattoComponent,
//     FriendlyDatePipe,
//     FriendlyHourPipe
//   ],
//   imports: [
//     CommonModule,
//     FormsModule,
//     HttpModule,
//     NgbModule.forRoot()
//   ],
//   providers: [],
//   bootstrap: [schedaContattoComponent]
// })
// export class schedaContattoModule { }

import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule } from '@angular/forms';

import { schedaContattoComponent } from './schedaContatto.component';
import { FormschedacontattoComponent } from './formschedacontatto/formschedacontatto.component';
import { routing } from './schedaContatto.routing';
import { FriendlyDatePipe } from './shared/pipes/friendly-date.pipe';
import { FriendlyHourPipe } from './shared/pipes/friendly-hour.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    routing
  ],
  declarations: [
    schedaContattoComponent,
    FormschedacontattoComponent,
    FriendlyDatePipe,
    FriendlyHourPipe
  ]
})
export class NewModule {}