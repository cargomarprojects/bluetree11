import { Component, OnInit, Input, OnDestroy, SimpleChange } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GlobalService } from '../../core/services/global.service';
import { Tbl_Download_Report } from '../models/tbl_download_report';
import { SearchQuery } from '../models/tbl_download_report';
import { PageQuery } from '../../shared/models/pageQuery';
import { DownloadReportService } from '../services/download_report.service';

@Component({
    selector: 'app-download-report',
    templateUrl: './download-report.component.html'
})
export class DownloadReportComponent implements OnInit {

    errorMessage$: Observable<string>;
    records$: Observable<Tbl_Download_Report[]>;
    pageQuery$: Observable<PageQuery>;
    searchQuery$: Observable<SearchQuery>;

    constructor(
        private route: ActivatedRoute,
        private location: Location,
        public gs: GlobalService,
        public mainservice: DownloadReportService
    ) { }

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
        if (actions.outputformat == "DOWNLOAD") {
            this.mainservice.DownloadDocuments();
        } else
            this.mainservice.Search(actions, 'SEARCH');
    }

    pageEvents(actions: any) {
        this.mainservice.Search(actions, 'PAGE');
    }


    Close() {
        this.location.back();
    }

    Downloadfile(filename: string, filetype: string, filedisplayname: string) {
        this.gs.DownloadFile(this.gs.FS_APP_FOLDER, filename, filetype, filedisplayname);
    }

}