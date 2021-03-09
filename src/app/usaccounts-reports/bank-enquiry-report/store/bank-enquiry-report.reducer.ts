import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Tbl_Acc_Payment } from '../../models/Tbl_Acc_Payment';
import { AppState as thisState } from '../../../reducer';

import * as myActions from './bank-enquiry-report.actions';
import { ReportState } from './bank-enquiry-report.models';

export interface AppState extends thisState {
    'BankEnquiryReport': ReportState
}

export const initialState: ReportState = {
    pkid: '',
    urlid: '',
    menuid: '',
    currentTab: '',
    bank_id: '',
    bank_name: '',
    fdate: '',
    edate: '',
    comp_name: '',
    comp_code:'',
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

export function BankEnquiryReportReducer(state: ReportState[] = [initialState], action: myActions.Actions): ReportState[] {
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

export const getReducer = createFeatureSelector<ReportState[]>('BankEnquiryReport');

export const getState = (urlid: string) => createSelector(
    getReducer,
    (state: ReportState[]) => state.find(rec => rec.urlid == urlid)
);



