import { Component, OnInit, Input, OnDestroy, SimpleChange, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GlobalService } from '../../core/services/global.service';
import { Tbl_edi_link, vm_tbl_edi_link } from '../models/tbl_edi_link';
import { SearchQuery } from '../models/tbl_edi_link';
import { PageQuery } from '../../shared/models/pageQuery';
import { LinkPageService } from '../services/linkpage.service';

@Component({
    selector: 'app-linkpage',
    templateUrl: './linkpage.component.html'
})
export class LinkPageComponent implements OnInit {

    @Input() mrecord: Tbl_edi_link;
    @Output() ModifiedRecords = new EventEmitter<any>();

    errorMessage$: Observable<string>;
    records$: Observable<Tbl_edi_link[]>;
    pageQuery$: Observable<PageQuery>;
    searchQuery$: Observable<SearchQuery>;

    constructor(
        private route: ActivatedRoute,
        private location: Location,
        public gs: GlobalService,
        public mainservice: LinkPageService
    ) {
    }

    ngOnInit() {
        this.mainservice.init(this.route.snapshot.queryParams, this.mrecord);
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

    LinkData(_rec: Tbl_edi_link) {

        if (!confirm("Assign The Current Selected Name")) {
            return;
        }

        let Rec: Tbl_edi_link = <Tbl_edi_link>{};

        Rec.link_pkid = this.gs.getGuid();
        Rec.link_messagesender = this.mrecord.link_messagesender.toString();
        Rec.link_category = this.mrecord.link_category.toString();
        Rec.link_subcategory = this.mrecord.link_subcategory.toString();
        Rec.link_source_code = this.mrecord.link_source_code.toString();
        Rec.link_source_name = this.mrecord.link_source_name.toString();
        Rec.link_target_id = _rec.link_target_id;
        Rec.link_target_name = _rec.link_target_name;

        const saveRecord = <vm_tbl_edi_link>{};
        saveRecord.record = Rec;
        saveRecord.mode = "ADD";
        saveRecord.userinfo = this.gs.UserInfo;

        this.mainservice.Save(saveRecord)
            .subscribe(response => {

                if (response.retvalue == false) {
                    this.mainservice.record.errormessage = response.error;
                    alert(this.mainservice.record.errormessage);
                }
                else {
                    this.mrecord.link_status = "YES";
                    if (this.ModifiedRecords != null)
                        this.ModifiedRecords.emit({ saction: 'CLOSE' });
                }
            }, error => {
                this.mainservice.record.errormessage = this.gs.getError(error);
                alert(this.mainservice.record.errormessage);
            });

    }

}
