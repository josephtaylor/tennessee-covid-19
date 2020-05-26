import { Component } from '@angular/core';
import { ChartData } from './chart/chart-data.model';
import { DailyCase } from './stats/daily-case/daily-case.model';
import { DailyCaseService } from './stats/daily-case/daily-case.service';
import { TimeUtil } from './util/time.util';

@Component({
  selector: 'tn-covid-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'tennessee-covid';

  dailyCases: DailyCase[];

  cases: ChartData;
  deaths: ChartData;
  recoveries: ChartData;
  activeCases: ChartData;

  constructor(private dailyStatService: DailyCaseService) {
    dailyStatService.getDailyCases().subscribe(dailyCases => {
      this.dailyCases = dailyCases;
      this.cases = {
        title: 'New Cases Per Day',
        dataSets: [{
          data: this.dailyCases.map(dailyCase => dailyCase.NEW_CASES)
        }],
        labels: this.dailyCases.map(this.dateOf),
        color: 'rgba(0, 100, 255, 0.6)'
      };
      this.deaths = {
        title: 'New Deaths Per Day',
        dataSets: [{
          data: this.dailyCases.map(dailyCase =>
            dailyCase.NEW_DEATHS < 0 ? 0 : dailyCase.NEW_DEATHS)
        }],
        labels: this.dailyCases.map(this.dateOf),
        color: 'rgba(255, 0, 0, 0.6)'
      };
      this.recoveries = {
        title: 'New Recoveries Per Day',
        dataSets: [{
          data: this.dailyCases.map(dailyCase => dailyCase.NEW_RECOVERED)
        }],
        labels: this.dailyCases.map(this.dateOf),
        color: 'rgba(0, 169, 0, 0.6)'
      };
      this.activeCases = {
        title: 'Active Cases',
        dataSets: [{
          data: this.dailyCases.map(dailyCase => dailyCase.TOTAL_ACTIVE),
          label: 'Active Cases'
        }],
        labels: this.dailyCases.map(this.dateOf),
        color: 'rgba(0, 100, 255, 0.6)'
      };
    });
  }

  private dateOf(dailyCase: DailyCase): string {
    return TimeUtil.toDate(dailyCase.DATE).toLocaleDateString();
  }
}
