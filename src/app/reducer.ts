import { ActionReducerMap, createFeatureSelector, createSelector, MetaReducer } from '@ngrx/store';
import { RouterStateSerializer, routerReducer, RouterReducerState } from '@ngrx/router-store';
import { Params, RouterStateSnapshot } from '@angular/router';
import { environment } from '../environments/environment';
import { storeFreeze } from 'ngrx-store-freeze';

export interface AppState {
}

export const reducers: ActionReducerMap<AppState> = {
    router: routerReducer
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [storeFreeze]: [];

export const getRouterState = createFeatureSelector<RouterReducerState<RouterStateUrl>>('router');


export const SelectRouterParam = createSelector(
    getRouterState,
    (router) => {

        if (router.state) {
            return router.state.queryParams;
        }
        else 
            return null;
    }
);


export const SelectID = createSelector(
    getRouterState,
    (router) => {
        if (router.state) {
            return router.state.queryParams.id;
        }
        else 
            return null;
    }
);

export const SelectMenuID = createSelector(
    getRouterState,
    (router) => {
        if (router.state) {
            return router.state.queryParams.menu_id;
        }
        else 
            return null;
    }
);

export const SelectMenuParam = createSelector(
    getRouterState,
    (router) => {
        if (router.state) {
            return router.state.queryParams.menu_param;
        }
        else 
            return null;
    }
);




// Custom Router Serializer
export interface RouterStateUrl {
    url: string;
    params: Params;
    queryParams: Params;
}

export class CustomSerializer implements RouterStateSerializer<RouterStateUrl> {
    serialize(routerState: RouterStateSnapshot): RouterStateUrl {
        let route = routerState.root;

        while (route.firstChild) {
            route = route.firstChild;
        }

        const {
            url,
            root: { queryParams },
        } = routerState;
        const { params } = route;

        // Only return an object including the URL, params and query params
        // instead of the entire snapshot
        return { url, params, queryParams };
    }
}
