

import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createFeatureSelector, createSelector } from '@ngrx/store';

import { ParamActionTypes, ParamActions } from './paramdet-page.actions';
import { ParamModel } from './paramdet-page.models';
import { SearchQuery } from './paramdet-page.models';

import { PageQuery } from '../../../shared/models/pageQuery';

import { getRouterState } from '../../../reducer';

import * as _ from 'lodash';






export interface ParamDetState extends EntityState<ParamModel> {
}

export const adapter: EntityAdapter<ParamModel> =
    createEntityAdapter<ParamModel>({ selectId: param => param.id });

export const initialParamState: ParamDetState = adapter.getInitialState();

export function ParamDetReducer(state: ParamDetState = initialParamState, action: ParamActions): ParamDetState {
    switch (action.type) {
        case ParamActionTypes.UPDATE_SEARCH: {

            const record: ParamModel = {
                appid: action.payload.appid,
                id: action.payload.id,
                menuid: action.payload.menuid,
                param_type: action.payload.param_type,
                errormessage: '',
                sortcol: '',
                sortorder: true,
                pageQuery: <PageQuery>{ action: 'NEW', page_rows: 0, page_count: 0, page_current: -1, page_rowcount: 0 },
                searchQuery: action.payload.searchQuery,
                records: []
            }
            return adapter.upsertOne(record, state);
        }
        case ParamActionTypes.LOAD_PARAM_SUCCESS: {
            const st = Object.assign({}, state.entities[action.payload.id]);
            st.pageQuery = action.payload.pageQuery;
            st.records = action.payload.records;
            st.sortcol = '';
            st.sortorder = true;
            st.errormessage = '';
            return adapter.upsertOne(st, state);
        }
        case ParamActionTypes.SORT_DATA: {

            if ( state.entities[action.payload.id] == null )
                return state;

            const st = Object.assign({}, state.entities[action.payload.id]);
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
            st.errormessage = '';
            return adapter.upsertOne(st, state);
        }
        case ParamActionTypes.LOAD_PARAM_FAIL: {
            const st = Object.assign({}, state.entities[action.payload.id], { errormessage: action.payload.errormessage });
            return adapter.upsertOne(st, state);
        }

        default: {
            return state;
        }
    }
}

export const SelectParamsState = createFeatureSelector<ParamDetState>('paramdet');

export const SelectAllParams = createSelector(
    SelectParamsState,
    adapter.getSelectors().selectAll
);

export const SelectEntity = createSelector(
    SelectParamsState,
    getRouterState,
    (state: ParamDetState, router) => {
        if (state == null || router == null)
            return null;
        if (state.entities[router.state.queryParams.id])
            return state.entities[router.state.queryParams.id];
        else
            return null;
    }
);

export const SelectPageData = createSelector(
    SelectParamsState,
    getRouterState,
    (state: ParamDetState, router) => {
        if (router.state) {
            if (state.entities[router.state.queryParams.id])
                return state.entities[router.state.queryParams.id].pageQuery;
            else
                return <PageQuery>{ action: 'NEW', page_count: 0, page_rows: 0, page_current: 0, page_rowcount: 0 };
        }
    }
);

export const SelectSearchData = createSelector(
    SelectParamsState,
    getRouterState,
    (state: ParamDetState, router) => {
        if (router.state) {
            if (state.entities[router.state.queryParams.id])
                return state.entities[router.state.queryParams.id].searchQuery
            else
                return <SearchQuery>{ searchString: '' };
        }
    }
);

export const SelectRecords = createSelector(
    SelectParamsState,
    getRouterState,
    (state: ParamDetState, router) => {
        if (router.state) {
            if (state.entities[router.state.queryParams.id])
                return state.entities[router.state.queryParams.id].records;
            else
                return null;
        }
    }
);


export const getErrorMessage = createSelector(
    SelectParamsState,
    getRouterState,
    (state: ParamDetState, router) => {
        if (router.state) {
            if (state.entities[router.state.queryParams.id])
                return state.entities[router.state.queryParams.id].errormessage;
            else
                return null;
        }
    }
);

export const getSortCol = createSelector(
    SelectParamsState,
    getRouterState,
    (state: ParamDetState, router) => {
        if (state && router) {
            if (router.state) {
                if (state.entities[router.state.queryParams.id])
                    return state.entities[router.state.queryParams.id].sortcol;
                else
                    return null;
            }
        }
        return null;
    }
);


export const getSortOrder = createSelector(
    SelectParamsState,
    getRouterState,
    (state: ParamDetState, router) => {
        if (state && router) {
            if (state && router.state) {
                if (state.entities[router.state.queryParams.id])
                    return state.entities[router.state.queryParams.id].sortorder;
                else
                    return null;
            }
        }
        return null;
    }
);