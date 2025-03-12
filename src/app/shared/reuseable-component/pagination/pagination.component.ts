import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Pagination, PaginationQueryParams } from '../../../core/models/Pagination.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  imports: [FormsModule, CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent implements OnInit{
  @Input() pagination:Pagination={
                      currentPage: 1,
                      totalPages: 1,
                      totalDocuments: 0,
                      limit:[
                              {
                                value:5,
                              },
                              {
                                value:10,
                                selected: true,
                              },
                              {
                                value:15,
                              },
                      ]
                    };
  pageQueryParam:PaginationQueryParams = {page:1, limit:10};

  @Output() changePageOrSize:EventEmitter<any> = new EventEmitter<any>();

  ngOnInit(): void {
    this.pagination.limit.forEach((res:any)=>{
      if(res.selected) this.pageQueryParam.limit=res.value;
    })
    this.pageQueryParam.page=1;
    this.onUpdatePageOrSize();
  }

  onUpdatePageOrSize(){
    this.changePageOrSize.emit(this.pageQueryParam);
  }

  onChangeLimit(){
    this.pageQueryParam.page = 1;
    this.onUpdatePageOrSize();
  }

  onChangePage(pageNumber:number){
    this.pageQueryParam.page = pageNumber;
    this.onUpdatePageOrSize();
  }
}
