import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TBL_INV_ISSUE_RPT } from '../../models/tbl_inv_issue_rpt';
import { AppState as thisState } from '../../../reducer';

import * as myActions from './inv-iss-report.actions';
import { ReportState } from './inv-iss-report.models';
import * as _ from 'lodash-es';

export interface AppState extends thisState {
    'InvoiceIssueReport': ReportState
}

export const initialState: ReportState = {
    pkid: '',
    urlid: '',
    menuid: '',
    currentTab: '',
    report_category: '',
    sdate: '',
    edate: '',
    mode: '',
    comp_type: '',
    report_type: '',
    report_shptype: '',
    filename: '',
    filetype: '',
    filedisplayname: '',
    cust_id: '',
    cust_name: '',
    cust_parent_id: '',
    cust_parent_name: '',
    datetype: '',
    araptype: '',
    reportformat: '',
    sortcol: 'mbl_refno',
    sortorder: true,
    page_rows: 0,
    page_count: 0,
    page_current: 0,
    page_rowcount: 0,
    records: []
};

export function InvIssReportReducer(state: ReportState[] = [initialState], action: myActions.Actions): ReportState[] {
    switch (action.type) {
        case myActions.ActionTypes.ADD:
            return [...state, action.payload];
        case myActions.ActionTypes.UPDATE:
            return [...state.filter(rec => rec.urlid != action.payload.id), action.payload.changes];
        case myActions.ActionTypes.DELETE:
            return [...state.filter(rec => rec.urlid != action.payload.id)];
        case myActions.ActionTypes.SORT_DATA: {

            var st = Object.assign({}, state.find(rec => rec.urlid == action.payload.id));
            if (st == null)
                return [...state];

            if (st.sortcol != action.payload.sortcol) {
                st.sortcol = action.payload.sortcol;
                st.sortorder = true;
            }
            else
                st.sortorder = !st.sortorder;

            if (st.sortorder)
                st.records = _.sortBy(st.records, st.sortcol);
            else
                st.records = _.sortBy(st.records, st.sortcol).reverse();

            return [...state.filter(rec => rec.urlid != action.payload.id), st];
        }
        default:
            return state;
    }
}

export const getReducer = createFeatureSelector<ReportState[]>('InvoiceIssueReport');

export const getState = (urlid: string) => createSelector(
    getReducer,
    (state: ReportState[]) => state.find(rec => rec.urlid == urlid)
);



