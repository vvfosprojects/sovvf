import { Component } from '@angular/core';

import { PieChartService } from './pieChart.service';

import 'easy-pie-chart/dist/jquery.easypiechart.js';
import { DatiBoxRiepilogo } from "app/pages/dashboard/pieChart/dati-box-riepilogo.model";

@Component({
  selector: 'pie-chart',
  templateUrl: './pieChart.html',
  styleUrls: ['./pieChart.scss']
})
// TODO: move easypiechart to component
export class PieChart {
  private datiBoxRiepilogo: DatiBoxRiepilogo;
  private _init = false;

  constructor(private _pieChartService: PieChartService) {
    this._pieChartService.getData().subscribe(value => {
      this.datiBoxRiepilogo = value;
      //this._updatePieCharts();
    });
  }

  ngAfterViewInit() {
    if (!this._init) {
      this._loadPieCharts();
      this._updatePieCharts();
      this._init = true;
    }
  }

  private _loadPieCharts() {

    jQuery('.chart').each(function () {
      let chart = jQuery(this);
      chart.easyPieChart({
        easing: 'easeOutBounce',
        onStep: function (from, to, percent) {
          jQuery(this.el).find('.percent').text(Math.round(percent));
        },
        barColor: jQuery(this).attr('data-rel'),
        trackColor: 'rgba(0,0,0,0)',
        size: 84,
        scaleLength: 0,
        animation: 2000,
        lineWidth: 9,
        lineCap: 'round',
      });
    });
  }

  private _updatePieCharts() {
    jQuery('#chartRichieste').data('easyPieChart').update(this.datiBoxRiepilogo.percentualeRichieste);
    jQuery('#chartMezzi').data('easyPieChart').update(this.datiBoxRiepilogo.percentualeMezzi);
    jQuery('#chartSquadre').data('easyPieChart').update(this.datiBoxRiepilogo.percentualeSquadre);
  }
}
