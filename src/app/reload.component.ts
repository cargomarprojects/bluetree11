import { Component } from '@angular/core';
import { environment } from '../environments/environment';

import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError, ActivatedRoute } from '@angular/router';

import { LoadingScreenService } from './core/services/loadingscreen.service';
import { GlobalService } from './core/services/global.service';

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
    private route : ActivatedRoute
  ) {


  }

  async ngOnInit() {
    let url = this.gs.reload_url;
    this.gs.reload_url = '';
    if ( url == '')
      this.router.navigate(['home'], { replaceUrl: true }); 
      
    await this.gs.LoadSettings();
    await this.gs.LoadMenu();    

    this.router.navigateByUrl(url,{ replaceUrl: true });

    this.gs.IsLoginSuccess = true;
    this.gs.IsAuthenticated = true;    
    
  }
 
  ngOnDestroy() {
    
  }


}
