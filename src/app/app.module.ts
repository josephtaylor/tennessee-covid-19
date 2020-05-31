import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { BarChartComponent } from './chart/bar-chart.component';
import { DailyCaseService } from './stats/daily-case/daily-case.service';
import { ChartsModule } from 'ng2-charts';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    BarChartComponent
  ],
  imports: [
    BrowserModule,
    ChartsModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    FormsModule
  ],
  providers: [
    DailyCaseService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
