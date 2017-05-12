import {Injectable} from '@angular/core';
import {BaThemeConfigProvider, colorHelper} from '../../../theme';

@Injectable()
export class PieChartService {

  constructor(private _baConfig:BaThemeConfigProvider) {
  }

  getData() {
    let pieColor = this._baConfig.get().colors.custom.dashboardPieChart;
    return [
      {
        color: pieColor,
        ////description: 'dashboard.new_visits',
        description: 'dashboard.chiamate',
        subdescription: 'dashboard.chiamateincoda',
        stats: '15',
        subdescription1: 'dashboard.interventiincorso',        
        stats1: '5',
        ////icon: 'person',
        icon: 'chiamata',        
      }, {
        color: pieColor,
        ////description: 'dashboard.purchases',
        description: 'dashboard.mezzi',
        subdescription: 'dashboard.mezziimpegnati',        
        stats: '4',
        subdescription1: 'dashboard.mezziinservizio',        
        stats1: '22',
        ////icon: 'money',
        icon: 'mezzo',        
      }, {
        color: pieColor,
        ////description: 'dashboard.active_users',
        description: 'dashboard.squadre',
        subdescription: 'dashboard.squadreimpegnate',        
        stats: '3',
        subdescription1: 'dashboard.squadreinservizio',                
        stats1: '5',
        ////icon: 'face',
        icon: 'squadra',        
      }, {
        color: pieColor,
        ////description: 'dashboard.returned',
        description: 'dashboard.meteo',        
        subdescription: 'dashboard.previsionedeltempo',
        stats: '',
        subdescription1: 'dashboard.vuoto',                
        stats1: '',
        ////icon: 'refresh',
        icon: 'meteo',        
      }
    ];
  }
}
