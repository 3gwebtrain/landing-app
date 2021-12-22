import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {ForecastService, OpenWeatherResponse} from '../forecast.service';


@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.css']
})
export class ForecastComponent implements OnInit {

  forecast$: Observable<{dateString: string; temp: number;}[]>;
  newForecast$: Observable<OpenWeatherResponse[]>;
  loading$: Observable<boolean>;

  constructor(private forecastService: ForecastService) {
    this.forecast$ = this.forecastService.getForecast();
    this.newForecast$ = this.forecastService.entities$;
    this.loading$ = this.forecastService.loading$;
    console.log('tst');
  }

  ngOnInit() {
    this.forecastService.getAll().subscribe((data: any) => this.newForecast$ = data);
  }

}
