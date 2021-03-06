import {Component} from '@angular/core';
import {NewsApiService, Articles} from '../news-api.service';

@Component({
  selector: 'app-na-article-list',
  templateUrl: './na-article-list.component.html',
  styleUrls: ['./na-article-list.component.css']
})
export class NaArticleListComponent {

  articles: Articles[] = [];

  constructor(private newsApiService: NewsApiService) {
    this.newsApiService.pageOutput.subscribe((articles) => {
      this.articles = articles;
    });
    this.newsApiService.getPage(1);
  }

}
