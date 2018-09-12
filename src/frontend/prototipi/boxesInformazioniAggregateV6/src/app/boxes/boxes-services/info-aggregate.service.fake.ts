import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {catchError, retry} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InfoAggregatServiceFake {

  constructor() { }

}
