import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GlobalService } from '../../core/services/global.service';
import { Tbl_cargo_imp_pickup } from '../models/tbl_cargo_imp_pickup';
import { DeliveryOrderService } from '../services/deliveryorder.service';

@Component({
  selector: 'app-deliveryorder-list',
  templateUrl: './deliveryorder-list.component.html'
})
export class DeliveryOrderListComponent implements OnInit {

  errorMessage: string;
   parentid: string;
   pickCategory: string;

   menuid: string;
   title: string;
   isAdmin: boolean;
   canAdd: boolean;
   canEdit: boolean;
   canSave: boolean;

 
  records: Tbl_cargo_imp_pickup[]

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    public mainservice: DeliveryOrderService
  ) { }

  ngOnInit() {
   
    const options = JSON.parse(this.route.snapshot.queryParams.parameter);
    this.menuid = options.menuid;
    this.parentid = options.parentid;
    this.pickCategory = options.pickCategory;
    this.isAdmin = this.gs.IsAdmin(this.menuid);
    this.title = this.gs.getTitle(this.menuid);
    this.canAdd = this.gs.canAdd(this.menuid);
    this.canEdit = this.gs.canEdit(this.menuid);

    this.List('SCREEN');
  }
 

  List(action: string = '') {
    var SearchData = this.gs.UserInfo;
    SearchData.parentid = this.parentid;
    
    this.mainservice.GeneralList(SearchData).subscribe(response => {
      this.records = response.list;
      
    }, error => {
      this.errorMessage = this.gs.getError(error)
    });
  }
  

  NewRecord() {
    if (!this.canAdd) {
      alert('Insufficient User Rights')
      return;
    }

    let parameter = {
      menuid: this.menuid,
      pkid: '',
      mode: 'ADD',
      parentid : this.parentid,
      pickCategory : this.pickCategory,
      origin: 'oth-deliveryorder-page'
    };
    this.gs.Naviagete('Silver.Other.Trans/DeliveryOrderEdit', JSON.stringify(parameter));

  }

  edit(_record: Tbl_cargo_imp_pickup) {
    if (!this.canEdit) {
      alert('Insufficient User Rights')
      return;
    }

    let parameter = {
      menuid: this.menuid,
      pkid: _record.pick_pkid,
      mode: 'EDIT',
      parentid : _record.pick_parentid,
      pickCategory : this.pickCategory,
      origin: 'oth-deliveryorder-page',
    };
    this.gs.Naviagete('Silver.Other.Trans/DeliveryOrderEdit', JSON.stringify(parameter));
  }

  Close() {
    this.location.back();
  }



}
