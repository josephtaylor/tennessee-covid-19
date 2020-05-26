import { Component, OnInit } from '@angular/core';
import { DailyCaseService } from "./stats/daily-case/daily-case.service";
import { DailyCase } from "./stats/daily-case/daily-case.model";
import { ChartDataSets, ChartOptions } from "chart.js";
import { Color } from "ng2-charts";

@Component({
  selector: 'tn-covid-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'tennessee-covid';

  dailyCases: DailyCase[];

  chartDataSets: ChartDataSets[];
  chartLabels: string[];
  chartOptions: ChartOptions;
  chartColors: Color[];

  constructor(private dailyStatService: DailyCaseService) {
    dailyStatService.getDailyCases().subscribe(dailyCases => {
      this.dailyCases = dailyCases;
      this.chartDataSets = [{
        data: this.dailyCases.map(dailyCase => {
          return dailyCase.NEW_CASES;
        }),
        label: 'NEW_CASES'
      }];
      this.chartLabels = this.dailyCases.map(dailyCase => {
        return this.toDate(dailyCase.DATE).toLocaleDateString();
      });
      this.chartColors = [
        {
          backgroundColor: 'rgba(0,100,255,0.6)'
        }
      ]
    });

    this.chartOptions = {
      responsive: true,
      title: {
        display: true,
        text: "New Cases Per Day"
      },
      legend: {
        display: false
      }
    };
  }

  private toDate(serial: number): Date {
    var utc_days  = Math.floor(serial - 25569);
    var utc_value = utc_days * 86400;
    var date_info = new Date(utc_value * 1000);

    var fractional_day = serial - Math.floor(serial) + 0.0000001;

    var total_seconds = Math.floor(86400 * fractional_day);

    var seconds = total_seconds % 60;

    total_seconds -= seconds;

    var hours = Math.floor(total_seconds / (60 * 60));
    var minutes = Math.floor(total_seconds / 60) % 60;

    return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds);
  }
}
