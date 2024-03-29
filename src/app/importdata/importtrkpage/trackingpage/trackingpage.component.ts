import { Component, OnInit, Input, OnDestroy, SimpleChange } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GlobalService } from '../../../core/services/global.service';
import { Tbl_edi_isa } from '../../models/tbl_edi_isa';
import { SearchQuery } from '../../models/tbl_mast_files';
import { PageQuery } from '../../../shared/models/pageQuery';
import { TrackingPageService } from '../../services/trackingpage.service';

@Component({
    selector: 'app-trackingpage',
    templateUrl: './trackingpage.component.html'
})
export class TrackingPageComponent implements OnInit {

    routeparams: any;

    errorMessage$: Observable<string>;
    records$: Observable<Tbl_edi_isa[]>;
    pageQuery$: Observable<PageQuery>;
    searchQuery$: Observable<SearchQuery>;

    constructor(
        private route: ActivatedRoute,
        private location: Location,
        public gs: GlobalService,
        public mainservice: TrackingPageService
    ) { }

    ngOnInit() {
        this.gs.checkAppVersion();
        this.routeparams = this.route.snapshot.queryParams;
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

    Close() {
        this.location.back();
    }

    TrackingImportData(_record: Tbl_edi_isa) {
        // if (_record.isa_files_status == "Y") {
        //     alert('Record is deleted')
        //     return;
        // }
        if (_record.isa_files_processed == "Y") {
            alert('Record is already Processed')
            return;
        }
        if (!confirm("Process Selected Record")) {
            return;
        }

        this.mainservice.Xml_Rec = _record;
        this.mainservice.Xml_MainRecIndex = 0;
        this.mainservice.Xml_MainRecTot = 0;
        this.mainservice.ImportTrackingData();
    }
}
