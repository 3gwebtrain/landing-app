import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {filter, map, mergeMap, pluck, switchMap, toArray, share, tap, catchError, retry} from 'rxjs/operators';
import {NotificationsService} from '../notifications/notifications.service';

interface OpenWeatherResponse {
  list: {
    dt_txt: string;
    main: {
      temp: number;
    }
  }[]
}

@Injectable({
  providedIn: 'root'
})
export class ForecastService {

  private url = 'https://api.openweathermap.org/data/2.5/forecast';

  constructor(private http: HttpClient, private notificationService: NotificationsService) { }

  getForecast() {
    return this.getCurrentLocation()
      .pipe(
        map(coords => {
          return new HttpParams()
            .set('lat', String(coords.latitude))
            .set('lon', String(coords.longitude))
            .set('units', 'metrics')
            .set('appid', '21ef99128f486ce0cb0f0612b7c2d567')
        }),
        switchMap(params => this.http.get<OpenWeatherResponse>(this.url, {params})),
        pluck('list'),
        mergeMap(value => of(...value)),
        filter((value, index) => index % 8 === 0),
        map(value => {
          return {
            dateString: value.dt_txt,
            temp: value.main.temp
          }
        }),
        toArray(),
        share()
      ) 
  }

  getCurrentLocation() {
    return new Observable<GeolocationCoordinates>(observer => {
      console.log('trhing');
      window.navigator.geolocation.getCurrentPosition(
        position => {
          observer.next(position.coords);
          observer.complete();
        },
        err => observer.error(err)
      )
    }).pipe(
      retry(1),
      tap({
        next: () => this.notificationService.addSuccess('Got your location'),
        error: catchError((err) => {
          this.notificationService.addError('Failed to get the location');
          return throwError(() => new Error(err));
        })
      }))
  }

}
