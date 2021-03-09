import { Component, OnInit,ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GlobalService } from '../../../core/services/global.service';
import { Tbl_edi_link } from '../../models/tbl_edi_link';
import { ShipDataPageService } from '../../services/shipdatapage.service';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Tbl_acc_ledger } from 'src/app/usaccounts-reports/models/Tbl_acc_ledger';
import { InputBoxComponent } from '../../../shared/input/inputbox.component';

@Component({
    selector: 'app-missingdatapage',
    templateUrl: './missingdatapage.component.html'
})
export class MissingDataPageComponent implements OnInit {

    modal: any;
    @ViewChild('_searchstring') searchstring_ctrl: InputBoxComponent;
    errorMessage: string;
    mbl_pkid: string;
    mbl_refno: string;
    mbl_mode: string;
    searchString: string;
    origin: string;

    menuid: string;
    title: string;
    isAdmin: boolean;
    canAdd: boolean;
    canEdit: boolean;
    canSave: boolean;
    mrecord: Tbl_edi_link;

    records: Tbl_edi_link[]
    is_locked: boolean = false;

    constructor(
        private modalconfig: NgbModalConfig,
        private modalservice: NgbModal,
        private route: ActivatedRoute,
        private location: Location,
        public gs: GlobalService,
        public mainservice: ShipDataPageService
    ) {
        modalconfig.backdrop = 'static'; //true/false/static
        modalconfig.keyboard = true; //true Closes the modal when escape key is pressed
    }

    ngOnInit() {

        const options = JSON.parse(this.route.snapshot.queryParams.parameter);
        this.menuid = options.menuid;
        this.mbl_pkid = options.mbl_pkid;
        this.origin = options.origin;
        // this.mbl_refno = options.mbl_refno;
        // this.mbl_mode = options.mbl_mode;
        // this.is_locked = options.is_locked;

        this.isAdmin = this.gs.IsAdmin(this.menuid);
        this.title = this.gs.getTitle(this.menuid);
        this.canAdd = this.gs.canAdd(this.menuid);
        this.canEdit = this.gs.canEdit(this.menuid);
        this.title = "Missing Data";
        this.searchstring_ctrl.focus();
        
        if (this.origin === "shipdata-page")
            this.List('DEFAULT');
    }


    List(action: string = '') {
        var SearchData = this.gs.UserInfo;
        if (this.gs.isBlank(this.searchString))
            SearchData.SENDER = '';
        else
            SearchData.SENDER = this.searchString;
        if (this.gs.isBlank(this.mbl_pkid) || action == "VALIDATE")
            SearchData.MASTERID = '';
        else
            SearchData.MASTERID = this.mbl_pkid;
        this.mainservice.MissingList(SearchData).subscribe(response => {
            this.records = response.list;

        }, error => {
            this.errorMessage = this.gs.getError(error)
            alert(this.errorMessage);
        });
    }

    linkmaster(_rec: Tbl_edi_link, linkmodal: any = null) {
        // let prm = {
        //     menuid: this.gs.MENU_IMPORT_EXCEL,
        //     id: '1111',
        //     param_type: '',
        //     origin: 'airimp-master-page',
        // };
        // this.gs.Naviagete('Silver.ImportData/LinkPage', JSON.stringify(prm));

        this.mrecord = _rec;
        this.modal = this.modalservice.open(linkmodal, { centered: true });
    }


    Close() {
        this.location.back();
    }

    CloseModal() {
        this.modal.close();
    }

    ModifiedRecords(params: any) {
        if (params.saction == "CLOSE")
            this.modal.close();
    }

    addtomaster(_rec: Tbl_edi_link) {
        let sDesc: string = _rec.link_source_name;
        sDesc = sDesc.replace(',', '#');
        if (_rec.link_subcategory == "SHIPPER" || _rec.link_subcategory == "CONSIGNEE" || _rec.link_subcategory == "NOTIFY" || _rec.link_subcategory == "AGENT")
            this.AddToAddressbook(_rec.link_subcategory, _rec.link_messagesender, sDesc);
        else if (_rec.link_subcategory == "SEA CARRIER")
            this.AddToParamDet(this.gs.MENU_SEA_CARRIER, _rec.link_subcategory, sDesc);
        else if (_rec.link_subcategory == "SEA PORT")
            this.AddToParamDet(this.gs.MENU_SEA_PORT, _rec.link_subcategory, sDesc);
        else if (_rec.link_subcategory == "FREIGHT STATUS")
            this.AddToParam(this.gs.MENU_FREIGHT_STATUS, _rec.link_subcategory, sDesc);
        else if (_rec.link_subcategory == "CARGO MOVEMENT")
            this.AddToParam(this.gs.MENU_CARGO_MOVEMENT, _rec.link_subcategory, sDesc);
        else if (_rec.link_subcategory == "COUNTRY")
            this.AddToParam(this.gs.MENU_COUNTRY_MASTER, _rec.link_subcategory, sDesc);
        else if (_rec.link_subcategory == "UNIT")
            this.AddToParam(this.gs.MENU_UNIT_MASTER, _rec.link_subcategory, sDesc);
        else if (_rec.link_subcategory == "NOMINATION")
            this.AddToParam(this.gs.MENU_NOMINATION_STATUS, _rec.link_subcategory, sDesc);
        else if (_rec.link_subcategory == "CONTAINER TYPE")
            this.AddToParam(this.gs.MENU_CONTAINER_TYPE, _rec.link_subcategory, sDesc);
        else
            alert("Please Add Manually");
    }

    AddToAddressbook(_subcategory: string, _messagesender: string, _sDesc: string) {

        let SMENU_ID = this.gs.MENU_MASTER_DATA; //'6727DF99-9385-4991-841B-1ECAA9E3B28A';
        if (this.gs.canAdd(SMENU_ID) || this.gs.canEdit(SMENU_ID) || this.gs.canView(SMENU_ID)) {
            let parameter = {
                menuid: SMENU_ID,
                pkid: '',
                type: 'PARTYS',
                origin: 'EXTERNAL',
                mode: 'ADD',
                ms_type: _subcategory,
                ms_from: _messagesender,
                ms_name: _sDesc
            };
            this.gs.Naviagete('Silver.Master/PartyEditPage', JSON.stringify(parameter));
        }
        else
            alert("Insufficient Rights");
    }

    AddToParamDet(_smenu_id: string, _type: string, _sDesc: string) {

        if (this.gs.canAdd(_smenu_id) || this.gs.canEdit(_smenu_id) || this.gs.canView(_smenu_id)) {
            let parameter = {
                menuid: _smenu_id,
                pkid: '',
                type: _type,
                origin: 'EXTERNAL',
                mode: 'ADD',
                ms_name: _sDesc
            };
            this.gs.Naviagete('Silver.Master/ParamPageDetEdit', JSON.stringify(parameter));
        }
        else
            alert("Insufficient Rights");
    }

    AddToParam(_smenu_id: string, _type: string, _sDesc: string) {

        if (this.gs.canAdd(_smenu_id) || this.gs.canEdit(_smenu_id) || this.gs.canView(_smenu_id)) {
            let parameter = {
                menuid: _smenu_id,
                pkid: '',
                type: _type,
                origin: 'EXTERNAL',
                mode: 'ADD',
                ms_name: _sDesc
            };
            this.gs.Naviagete('Silver.Master/ParamEdit', JSON.stringify(parameter));
        }
        else
            alert("Insufficient Rights");
    }
}
