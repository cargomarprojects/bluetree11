
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, BehaviorSubject } from 'rxjs';

import { GlobalService } from '../../core/services/global.service';
import { Table_User_Edit_History  } from '../models/table_user_edit_history';
import { SearchQuery } from '../models/table_user_edit_history';
import { PageQuery } from '../models/pageQuery';

@Injectable({
    providedIn: 'root'
})
export class EditHistoryService {

    constructor(
        private http2: HttpClient,
        private gs: GlobalService
    ) { }

    List(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Master/EditHistory/List', SearchData, this.gs.headerparam2('authorized'));
    }
    
}
