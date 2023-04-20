import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Tbl_OS_REPORT } from '../../models/Tbl_OS_Report';
import { AppState as thisState } from '../../../reducer';

import * as myActions from './cust-stmt-report.actions';
import { ReportState } from './cust-stmt-report.models';
import * as _ from 'lodash-es';

export interface AppState extends thisState {
    'CustStmtReport': ReportState
}

export const initialState: ReportState = {
    pkid: '',
    urlid: '',
    menuid: '',
    currentTab: '',
    cust_id: '',
    cust_name: '',
    adate: '',
    ddate: '',
    comp_name: '',
    comp_code: '',
    comp_type: '',
    bank_id: '',
    bank_name: '',
    radio_cust: 'MASTER',
    showall: false,
    report_pagewise:true,
    showprofit: false,
    sortname: '',
    hide_payroll: 'N',
    filename: '',
    filetype: '',
    filedisplayname: '',
    filename2: '',
    filetype2: '',
    filedisplayname2: '',
    sortcol: 'inv_date',
    sortorder: true,
    page_rows: 0,
    page_count: 0,
    page_current: 0,
    page_rowcount: 0,
    records: [],
    idlist: []
};

export function CustStmtReportReducer(state: ReportState[] = [initialState], action: myActions.Actions): ReportState[] {
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

export const getReducer = createFeatureSelector<ReportState[]>('CustStmtReport');

export const getState = (urlid: string) => createSelector(
    getReducer,
    (state: ReportState[]) => state.find(rec => rec.urlid == urlid)
);



