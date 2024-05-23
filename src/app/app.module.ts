import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CorrelationGraphComponent } from './correlation-graph/correlation-graph.component';
import { CorrelationGraphDataService } from './correlation-graph-data/correlation-graph-data.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    CorrelationGraphComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [CorrelationGraphDataService,],
  bootstrap: [AppComponent]
})
export class AppModule { }
