import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../services/global.service';
import { LoginService } from '../services/login.service';
import { User_Menu } from '../models/menum';
import { LoadingScreenService } from '../services/loadingscreen.service';
import { Observable } from 'rxjs';


@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
})
export class HeaderComponent {
    public isNavbarCollapsed = true;
    title = 'BlueTree Systems';
    id = '';

    loading  = false;
    sub : any ;

    constructor(
        private router: Router,
        private location: Location,
        public gs: GlobalService,
        private loadingScreenService: LoadingScreenService,
        private loginservice: LoginService) {
            this.sub = this.loadingScreenService.loadingStatus.subscribe( value =>  this.loading = value);
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }


    LoadPage(rec: User_Menu) {
        this.getUrlID();
        this.id = rec.menu_pkid;

        if (rec.menu_xap_class == 'ShipmentLogPage' || rec.menu_xap_class == 'ShipmentClosingPage' || rec.menu_xap_class == 'PaymentRequest' || rec.menu_xap_class == 'PaymentDuePage')
            rec.menu_xap_dll = 'Silver.Reports.General';


        const menu_route = rec.menu_xap_dll + '/' + rec.menu_xap_class;
        rec.menu_route2 = '';
        console.log(menu_route);
        this.router.navigate([menu_route], { queryParams: { id: this.id, menuid: rec.menu_pkid, menu_param: rec.menu_param } });
    }


    getLink(rec) {
        if (rec.menu_xap_class == 'ShipmentLogPage' || rec.menu_xap_class == 'ShipmentClosingPage' || rec.menu_xap_class == 'PaymentRequest' || rec.menu_xap_class == 'PaymentDuePage')
            rec.menu_xap_dll = 'Silver.Reports.General';
        const menu_route = "/" + rec.menu_xap_dll + '/' + rec.menu_xap_class;
        rec.menu_route2 = '';
        return menu_route;
    }

    getParam(rec) {
        return { appid: this.gs.appid, id: rec.menu_pkid, menuid: rec.menu_pkid, menu_param: rec.menu_param };
    }

    getQParam(rec) {
        this.id = rec.menu_pkid;
        return { id: this.id, menuid: rec.menu_pkid, menu_param: rec.menu_param };
    }


    home() {
        if (this.gs.IsAuthenticated)
            this.router.navigate(['/home']);
        else
            this.router.navigate(['/home'], { replaceUrl: true });
    }

    login() {
        this.router.navigate(['login'], { replaceUrl: true });
    }

    changeBranch() {
        this.router.navigate(['login2'], { replaceUrl: true });
    }


    Logout() {
        this.loginservice.Logout();
        this.gs.MenuList = null;
        this.gs.Modules = null;
        this.router.navigate(['home'], { replaceUrl: true });
    }

    getUrlID() {
        this.id = this.gs.getGuid();
    }

    getTEST() {
        return 'FROM AJITH COMPUTER';
    }

}
