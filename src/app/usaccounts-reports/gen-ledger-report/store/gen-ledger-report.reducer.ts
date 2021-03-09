import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Tbl_acc_ledger } from '../../models/Tbl_acc_ledger';
import { AppState as thisState } from '../../../reducer';

import * as myActions from './gen-ledger-report.actions';
import { ReportState } from './gen-ledger-report.models';

export interface AppState extends thisState {
    'GenLedgerReport': ReportState
}

export const initialState: ReportState = {
    pkid: '',
    urlid: '',
    menuid: '',
    currentTab: '',
    cust_id: '',
    cust_name: '',
    fdate: '',
    tdate: '',
    comp_name: '',
    comp_code: '',
    radio_cust: 'ACC_ACCTM',
    is_ledger: 'Y',
    acc_parent_code: '',
    fy_start_month: 0,
    filename: '',
    filetype: '',
    filedisplayname: '',
    filename2: '',
    filetype2: '',
    filedisplayname2: '',
    page_rows: 0,
    page_count: 0,
    page_current: 0,
    page_rowcount: 0,
    records: []
};

export function GenLedgerReportReducer(state: ReportState[] = [initialState], action: myActions.Actions): ReportState[] {
    switch (action.type) {
        case myActions.ActionTypes.ADD:
            return [...state, action.payload];
        case myActions.ActionTypes.UPDATE:
            return [...state.filter(rec => rec.urlid != action.payload.id), action.payload.changes];
        case myActions.ActionTypes.DELETE:
            return [...state.filter(rec => rec.urlid != action.payload.id)];
        default:
            return state;
    }
}

export const getReducer = createFeatureSelector<ReportState[]>('GenLedgerReport');

export const getState = (urlid: string) => createSelector(
    getReducer,
    (state: ReportState[]) => state.find(rec => rec.urlid == urlid)
);



