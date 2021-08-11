import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Tbl_acc_Trialbalance } from '../../models/Tbl_acc_Trialbalance';
import { AppState as thisState } from '../../../reducer';

import * as myActions from './trial-bal-report.actions';
import { ReportState } from './trial-bal-report.models';
import * as _ from 'lodash-es';

export interface AppState extends thisState {
    'TrialBalReport': ReportState
}

export const initialState: ReportState = {
    pkid: '',
    urlid: '',
    menuid: '',
    currentTab: '',
    basedon: '',
    fdate: '',
    tdate: '',
    comp_name: '',
    comp_code: '',
    showzerobal: false,
    fy_start_month: 0,
    filename: '',
    filetype: '',
    filedisplayname: '',
    filename2: '',
    filetype2: '',
    filedisplayname2: '',
    sortcol: 'tb_acc_code',
    sortorder: true,
    page_rows: 0,
    page_count: 0,
    page_current: 0,
    page_rowcount: 0,
    records: []
};

export function TrialBalReportReducer(state: ReportState[] = [initialState], action: myActions.Actions): ReportState[] {
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
                st.records = _.orderBy(st.records, ['row_type', st.sortcol], ['asc', 'asc']);
            else
                st.records = _.orderBy(st.records, ['row_type', st.sortcol], ['asc', 'desc']);

            return [...state.filter(rec => rec.urlid != action.payload.id), st];
        }
        default:
            return state;
    }
}

export const getReducer = createFeatureSelector<ReportState[]>('TrialBalReport');

export const getState = (urlid: string) => createSelector(
    getReducer,
    (state: ReportState[]) => state.find(rec => rec.urlid == urlid)
);



