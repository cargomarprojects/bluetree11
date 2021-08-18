import { Component } from '@angular/core';
import { environment } from '../environments/environment';

import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError, ActivatedRoute } from '@angular/router';

import { LoadingScreenService } from './core/services/loadingscreen.service';
import { GlobalService } from './core/services/global.service';


import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-reload',
  templateUrl: './reload.component.html'
})
export class ReloadComponent {

  loading = false;
  constructor(
    public gs: GlobalService,
    public loadingservice: LoadingScreenService,
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title
  ) {


  }

  async ngOnInit() {
    let url = this.gs.reload_url;
    this.gs.reload_url = '';
    if (url == '')
      this.router.navigate(['home'], { replaceUrl: true });

    await this.gs.LoadSettings();
    await this.gs.LoadMenu();
    this.gs.CheckAdminRights();

    if (!this.gs.IsGlobalDataOk()) {
      this.router.navigate(['login'], { replaceUrl: true });
      return;
    }
    
    var menuid = this.gs.getURLParamFromString(url,'menuid');
    if ( menuid != '') {
      var title  = this.gs.getTitle(menuid);
      if ( title != '') {
        this.titleService.setTitle(title);    
      }
    }

    this.router.navigateByUrl(url, { replaceUrl: true });

    this.gs.IsLoginSuccess = true;
    this.gs.IsAuthenticated = true;

  }


  ngOnDestroy() {

  }


}
