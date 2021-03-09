import { createFeatureSelector,createSelector } from '@ngrx/store';
import { TBL_MBL_REPORT } from '../../models/tbl_mbl_report';
import { AppState as thisState } from '../../../reducer';

import * as myActions from './ton-report.actions';
import { ReportState } from './ton-report.models';

export interface AppState extends thisState {
    'TonReport': ReportState
}

export const initialState: ReportState = {
    pkid  : '',
    urlid : '',
    menuid : '',
    currentTab :'',
    report_category:'',
    sdate :'',
    edate :'',
    mode : '',
    comp_type : '',
    report_type : '',
    agent_id :'',
    agent_name :'',
    reportformat :'',
    filename: '',
    filetype: '',
    filedisplayname: '',
    filename2: '',
    filetype2: '',
    filedisplayname2: '',
    page_rows :0,
    page_count :0,
    page_current : 0,
    page_rowcount :0,
    records : []
};

export function TonReportReducer(state: ReportState[] = [initialState], action: myActions.Actions): ReportState [] {
  switch (action.type) {
    case myActions.ActionTypes.ADD:
        return [...state,action.payload];
    case myActions.ActionTypes.UPDATE:
        return [...state.filter(rec => rec.urlid != action.payload.id), action.payload.changes];
    case myActions.ActionTypes.DELETE:
        return [...state.filter(rec => rec.urlid != action.payload.id)];
    default:
      return state;
  }
}

export const getReducer = createFeatureSelector<ReportState[]>('TonReport');

export const getState = (urlid : string ) => createSelector(
    getReducer,
    (state : ReportState[]) =>  state.find( rec => rec.urlid == urlid)
);


 
