import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';

import { of } from 'rxjs';
import { map, tap,mergeMap, catchError, withLatestFrom } from 'rxjs/operators';

import * as fromparamsactions from './paramdet-page.actions';
import * as fromparamsreducer from './paramdet-page.reducer';

import { getRouterState, SelectRouterParam } from '../../../reducer';

import { PageQuery } from '../../../shared/models/pageQuery';

import { GlobalService } from '../../../core/services/global.service';

import { ParamDetService } from '../../services/paramdet.service';

@Injectable()
export class ParamDetEffects {

    constructor(
        private actions$: Actions,
        private gs: GlobalService,
        private mainService: ParamDetService,
        private store: Store<fromparamsreducer.ParamDetState>
    ) { }

    @Effect()
    loadRecords11$ = this.actions$
        .pipe(
            ofType<fromparamsactions.LoadParamRequest>(fromparamsactions.ParamActionTypes.LOAD_PARAM_REQUEST),
            withLatestFrom(
                this.store.pipe(select(fromparamsreducer.SelectEntity)),
                this.store.pipe(select(getRouterState))
            ),
            mergeMap(([action, ent, router]) => {

                var SearchData = this.gs.UserInfo;
                SearchData.outputformat = 'SCREEN';
                SearchData.action = 'NEW';
                SearchData.pkid = router.state.queryParams.id;
                SearchData.TYPE = router.state.queryParams.menu_param;
                SearchData.page_rowcount = this.gs.ROWS_TO_DISPLAY;

                if (action.payload.type == 'SEARCH') {
                    SearchData.CODE = action.payload.Query.searchString;
                    SearchData.page_count = 0;
                    SearchData.page_rows = 0;
                    SearchData.page_current = -1;
                    this.store.dispatch(
                        new fromparamsactions.UpdateSearch({
                            id: router.state.queryParams.id,
                            menuid: router.state.queryParams.menuid,
                            param_type: router.state.queryParams.menu_param,
                            searchQuery: action.payload.Query,
                        }));
                }
                if (action.payload.type == 'PAGE') {
                    SearchData.action = action.payload.Query.action;
                    SearchData.CODE = ent.searchQuery.searchString;
                    SearchData.page_count = action.payload.Query.page_count;
                    SearchData.page_rows = action.payload.Query.page_rows;
                    SearchData.page_current = action.payload.Query.page_current;;
                }

                return this.mainService.List(SearchData).pipe(
                    map(response => {
                        var pageQuery = <PageQuery>{ action :'NEW', page_rows: response.page_rows, page_count: response.page_count, page_current: response.page_current, page_rowcount: response.page_rowcount };
                        return new fromparamsactions.LoadParamSucces({
                            id: router.state.queryParams.id,
                            pageQuery: pageQuery, records: response.list
                        });
                    }),
                    catchError(err => {
                        return of(new fromparamsactions.LoadParamFail({
                            id: router.state.queryParams.id,
                            errormessage: err.error.Message
                        }))
                    })
                );
            })
        );
}
