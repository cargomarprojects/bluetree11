import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Tbl_OS_REPORT } from '../../models/Tbl_OS_Report';
import { AppState as thisState } from '../../../reducer';

import * as myActions from './inv-cust-report.actions';
import { ReportState } from './inv-cust-report.models';

export interface AppState extends thisState {
    'InvCustReport': ReportState
}

export const initialState: ReportState = {
    pkid: '',
    urlid: '',
    menuid: '',
    currentTab: '',
    cust_id: '',
    cust_code: '',
    cust_name: '',
    sortname: '',
    page_rows: 0,
    page_count: 0,
    page_current: 0,
    page_rowcount: 0,
    records: []
};

export function InvCustReportReducer(state: ReportState[] = [initialState], action: myActions.Actions): ReportState[] {
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

export const getReducer = createFeatureSelector<ReportState[]>('InvCustReport');

export const getState = (urlid: string) => createSelector(
    getReducer,
    (state: ReportState[]) => state.find(rec => rec.urlid == urlid)
);



