import { Component, ViewChild } from '@angular/core';
import { ChartData } from './chart/chart-data.model';
import { DailyCase } from './stats/daily-case/daily-case.model';
import { DailyCaseService } from './stats/daily-case/daily-case.service';
import { TimeUtil } from './util/time.util';
import { merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { NgbTypeahead, NgbTypeaheadSelectItemEvent } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'tn-covid-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'tennessee-covid-19';

  @ViewChild('countySelect', {static: true})
  countySelect: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  dailyCaseData: Map<string, DailyCase[]>;

  counties: string[];

  selectedCounty = '';

  cases: ChartData;
  deaths: ChartData;
  recoveries: ChartData;
  activeCases: ChartData;

  constructor(private dailyStatService: DailyCaseService) {
    dailyStatService.getDailyCases().subscribe(dailyCaseData => {
      this.dailyCaseData = dailyCaseData;
      this.buildCountyList();
      this.loadData(this.selectedCounty);
    });
  }

  searchCounties = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.countySelect.isPopupOpen()));
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.counties :
        this.counties.filter(v => v.toLowerCase().startsWith(term.toLowerCase())))
        .slice(0, 15))
    );
  }

  handleSelectedCounty(selectedItem: NgbTypeaheadSelectItemEvent) {
    this.loadData(selectedItem.item);
  }

  clearCounty() {
    this.countySelect.writeValue('');
    this.selectedCounty = '';
    this.loadData('');
  }

  private buildCountyList() {
    this.counties = [...this.dailyCaseData.keys()];
    this.counties = this.counties.sort((a, b) => {
      if (a === 'State of Tennessee') {
        return -1;
      }
      return a.localeCompare(b);
    });
    this.counties.shift();
  }

  private loadData(county: string) {
    if (county === '') {
      county = 'State of Tennessee';
    }
    this.cases = {
      title: 'New Cases Per Day',
      dataSets: [{
        data: this.dailyCaseData.get(county).map(dailyCase =>
          dailyCase.NEW_CASES < 0 ? 0 : dailyCase.NEW_CASES)
      }],
      labels: this.dailyCaseData.get(county).map(this.dateOf),
      color: 'rgba(0, 100, 255, 0.6)'
    };
    this.deaths = {
      title: 'New Deaths Per Day',
      dataSets: [{
        data: this.dailyCaseData.get(county).map(dailyCase =>
          dailyCase.NEW_DEATHS < 0 ? 0 : dailyCase.NEW_DEATHS)
      }],
      labels: this.dailyCaseData.get(county).map(this.dateOf),
      color: 'rgba(255, 0, 0, 0.6)'
    };
    this.recoveries = {
      title: 'New Recoveries Per Day',
      dataSets: [{
        data: this.dailyCaseData.get(county).map(dailyCase =>
          dailyCase.NEW_RECOVERED < 0 ? 0 : dailyCase.NEW_RECOVERED)
      }],
      labels: this.dailyCaseData.get(county).map(this.dateOf),
      color: 'rgba(0, 169, 0, 0.6)'
    };
    this.activeCases = {
      title: 'Active Cases',
      dataSets: [{
        data: this.dailyCaseData.get(county).map(dailyCase =>
          dailyCase.TOTAL_ACTIVE < 0 ? 0 : dailyCase.TOTAL_ACTIVE),
        label: 'Active Cases'
      }],
      labels: this.dailyCaseData.get(county).map(this.dateOf),
      color: 'rgba(0, 100, 255, 0.6)'
    };
  }

  private dateOf(dailyCase: DailyCase): string {
    return TimeUtil.toDate(dailyCase.DATE).toLocaleDateString();
  }
}
