import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Tbl_cargo_general } from '../../../other/models/tbl_cargo_general'
import { AppState as thisState } from '../../../reducer';

import * as myActions from './ship-log-report.actions';
import { ReportState } from './ship-log-report.models';

export interface AppState extends thisState {
    'ShipmentLogReport': ReportState
}

export const initialState: ReportState = {
    pkid: '',
    urlid: '',
    menuid: '',
    currentTab: '',
    job_mode: '',
    date_basedon: '',
    sdate: '',
    edate: '',
    shipper_id: '',
    shipper_name: '',
    consignee_id: '',
    consignee_name: '',
    agent_id: '',
    agent_name: '',
    handled_basedon: '',
    handled_id: '',
    handled_name: '',
    report_masterwise: false,
    report_housewise: false,
    checkList: [],
    sort_order: '',
    format_type: '',
    reportformat: '',
    printer_friendly: false,
    page_rows: 0,
    page_count: 0,
    page_current: 0,
    page_rowcount: 0,
    records: []
};

export function ShipmentLogReportReducer(state: ReportState[] = [initialState], action: myActions.Actions): ReportState[] {
    switch (action.type) {
        case myActions.ActionTypes.ADD:
            return [...state, action.payload];
        case myActions.ActionTypes.UPDATE:
            return [...state.filter(rec => rec.urlid != action.payload.id), action.payload.changes];
        case myActions.ActionTypes.DELETE:
            return [...state.filter(rec => rec.urlid != action.payload.id)];
        case myActions.ActionTypes.SELECTDESELECT: {
            const rec = { ...state.find(rec1 => rec1.urlid == action.payload.id) };
            const record = {
                ...rec,
                checkList: rec.checkList.map(r1 => {
                    return { ...r1, ischecked: action.payload.flag }
                })
            };
            return [...state.filter(rec2 => rec2.urlid != action.payload.id), record];
        }
        case myActions.ActionTypes.SINGLESELECTDESELECT: {

            const rec = { ...state.find(rec1 => rec1.urlid == action.payload.urlid) };
            const record = {
                ...rec,
                checkList: rec.checkList.map(r1 => {
                    return r1.code == action.payload.id ? { ...r1, ischecked: action.payload.flag } : r1
                })
            };
            return [...state.filter(rec2 => rec2.urlid != action.payload.urlid), record];
        }
        default:
            return state;
    }
}

export const getReducer = createFeatureSelector<ReportState[]>('ShipmentLogReport');

export const getState = (urlid: string) => createSelector(
    getReducer,
    (state: ReportState[]) => state.find(rec => rec.urlid == urlid)
);



