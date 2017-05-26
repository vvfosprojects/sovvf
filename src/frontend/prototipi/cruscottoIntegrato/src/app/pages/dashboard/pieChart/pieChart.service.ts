import { Injectable } from '@angular/core';
import { BaThemeConfigProvider, colorHelper } from '../../../theme';
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

@Injectable()
export class PieChartService {
  private observableArray: BehaviorSubject<any[]>;
  private array: any[];

  constructor(private _baConfig: BaThemeConfigProvider) {
    this.array = this.getOriginalArray();
    this.observableArray = new BehaviorSubject(this.array);

    this.updateIndicatori();
  }

  getData(): Observable<any[]> {
    return this.observableArray.asObservable();
  }

  updateIndicatori() {
    let rnd = Math.random();
    if (rnd > .3) {
      let idx = Math.floor(Math.random() * 3);
      Math.random() > .5 ? this.array[idx].stats++ : this.array[idx].stats--;
      if (this.array[idx].stats < 0)
        this.array[idx].stats = 2;
      this.observableArray.next(this.array);
    }

    setTimeout(() => {
      this.updateIndicatori();
    }, 1000);
  }

  getOriginalArray() {
    //let pieColor = this._baConfig.get().colors.custom.dashboardPieChart;
    return [
      {
        color: "#920000",
        ////description: 'dashboard.new_visits',
        //description: 'dashboard.chiamate',
        subdescription: 'dashboard.chiamateincoda',
        stats: '15',
        subdescription1: 'dashboard.interventiincorso',
        stats1: '5',
        ////icon: 'person',
        icon: 'chiamata',
        chartValue: () => 7
      }, {
        color: "#92F000",
        ////description: 'dashboard.purchases',
        //description: 'dashboard.mezzi',
        subdescription: 'dashboard.mezziimpegnati',
        stats: '4',
        subdescription1: 'dashboard.mezziinservizio',
        stats1: '22',
        ////icon: 'money',
        icon: 'mezzo',
        chartValue: () => 6
      }, {
        color: "#92F000",
        ////description: 'dashboard.active_users',
        //description: 'dashboard.squadre',
        subdescription: 'dashboard.squadreimpegnate',
        stats: '3',
        subdescription1: 'dashboard.squadreinservizio',
        stats1: '5',
        ////icon: 'face',
        icon: 'squadra',
        chartValue: () => 6
      }, {
        color: "#920000",
        ////description: 'dashboard.returned',
        description: 'dashboard.meteo',
        subdescription: 'dashboard.previsionedeltempo',
        stats: '',
        subdescription1: 'dashboard.vuoto',
        stats1: '',
        ////icon: 'refresh',
        icon: 'meteo',
        chartValue: () => 6
      }
    ];
  }
}
