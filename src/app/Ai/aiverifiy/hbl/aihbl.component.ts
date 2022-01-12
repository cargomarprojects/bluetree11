import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { GlobalService } from '../../../core/services/global.service';

import { AutoComplete2Component } from '../../../shared/autocomplete2/autocomplete2.component';
import { InputBoxComponent } from '../../../shared/input/inputbox.component';

import { AiHblService } from '../../services/aihbl.service';
import { vm_Tbl_Ai_Hblm, Ai_Hblm_Model, Tbl_Ai_Hblm, Tbl_Ai_HblDesc, Tbl_Ai_Cntr   } from '../../models/Tbl_ai_hbl';

import { SearchTable } from '../../../shared/models/searchtable';
import { Tbl_Ai_Formatm } from '../../models/Tbl_Ai_Format';



@Component({
    selector: 'app-ai-hbl',
    templateUrl: './aihbl.component.html'
})
export class aiHblComponent implements OnInit {

    record: Tbl_Ai_Hblm = <Tbl_Ai_Hblm>{};

    formats: Tbl_Ai_Formatm [] = <Tbl_Ai_Formatm []>[];

    records: Tbl_Ai_HblDesc [] = <Tbl_Ai_HblDesc []>[];

    cntrs: Tbl_Ai_Cntr [] = <Tbl_Ai_Cntr []>[];

    tab: string = 'main';

    modal: any;
    
    
    
    menuid: string;
    public mode: string = '';
    errorMessage: string;
    Foregroundcolor: string;

    

    title: string;
    isAdmin: boolean;
    refno: string = "";


    bLoaded = false;

