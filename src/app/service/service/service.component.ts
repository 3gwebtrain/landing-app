import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {ForecastService, OpenWeatherResponse} from 'src/app/weather/forecast.service';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css']
})
export class ServiceComponent implements OnInit {

  forecast$: Observable<{dateString: string; temp: number;}[]>;
  newForecast$: Observable<OpenWeatherResponse[]>;

  constructor(private forecastService: ForecastService) {
    this.forecast$ = this.forecastService.getForecast();
    this.newForecast$ = this.forecastService.entities$;
  }

  ngOnInit() {
    this.forecastService.entities$.subscribe(data => console.log('cache', data));
  }

}
