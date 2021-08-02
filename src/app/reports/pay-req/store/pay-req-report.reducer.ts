import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Tbl_Cargo_Payrequest } from '../../models/Tbl_Cargo_Payrequest';
import { AppState as thisState } from '../../../reducer';

import * as myActions from './pay-req-report.actions';
import { ReportState } from './pay-req-report.models';

export interface AppState extends thisState {
    'PayReqReport': ReportState
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
    user_id: '',
    user_name: '',
    sortcol: '',
    sortorder: true,
    page_rows: 0,
    page_count: 0,
    page_current: 0,
    page_rowcount: 0,
    records: []
};

export function PayReqReportReducer(state: ReportState[] = [initialState], action: myActions.Actions): ReportState[] {
    switch (action.type) {
        case myActions.ActionTypes.ADD:
            return [...state, action.payload];
        case myActions.ActionTypes.UPDATE:
            return [...state.filter(rec => rec.urlid != action.payload.id), action.payload.changes];
        case myActions.ActionTypes.DELETE:
            return [...state.filter(rec => rec.urlid != action.payload.id)];
        case myActions.ActionTypes.SORT_DATA: {
            if (state[action.payload.id] == null)
                return [...state];

            var st = Object.assign({}, state[action.payload.id]);
            if (st.sortcol != action.payload.sortcol) {
                st.sortcol = action.payload.sortcol;
                st.sortorder = true;
            }
            else
                st.sortorder = !st.sortorder;

            st.records = st.records.sort((a, b) => a[st.sortcol] - b[st.sortcol]);

            st.errormessage = '';
            return [...state.filter(rec => rec.urlid != action.payload.id), st];

        }
        default:
            return state;
    }
}

export const getReducer = createFeatureSelector<ReportState[]>('PayReqReport');

export const getState = (urlid: string) => createSelector(
    getReducer,
    (state: ReportState[]) => state.find(rec => rec.urlid == urlid)
);



