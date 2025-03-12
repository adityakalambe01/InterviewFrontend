export interface Pagination{
  currentPage: number;
  totalPages: number;
  totalDocuments: number;
  limit:
    {
      value: number;
      selected?: boolean;
    }[]
  ;
}

export class PaginationHelper implements Pagination{
  currentPage!: number;
  totalPages!: number;
  totalDocuments!: number;
  limit!: { value: number; selected?: boolean; }[];

  constructor(){
    this.currentPage = 0;
    this.totalPages = 0;
    this.totalDocuments = 0;
    this.limit = [
      { value: 5 },
      { value: 10 , selected: true},
      { value: 15 },
      { value: 20 },

    ];
  }

  set setCurrentPage(page:number){
    this.currentPage = page;
  }

  set setTotalPages(pages:number){
    this.totalPages = pages;
  }

  set setTotalDocuments(documents:number){
    this.totalDocuments = documents;
  }

  set setLimit(limits: { value: number; selected?: boolean; }[]){
    this.limit = limits;
  }

  get getPagination(){
    return {
      currentPage: this.currentPage,
      totalPages: this.totalPages,
      totalDocuments: this.totalDocuments,
      limit: this.limit
    }
  }

}

export interface PaginationQueryParams{
  page: number;
  limit: number;
}
