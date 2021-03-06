import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Tbl_acc_ledger } from '../../models/Tbl_acc_ledger';
import { AppState as thisState } from '../../../reducer';

import * as myActions from './aging-report.actions';
import { ReportState } from './aging-report.models';
import * as _ from 'lodash-es';

export interface AppState extends thisState {
    'AgingReport': ReportState
}

export const initialState: ReportState = {
    pkid: '',
    urlid: '',
    menuid: '',
    currentTab: '',
    jv_year: '0',
    edate: '',
    basedon: '',
    comp_type: '',
    comp_code: '',
    comp_name: '',
    report_arap: '',
    currency: '',
    radio_cust: 'CUSTOMER',
    showall: false,
    cust_name: '',
    cust_id: '',
    show_advance: false,
    group_by_parent: false,
    report_type: '',
    radio_days: '30_60',
    iscustomer: 'N',
    isparent: 'N',
    hide_payroll: 'N',
    filename: '',
    filetype: '',
    filedisplayname: '',
    filename2: '',
    filetype2: '',
    filedisplayname2: '',
    sortcol: 'inv_cust_name',
    sortorder: true,
    page_rows: 0,
    page_count: 0,
    page_current: 0,
    page_rowcount: 0,
    records: []
};

export function AgingReportReducer(state: ReportState[] = [initialState], action: myActions.Actions): ReportState[] {
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
                st.records = _.orderBy(st.records, ['ROW_TYPE', st.sortcol], ['asc', 'asc']);
            else
                st.records = _.orderBy(st.records, ['ROW_TYPE', st.sortcol], ['asc', 'desc']);

            return [...state.filter(rec => rec.urlid != action.payload.id), st];
        }
        default:
            return state;
    }
}

export const getReducer = createFeatureSelector<ReportState[]>('AgingReport');

export const getState = (urlid: string) => createSelector(
    getReducer,
    (state: ReportState[]) => state.find(rec => rec.urlid == urlid)
);



