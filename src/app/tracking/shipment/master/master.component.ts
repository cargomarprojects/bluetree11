
import { Component, OnInit, Input,Output, EventEmitter, OnDestroy, SimpleChange } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GlobalService } from '../../../core/services/global.service';
import { ShipmentService } from '../../services/shipment.service';
import { _USER_RUNTIME_CHECKS } from '@ngrx/store/src/tokens';


@Component({
  selector: 'app-master-records',
  templateUrl: './master.component.html',
  styleUrls: ['./master.component.css']

})
export class MasterComponentRecords implements OnInit {

  // 21-04-2021 Created By joy

  public records = [];
  public cntrs = [];
  public house = [];

  errorMessage = "";

  private _pkid: string;
  @Input() set pkid(value: string) {
    this._pkid = value;
    if ( value != null)
      this.List();
  }

  get pkid (){
    return this._pkid;
  }


  @Output() CloseEvent = new EventEmitter<string>();


  constructor(
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    public mainservice: ShipmentService
  ) { }

  ngOnInit() {
  }

  List(){
      
      var SearchData = this.gs.UserInfo;
      SearchData.pkid = this.pkid;
      SearchData.USER_CATEGORY = this.gs.User_Category;
      SearchData.USER_ROLE = this.gs.User_Role;
      SearchData.USER_ISPARENT = this.gs.User_isParent;
      SearchData.USER_CUSTOMER_ID = this.gs.User_Customer_Id;
      SearchData.USER_PARENT_ID = this.gs.User_Customer_Parent_Id;

      this.mainservice.getMasterDetails(SearchData).subscribe(response => {
        
        this.records =  response.master;
        this.cntrs =  response.cntr;
        this.house =  response.house;

      }, error => {
         this.errorMessage  = this.gs.getError(error);
         alert( this.errorMessage);
      });
  }
  

  Close() {
    this.CloseEvent.emit('CLOSE');
  }

 
}
