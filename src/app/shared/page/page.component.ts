import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';

@Component({
  selector: 'App-Page',
  templateUrl: './page.component.html'
})
export class PageComponent implements OnInit {

  @Input()  public PageData: {page_count: number, page_current : number, page_rows : number, page_rowcount : number };
  @Output() PageEvents = new EventEmitter<any>();

  goto_page_no : number;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(){
    this.goto_page_no = this.PageData.page_current;
    if( this.goto_page_no <=0)
      this.goto_page_no =null;    
  }
  

  List(outputformat : string , action : string  ){


    var oldPage = this.PageData.page_current;
    if (this.PageData.page_current == -1)
      return;

    if (action == 'FIRST') {
      this.PageData.page_current = 1;
      this.goto_page_no = this.PageData.page_current;
    }
    else if (action == 'PREV') {
      this.PageData.page_current--;
      this.goto_page_no = this.PageData.page_current;
    }
    else if (action == 'NEXT') {
      this.PageData.page_current++;
      this.goto_page_no = this.PageData.page_current;
    }
    else if (action == 'LAST') {
      this.PageData.page_current = this.PageData.page_count;
      this.goto_page_no = this.PageData.page_current;
    }      
    else if (action == 'GOTO') {
      if (this.goto_page_no == null || this.goto_page_no == undefined )
        return;
      if (this.goto_page_no <= 0)
        this.goto_page_no = 1;

      if (this.goto_page_no > this.PageData.page_count)
        this.goto_page_no = this.PageData.page_count;
      this.PageData.page_current = this.goto_page_no; 
    }       

    if (this.PageData.page_current <= 0)
      this.PageData.page_current = 1;
    
      if (this.PageData.page_current > this.PageData.page_count)
      this.PageData.page_current = this.PageData.page_count;
    
      if (this.PageData.page_current == oldPage)
      return;

      
    this.PageEvents.emit({outputformat:outputformat,action:action,page_current:this.PageData.page_current});
  }

}
