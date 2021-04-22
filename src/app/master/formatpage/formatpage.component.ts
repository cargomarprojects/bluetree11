import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GlobalService } from '../../core/services/global.service';
import { AutoComplete2Component } from '../../shared/autocomplete2/autocomplete2.component';
import { InputBoxComponent } from '../../shared/input/inputbox.component';
import { FormatPageService } from '../../master/services/formatpage.service';
import { vm_Tbl_cargo_hblformat, Tbl_cargo_hblformat } from '../../master/models/Tbl_cargo_hblformat';
import { SearchTable } from '../../shared/models/searchtable';
import { TBL_MAST_PARAM } from '../../master/models/Tbl_Mast_Param';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SearchQuery } from '../models/Tbl_cargo_hblformat';
import { PageQuery } from '../../shared/models/pageQuery';

@Component({
    selector: 'app-formatpage',
    templateUrl: './formatpage.component.html'
})
export class FormatPageComponent implements OnInit {

    errorMessage$: Observable<string>;
    records$: Observable<Tbl_cargo_hblformat[]>;
    pageQuery$: Observable<PageQuery>;
    searchQuery$: Observable<SearchQuery>;
    
    tab: string = 'main';
    modal: any;
    

    constructor(
        private modalconfig: NgbModalConfig,
        private modalservice: NgbModal,
        private router: Router,
        private route: ActivatedRoute,
        private location: Location,
        public gs: GlobalService,
        private mainservice: FormatPageService,
    ) {
        modalconfig.backdrop = 'static'; //true/false/static
        modalconfig.keyboard = true; //true Closes the modal when escape key is pressed
    }

    ngOnInit() {
        this.mainservice.init(this.route.snapshot.queryParams);
        this.initPage();
    }

    private initPage() {
        this.records$ = this.mainservice.data$.pipe(map(res => res.records));
        this.searchQuery$ = this.mainservice.data$.pipe(map(res => res.searchQuery));
        this.pageQuery$ = this.mainservice.data$.pipe(map(res => res.pageQuery));
        this.errorMessage$ = this.mainservice.data$.pipe(map(res => res.errorMessage));
    }
 
    searchEvents(actions: any) {
        this.mainservice.Search(actions, 'SEARCH');
      }
    
      pageEvents(actions: any) {
        this.mainservice.Search(actions, 'PAGE');
      }
     

    

    Close() {
        this.location.back();
    }

    LovSelected(_Record: SearchTable) {
        let bchange: boolean = false;


    }

    OnChange(field: string) {
    }
    onFocusout(field: string) {
    }

    OnBlur(field: string, _rec: Tbl_cargo_hblformat = null) {
        if (field == "blf_col_x")
            _rec.blf_col_x = this.gs.roundNumber(_rec.blf_col_x, 0);
        if (field == "blf_col_y")
            _rec.blf_col_y = this.gs.roundNumber(_rec.blf_col_y, 0);
        if (field == "blf_width")
            _rec.blf_width = this.gs.roundNumber(_rec.blf_width, 0);
    }


    BtnNavigation(action: string, attachmodal: any = null) {
        switch (action) {
            // case 'ATTACHMENT': {
            //     this.attach_title = 'Documents';
            //     this.attach_parentid = this.pkid;
            //     this.attach_subid = '';
            //     this.attach_type = 'MARKETING';
            //     this.attach_typelist = [];
            //     this.attach_tablename = 'cargo_journals_master';
            //     this.attach_tablepkcolumn = 'cjm_pkid';
            //     this.attach_refno = '';
            //     this.attach_customername = '';
            //     this.attach_updatecolumn = 'REC_FILES_ATTACHED';
            //     this.attach_viewonlysource = '';
            //     this.attach_viewonlyid = '';
            //     this.attach_filespath = '';
            //     this.attach_filespath2 = '';
            //     // this.tab = 'attachment';
            //     this.modal = this.modalservice.open(attachmodal, { centered: true });
            //     break;
            // }
            // case 'MEMO': {
            //     let prm = {
            //         menuid: this.menuid,
            //         pkid: this.pkid,
            //         source: 'CONTACT-MEMO',
            //         title: 'Memo',
            //         origin: 'sales-journal-page'
            //     };
            //     this.gs.Naviagete('Silver.BusinessModule/XmlRemarksPage', JSON.stringify(prm));
            //     break;
            // }

        }
    }
    callbackevent(event: any) {
        this.tab = 'main';
    }
    CloseModal() {
        this.modal.close();
    }
    changepos(pos: string, rec: Tbl_cargo_hblformat) {
        if (pos == 'left') {
            rec.blf_col_x = rec.blf_col_x - 8;
        }
        if (pos == 'right') {
            rec.blf_col_x = rec.blf_col_x + 8;
        }
        if (pos == 'up') {
            rec.blf_col_y = rec.blf_col_y - 15;
        }
        if (pos == 'down') {
            rec.blf_col_y = rec.blf_col_y + 15;
        }
    }

}
