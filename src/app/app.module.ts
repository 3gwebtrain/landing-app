import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';
import {AppComponent} from './app.component';
import {WeatherModule} from './weather/weather.module';
import {NotificationsModule} from './notifications/notifications.module';
import {NewsApiModule} from './news-api/news-api.module';
import {StoreModule} from '@ngrx/store';
import {DefaultDataServiceConfig, EntityDataModule} from '@ngrx/data';
import {entityConfig} from './entity-metadata';
import {EffectsModule} from '@ngrx/effects';
import {HomeComponent} from './home/home/home.component';
import {AppRoutingModule} from "./app-routing.module";
import { ServiceComponent } from './service/service/service.component';


const customDataServiceConfig: DefaultDataServiceConfig = {
  root: 'https://api.openweathermap.org/data/2.5/',
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ServiceComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot([]),
    AppRoutingModule,
    WeatherModule,
    NotificationsModule,
    NewsApiModule,
    StoreModule.forRoot({}, {}),
    EffectsModule.forRoot([]),
    EntityDataModule.forRoot(entityConfig)
  ],
  providers: [{provide: DefaultDataServiceConfig, useValue: customDataServiceConfig}],
  bootstrap: [AppComponent]
})
export class AppModule { }