    private pkid: string;
    @Input() set _pkid(value: string) {
      this.pkid = value;
      if ( this.pkid != "")
        this.GetRecord("");
    }



    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private location: Location,
        public gs: GlobalService,
        private modalservice: NgbModal,
        public mainService: AiHblService,
    ) { }

    ngOnInit() {
        this.gs.checkAppVersion();
        //Route Change 29072021
    }

    private initPage() {
        this.isAdmin = this.gs.IsAdmin(this.menuid);
        this.title = this.gs.getTitle(this.menuid);
        this.errorMessage = '';
    }



    GetRecord( _type : string) {
        this.initPage();
        this.errorMessage = '';
        var SearchData = this.gs.UserInfo;
        SearchData.type = _type;
        SearchData.pkid = this.pkid;
        if ( this.gs.isBlank(this.record.hbl_format_id))
            SearchData.format_id = "";
        else 
            SearchData.format_id = this.record.hbl_format_id;

        this.mainService.GetRecord(SearchData)
            .subscribe(response => {
                this.record = <Tbl_Ai_Hblm>response.record;
                this.records = <Tbl_Ai_HblDesc []> response.records;            
                this.cntrs = <Tbl_Ai_Cntr []> response.cntrs;            
                this.formats = <Tbl_Ai_Formatm []> response.formats;

                if ( response.cntrs == null) {
                    this.cntrs = <Tbl_Ai_Cntr []> [];
                }

                this.mode = 'EDIT';
                this.bLoaded = true;
            }, error => {
                this.errorMessage = this.gs.getError(error);
                alert(this.errorMessage);
            });
    }


    Save() {


        if (!this.Allvalid())
            return;
        this.SaveParent();
        const saveRecord = <vm_Tbl_Ai_Hblm>{};
        saveRecord.record = this.record;
        saveRecord.records = this.records;
        saveRecord.cntrs = this.cntrs;
        saveRecord.pkid = this.pkid;
        saveRecord.mode = this.mode;
        saveRecord.userinfo = this.gs.UserInfo;

        this.mainService.Save(saveRecord)
            .subscribe(response => {
                if (response.retvalue == false) {
                    this.errorMessage = response.error;
                    alert(this.errorMessage);
                }
                else {
                    this.mode = 'EDIT';
                    this.errorMessage = 'Save Complete';
                    alert(this.errorMessage);
                }

            }, error => {
                this.errorMessage = this.gs.getError(error);
                alert(this.errorMessage);
            });
    }

    private SaveParent() {

    }
    private Allvalid(): boolean {

        var bRet = true;
        this.errorMessage = "";

        if (this.gs.isBlank(this.pkid)) {
            bRet = false;
            this.errorMessage = "Invalid ID";
            alert(this.errorMessage);
            return bRet;
        }

        if (this.gs.isBlank(this.record.hbl_format_id)) {
            bRet = false;
            this.errorMessage = "Invalid Format";
            alert(this.errorMessage);
            return bRet;
        }


        return bRet;
    }


    Close() {
        this.location.back();
    }


    LovSelected(_Record: SearchTable) {
        if (_Record.controlname == "CARRIER") {
            this.record.hbl_carrier_id = _Record.id;
            this.record.hbl_carrier_code = _Record.code;
            this.record.hbl_carrier_name = _Record.name;
        }
        if (_Record.controlname == "AGENT") {
            this.record.hbl_agent_id = _Record.id;
            this.record.hbl_agent_code = _Record.code;
            this.record.hbl_agent_name = _Record.name;
        }
        if (_Record.controlname == "COLOADER") {
            this.record.hbl_coloader_id = _Record.id;
            this.record.hbl_coloader_code = _Record.code;
            this.record.hbl_coloader_name = _Record.name;
        }
        if (_Record.controlname == "HANDLEDBY") {
            this.record.hbl_handled_id = _Record.id;
            this.record.hbl_handled_code = _Record.code;
            this.record.hbl_handled_name = _Record.name;
        }
        if (_Record.controlname == "COUNTRY") {
            this.record.hbl_country_id = _Record.id;
            this.record.hbl_country_code = _Record.code;
            this.record.hbl_country_name = _Record.name;
        }

        if (_Record.controlname == "POL") {
            this.record.hbl_pol_id = _Record.id;
            this.record.hbl_pol_code = _Record.code;
            this.record.hbl_pol_name = _Record.name;
        }
        if (_Record.controlname == "POD") {
            this.record.hbl_pod_id = _Record.id;
            this.record.hbl_pod_code = _Record.code;
            this.record.hbl_pod_name = _Record.name;
        }
        if (_Record.controlname == "POFD") {
            this.record.hbl_pofd_id = _Record.id;
            this.record.hbl_pofd_code = _Record.code;
            this.record.hbl_pofd_name = _Record.name;
        }      
    }

    OnChange(field: string) {
    }

    onFocusout(field: string) {
    }

    onBlur(field: string) {
        switch (field) {
          case 'gen_pincode': {
            break;
          }
          case 'gen_short_name': {
            break;
          }
    
        }
    }



    CloseModal(){
        this.modal.close();
    }

    callbackparent(rec : any){
        alert( rec.file_desc);
    }

    AddDescRow()
    {
        let rec = <Tbl_Ai_HblDesc>{};
        rec.hbl_pkid = this.gs.getGuid();        
        rec.hbl_parent_id = this.pkid;  
        this.records.push(rec);
    }
    
    RemoveDescRow(rec : Tbl_Ai_HblDesc, i : number){

        if ( this.gs.isBlank( rec.hbl_desc1)  && this.gs.isBlank( rec.hbl_desc2))
        {
            if (!confirm("Delete Y/N")) 
                return;
            this.records.splice( i , 1);
        }
        else {
            alert('Only blank row can be removed');
        }

    }

    AddCntrRow()
    {
        let rec = <Tbl_Ai_Cntr>{};
        rec.hbl_pkid = this.gs.getGuid();
        rec.hbl_parent_id = this.pkid;  
        this.cntrs.push(rec);
    }
    
    RemoveCntrRow(rec : Tbl_Ai_Cntr, i : number){
        if (!confirm("Delete Y/N")) 
            return;
        //const id = this.cntrs.findIndex(rec => rec.hbl_pkid == rec.hbl_pkid);
        this.cntrs.splice(i, 1);
    }

    ChangeTab(_tab){
        this.tab = _tab;
    }


}
