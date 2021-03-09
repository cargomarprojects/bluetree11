import { createFeatureSelector,createSelector } from '@ngrx/store';
import { TBL_MBL_REPORT } from '../../models/tbl_mbl_report';
import { AppState as thisState } from '../../../reducer';

import * as myActions from './profit-report.actions';
import { ReportState } from './proft-report.models';

export interface AppState extends thisState {
    'ProfitReport': ReportState
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

    report_criteria: '',
    report_amount: 0,
    report_profit_met: false,
    report_loss_approved: false,

    cust_id :'',
    cust_name :'',
    cust_parent_id : '',
    cust_parent_name :'',
    sales_id :'',
    sales_name :'',    
    filename: '',
    filetype: '',
    filedisplayname: '',
    filename2: '',
    filetype2: '',
    filedisplayname2: '',
    _report_category : '',
    _report_type :'',
    stage:'',
    page_rows :0,
    page_count :0,
    page_current : 0,
    page_rowcount :0,
    records : []
};

export function ProfitReportReducer(state: ReportState[] = [initialState], action: myActions.Actions): ReportState [] {
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

export const getReducer = createFeatureSelector<ReportState[]>('ProfitReport');

export const getState = (urlid : string ) => createSelector(
    getReducer,
    (state : ReportState[]) =>  state.find( rec => rec.urlid == urlid)
);


 
