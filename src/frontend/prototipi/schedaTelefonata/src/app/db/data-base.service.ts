import { Injectable } from '@angular/core';
import { Http, Headers, Response } from "@angular/http";
import 'rxjs/Rx';
import { Observable } from "rxjs";

@Injectable()
export class DataBaseService {

  cercaChiamataURL = "http://www.xxxx.com"; //TODO

  constructor(private _http: Http) { }

}
