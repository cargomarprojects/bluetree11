import { Component, OnInit, Input, Output, EventEmitter, SimpleChange, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { GlobalService } from '../../../core/services/global.service';
import { SearchQuery, Tbl_edi_master } from '../../models/tbl_edi_master';
import { SearchTable } from '../../../shared/models/searchtable';
import { ShipDataPageService } from '../../services/shipdatapage.service';
import { InputBoxComponent } from '../../../shared/input/inputbox.component';

@Component({
  selector: 'app-shipdatapage-header',
  templateUrl: './shipdatapage-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShipDataPageHeaderComponent implements OnInit {
  // Call By Value using Input Parameters
  searchQuery: SearchQuery;

  @Input() set _query(value: SearchQuery) {
    this.searchQuery = Object.assign({}, value);
  }

  @Output() searchEvents = new EventEmitter<any>();

  @ViewChild('_searchsender') searchsender_ctrl: InputBoxComponent;

  constructor(public gs: GlobalService,
    public mainservice: ShipDataPageService
  ) { }

  ngOnInit() {
    if (!this.gs.isBlank(this.searchsender_ctrl))
      this.searchsender_ctrl.focus();
  }


  ngOnChanges(changes: SimpleChange) {
  }

  ngAfterViewInit() {
    if (!this.gs.isBlank(this.searchsender_ctrl))
      this.searchsender_ctrl.focus();
  }

  List(outputformat: string) {
    if (this.gs.isBlank(this.searchQuery.fromdate))
      this.searchQuery.fromdate = this.gs.year_start_date;
    this.searchEvents.emit({ outputformat: outputformat, searchQuery: this.searchQuery });
  }

  FindMissingData() {
    let IDs: string = "";

    this.mainservice.record.records.forEach(Rec => {
      Rec.selected = 'N';
      if (Rec.selected_b) {
        Rec.selected = 'Y';
        if (IDs != '')
          IDs += ',';
        IDs += "'" + Rec.masterid + "'";
      }
    })
    if (IDs == "") {
      alert('No Record Selected');
      return;
    }

    let prm = {
      appid: this.gs.appid,
      menuid: this.gs.MENU_IMPORT_HBL_DATA_SEA,
      mbl_pkid: IDs,
      origin: 'shipdata-page'
    };
    this.gs.Naviagete2('Silver.ImportData/MissingDataPage', prm);
  }

  DeleteRecord() {
    let RowSelected: number = 0;
    let _rec: Tbl_edi_master = null;
    this.mainservice.record.records.forEach(Rec => {
      if (Rec.selected == 'Y') {
        RowSelected++;
        _rec = Rec;
      }
    })

    if (RowSelected != 1) {
      alert("Please Select Single Row to Delete.");
      return;
    }

    if (_rec == null) {
      alert('No Record Selected');
      return;
    }

    if (_rec.rec_updated == "Y") {
      alert("Cannot Delete, Already Processed");
      return;
    }

    if (_rec.rec_updated == "D") {
      alert("Already Deleted");
      return;
    }

    if (!confirm("DELETE MESSAGE NO: " + _rec.messagenumber + ", MBL NO : " + _rec.mblno)) {
      return;
    }

    this.mainservice.DeleteRow(_rec);
  }

  PermanentDeleteRecord() {
    let _masterid: string = "";
    this.mainservice.record.records.forEach(Rec => {
      if (Rec.selected_b) {
        if (_masterid != "")
          _masterid += ",";
        _masterid += Rec.masterid;
      }
    })

    if (this.gs.isBlank(_masterid)) {
      alert('No Record Selected');
      return;
    }

    if (!confirm("DELETE SELECTED RECORDS PERMANENTLY")) {
      return;
    }

    this.mainservice.PermanentDeleteRows(_masterid);
  }
}
