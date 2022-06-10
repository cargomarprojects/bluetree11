import { Component, OnInit, Input, OnDestroy, SimpleChange } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GlobalService } from '../../core/services/global.service';
import { Tbl_wh_productm } from '../models/Tbl_wh_productm';
import { SearchQuery } from '../models/Tbl_wh_productm';
import { PageQuery } from '../../shared/models/pageQuery';
import { WhProductService } from '../services/whproductm.service';

@Component({
  selector: 'app-wh-product',
  templateUrl: './wh-product.component.html'
})
export class WhProductComponent implements OnInit {

  modal: any;
  public pkid: string = "";
  public mode: string = "";

  errorMessage$: Observable<string>;
  records$: Observable<Tbl_wh_productm[]>;
  pageQuery$: Observable<PageQuery>;
  searchQuery$: Observable<SearchQuery>;

  constructor(
    private modalconfig: NgbModalConfig,
    private modalservice: NgbModal,
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    public mainservice: WhProductService
  ) {
    modalconfig.backdrop = 'static'; //true/false/static
    modalconfig.keyboard = true; //true Closes the modal when escape key is pressed
  }

  ngOnInit() {
    this.gs.checkAppVersion();
    this.mainservice.init(this.route.snapshot.queryParams);
    this.initPage();
  }

  initPage() {

    this.records$ = this.mainservice.data$.pipe(map(res => res.records));
    this.searchQuery$ = this.mainservice.data$.pipe(map(res => res.searchQuery));
    this.pageQuery$ = this.mainservice.data$.pipe(map(res => res.pageQuery));
    this.errorMessage$ = this.mainservice.data$.pipe(map(res => res.errormessage));

  }

  searchEvents(actions: any) {
    this.mainservice.Search(actions, 'SEARCH');
  }

  pageEvents(actions: any) {
    this.mainservice.Search(actions, 'PAGE');
  }

  NewRecord(editmodal: any = null) {
    if (!this.mainservice.canAdd) {
      alert('Insufficient User Rights')
      return;
    }
   
    // let parameter = {
    //   appid: this.gs.appid,
    //   menuid: this.mainservice.menuid,
    //   pkid: '',
    //   type: '',
    //   origin: 'wh-product-page',
    //   mode: 'ADD'
    // };
    // this.gs.Naviagete2('warehouse/WhProductEditPage', parameter);

    this.pkid = '';
    this.mode = 'ADD';
    this.modal = this.modalservice.open(editmodal, { centered: true });

  }

  edit(_record: Tbl_wh_productm, editmodal: any = null) {
    if (!this.mainservice.canEdit) {
      alert('Insufficient User Rights')
      return;
    }
    // let parameter = {
    //   appid: this.gs.appid,
    //   menuid: this.mainservice.menuid,
    //   pkid: _record.prod_pkid,
    //   type: '',
    //   origin: 'wh-product-page',
    //   mode: 'EDIT'
    // };
    // this.gs.Naviagete2('warehouse/WhProductEditPage', parameter);

    this.pkid =  _record.prod_pkid;
    this.mode = 'EDIT';
    this.modal = this.modalservice.open(editmodal, { centered: true });
  }

  Close() {
    this.location.back();
  }
  CloseModal() {
    this.modal.close();
  }

}
