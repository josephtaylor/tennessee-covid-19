import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import * as xlsx from 'xlsx';
import { DailyCase } from './daily-case.model';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable()
export class DailyCaseService {
  private static readonly DAILY_CASE_SHEET_NAME = 'ALL_DAILY_CASE_INFO_PUBLIC';
  private static readonly COUNTY_SHEET_NAME = 'ALL_COUNTY_FINAL_PUBLIC';

  private dailyCaseData = new Map<string, DailyCase[]>();
  private dailyCaseEmitter = new EventEmitter<Map<string, DailyCase[]>>();
  private dailyCaseData$ = this.dailyCaseEmitter.asObservable();

  constructor(private http: HttpClient) {
    forkJoin([
      this.loadStatewideData(),
      this.loadCountyLevelData()
    ]).subscribe(results => {
      const rows = results[0].concat(results[1]);
      for (const row of rows) {
        if (!row.COUNTY) {
          row.COUNTY = 'State of Tennessee';
        }
        if (!this.dailyCaseData.get(row.COUNTY)) {
          this.dailyCaseData.set(row.COUNTY, [row]);
        } else {
          this.dailyCaseData.set(
            row.COUNTY,
            this.dailyCaseData.get(row.COUNTY).concat(row));
        }
      }
      this.dailyCaseEmitter.emit(this.dailyCaseData);
    });
  }

  getDailyCases(): Observable<Map<string, DailyCase[]>> {
    return this.dailyCaseData$;
  }

  private loadStatewideData(): Observable<DailyCase[]> {
    return this.http.get('/assets/Public-Dataset-Daily-Case-Info.XLSX', {responseType: 'arraybuffer'})
      .pipe(map(result => {
        const workbook = xlsx.read(result, {type: 'array'});
        return xlsx.utils.sheet_to_json(
          workbook.Sheets[DailyCaseService.DAILY_CASE_SHEET_NAME],
          {
            raw: true,
            defval: null
          }) as DailyCase[];
      }));
  }

  private loadCountyLevelData(): Observable<DailyCase[]> {
    return this.http.get('/assets/Public-Dataset-County-New.XLSX', {responseType: 'arraybuffer'})
      .pipe(map(result => {
        const workbook = xlsx.read(result, {type: 'array'});
        return xlsx.utils.sheet_to_json(
          workbook.Sheets[DailyCaseService.COUNTY_SHEET_NAME],
          {
            raw: true,
            defval: null
          }) as DailyCase[];
      }));
  }
}
