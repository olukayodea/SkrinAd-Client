import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { Counts } from 'src/app/_models/data';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit, OnChanges {
  @Input() url: string;
  @Input() counts: Counts;

  @Output() refresh = new EventEmitter<any>();

  queryParams: Params;

  first: number;
  last: number;
  prev: number = 0;
  next: number = 0;

  range: number[] = [];

  link: string;

  constructor(
    private activatedRoute: ActivatedRoute,
  ) {
    this.getRouteParams();
  }

  ngOnInit(): void {
    this.drawPage();

    var split = this.url.split("?");
    this.link = "/"+split[0];

  }

  drawPage() {
    this.range = [];
    if (this.counts !== undefined) {
      if (this.counts.currentPage <= 3) {
        if (this.counts.totalPage < 5) {
          this.first = 1;
          this.last = this.counts.totalPage;
        } else {
          this.first = 1;
          this.last = 5;
        }
      } else if (this.counts.currentPage < (this.counts.totalPage - 2)) {
        this.first = +this.counts.currentPage - 2;
        this.last = +this.counts.currentPage + 2;
      } else if (this.counts.currentPage <= this.counts.totalPage) {
        if (this.counts.currentPage == this.counts.totalPage) {
          if (this.counts.currentPage <= 5) {
            this.first = 1;
          } else {
            this.first = this.counts.currentPage - 4;
          }
          this.last = +this.counts.totalPage;
        } else {
          this.first = +this.counts.currentPage - 2;
          this.last = +this.counts.totalPage;
        }
      }

      if (this.counts.currentPage > 0) {
        this.prev = +this.counts.currentPage - 1;
        this.next = +this.counts.currentPage + 1;
      }
      for (let i = this.first; i <= this.last; i++) {
        this.range.push(i);
      }
    }
  }

  route(value:number) {
    this.refresh.next(value);
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    this.ngOnInit();
  }
  
  getRouteParams() {
    // URL query parameters
    this.activatedRoute.queryParams.subscribe( params => {
        this.queryParams = params;
    });
  }
}
