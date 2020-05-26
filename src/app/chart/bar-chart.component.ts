import { Component, Input, OnInit } from '@angular/core';
import { ChartOptions } from 'chart.js';
import { Color } from 'ng2-charts';
import { ChartData } from './chart-data.model';

@Component({
  selector: 'tn-covid-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnInit {
  @Input()
  chartData: ChartData;

  colors: Color[];
  options: ChartOptions;

  ngOnInit(): void {
    this.colors = [
      {
        backgroundColor: this.chartData.color
      }
    ];
    this.options = {
      responsive: true,
      title: {
        display: true,
        text: this.chartData.title
      },
      legend: {
        display: false
      }
    };
  }
}
