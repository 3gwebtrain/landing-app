import {Injectable, OnInit} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {filter, map, mergeMap, pluck, switchMap, toArray, share, tap, catchError, retry} from 'rxjs/operators';
import {NotificationsService} from '../notifications/notifications.service';
import {EntityCollectionServiceBase, EntityCollectionServiceElementsFactory} from '@ngrx/data';

export interface OpenWeatherResponse {
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
export class ForecastService extends EntityCollectionServiceBase<OpenWeatherResponse> implements OnInit {

  private url = 'https://api.openweathermap.org/data/2.5/forecast';
  httpUrlGenerator: any;
  headersParams: any;

  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory, private http: HttpClient, private notificationService: NotificationsService) {
    super('Forecast', serviceElementsFactory);
  }

  ngOnInit() {
    this.headersParams = this.getCurrentLocation().subscribe(header => {
      this.headersParams = header;
    });
  }

  override getAll(): Observable<OpenWeatherResponse[]> {


    return this.getCurrentLocation().pipe(
      map(coords => {
        return new HttpParams()
          .set('lat', String(coords.latitude))
          .set('lon', String(coords.longitude))
          .set('units', 'metrics')
          .set('appid', '21ef99128f486ce0cb0f0612b7c2d567')
      }),
      switchMap(params => this.http.get<OpenWeatherResponse[]>(this.url, {params})),
      map((value: any) => value.list),
      mergeMap((value: OpenWeatherResponse[]) => of([...value])),
      filter((value, index) => index % 8 === 0),
      map(value => value)
    )
  }

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
