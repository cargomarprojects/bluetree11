import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Tbl_Cargo_Payrequest } from '../../models/Tbl_Cargo_Payrequest';
import { AppState as thisState } from '../../../reducer';

import * as myActions from './pay-due-report.actions';
import { ReportState } from './pay-due-report.models';
import * as _ from 'lodash-es';

export interface AppState extends thisState {
    'PayDueReport': ReportState
}

export const initialState: ReportState = {
    pkid: '',
    urlid: '',
    menuid: '',
    currentTab: '',
    report_category: '',
    sdate: '',
    edate: '',
    showsmode: '',
    comp_type: '',
    sdata: '',
    sort: '',

    chk_air_import: false,
    chk_sea_import: false,
    chk_air_export: false,
    chk_sea_export: false,
    chk_others: false,
    chk_admin_expense: false,

    cust_id: '',
    cust_name: '',
    sortcol: 'inv_mbl_refno',
    sortorder: true,
    page_rows: 0,
    page_count: 0,
    page_current: 0,
    page_rowcount: 0,
    records: []
};

export function PayDueReportReducer(state: ReportState[] = [initialState], action: myActions.Actions): ReportState[] {
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

export const getReducer = createFeatureSelector<ReportState[]>('PayDueReport');

export const getState = (urlid: string) => createSelector(
    getReducer,
    (state: ReportState[]) => state.find(rec => rec.urlid == urlid)
);



