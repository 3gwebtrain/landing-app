import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {tap, map, switchMap, pluck} from 'rxjs/operators';
import {HttpParams, HttpClient} from '@angular/common/http';

export interface Articles {
  title: string;
  url: string;
  source: {
    name: string
  }
}

interface NewsApiResponse {
  totalResults: number;
  articles: Articles[]
}

@Injectable({
  providedIn: 'root'
})
export class NewsApiService {

  private url = "https://newsapi.org/v2/top-headlines";
  private pageSize = 10;
  private apiKey = 'fb57309071404c7daa5464f5bc474824';
  private country = 'us';

  private pageInput: Subject<number>;
  pageOutput: Observable<Articles[]>;
  numberOfPages: Subject<number>;

  constructor(private http: HttpClient) {
    this.numberOfPages = new Subject();
    this.pageInput = new Subject();
    this.pageOutput = this.pageInput.pipe(map((page) => {
      return new HttpParams()
        .set('apiKey', this.apiKey)
        .set('country', this.country)
        .set('pageSize', this.pageSize)
        .set('page', page);
    }),
      switchMap((params) => {
        return this.http.get<NewsApiResponse>(this.url, {params})
      }),
      tap(response => {
        const totalPages = Math.ceil(response.totalResults / this.pageSize);
        this.numberOfPages.next(totalPages);
      }),
      pluck('articles')
    )
  }

  getPage(page: number) {
    this.pageInput.next(page);
  }
}
