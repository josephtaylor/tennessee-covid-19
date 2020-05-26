import { EventEmitter, Injectable, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import * as xlsx from 'xlsx';
import { DailyCase } from "./daily-case.model";
import { Observable } from "rxjs";


@Injectable()
export class DailyCaseService implements OnInit {
  private dailyCases = new EventEmitter<DailyCase[]>();
  private dailyCases$ = this.dailyCases.asObservable();

  constructor(private http: HttpClient) {
    this.http.get('/assets/Public-Dataset-Daily-Case-Info.XLSX', {responseType: "arraybuffer"})
      .subscribe(result => {
        const workbook = xlsx.read(result, {type: 'array'});
        const rows: DailyCase[] = xlsx.utils.sheet_to_json(
          workbook.Sheets["ALL_DAILY_CASE_INFO_PUBLIC"],
          {
            raw: true,
            defval: null
          });
        this.dailyCases.emit(rows);
      });
  }

  getDailyCases(): Observable<DailyCase[]> {
    return this.dailyCases$;
  }

  ngOnInit(): void {

  }
}
