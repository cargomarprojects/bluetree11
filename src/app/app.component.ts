import { HostListener, Component } from '@angular/core';
import { environment } from '../environments/environment';

import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError, ActivatedRoute } from '@angular/router';

import { LoadingScreenService } from './core/services/loadingscreen.service';
import { GlobalService } from './core/services/global.service';
import { LoginService } from './core/services/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'my App';
  interval: any;
  sub: any;
  startTime = Date.now();
  endTime = Date.now();
  isActive: string = "N";

  enableTimer: boolean = false;

  constructor(
    public gs: GlobalService,
    public loadingservice: LoadingScreenService,
    private router: Router,
    private loginservice: LoginService,
    private route: ActivatedRoute
  ) {

    console.log('app constructor');
    this.gs.InitdefaultValues();

    let itot = +this.gs.getLocalStorageSize();
    console.log('LocalStorage Size ', itot);

    this.gs.RemoveLocalStorage();

    if (this.enableTimer)
      this.startTimer();

    this.sub = this.router.events.subscribe((event) => {
      if (this.gs.IsAuthenticated) {
        if (event instanceof NavigationStart) {
          this.loadingservice.startLoading();
        }
        if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
          // console.log('cancelled');
          this.loadingservice.stopLoading();
        }
      }
    });


  }


  async ngOnInit() {

    console.log('Application Started');
    console.log('Production ', environment.production);


    const appid = this.gs.getURLParam('appid');

    this.gs.appid = appid;
    console.log('appid ', appid);

    if (this.gs.isBlank(appid)) {
      this.router.navigate(['login'], { replaceUrl: true });
      return;
    }

    if (this.gs.isAppidExtistsInLocalStorage()) {
      this.gs.ReadLocalStorage();
      this.gs.reload_url = window.location.pathname + window.location.search;
      this.router.navigate(['/reload']);
    } else {
      this.router.navigate(['login'], { replaceUrl: true });
      return;
    }
    console.log('ngOnInit App completed');

  }

  ngOnDestroy() {
    this.sub.unsusbscribe();
    if (this.enableTimer)
      this.stopTimer();
  }


  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    this.startTime = Date.now();
    this.isActive = "Y";
  }

  @HostListener('mousemove')
  mousemove() {
    this.startTime = Date.now();
    this.isActive = "Y";
  }

  // @HostListener('window:unload', ['$event']) //On Browser closing
  // unloadHandler(event) {
  //   if (this.gs.IsLoginSuccess) {
  //     this.loginservice.Logout();
  //   }
  // }

  @HostListener('window:beforeunload', ['$event']) //On Browser closing
  beforeUnloadHandler(event) {
    if (this.gs.IsLoginSuccess) {
      this.loginservice.Logout();
    }
  }

  /*
  startTimer() {

    this.interval = setInterval(() => {

      if (this.gs.IsLoginSuccess) {

        this.loginservice.SaveActiveUser(this.isActive);
        this.isActive="N";
        
        let storeStartTime = this.readtimerLocalStorage();
        if (this.startTime > +storeStartTime)
          this.savetimerLocalStorage();

        var timeDiff = Date.now() - this.startTime; //in ms
        // strip the ms
        timeDiff /= 1000;
        // get seconds 
        var seconds = Math.round(timeDiff);

        if (seconds >= this.gs.timeoutCount) {
          storeStartTime = this.readtimerLocalStorage();
          if (+storeStartTime > this.startTime)
            this.startTime = +storeStartTime;
          else {
            this.Logout();
          }
        }
        
      }
    }, 60000) //time tick interval

  }
*/

  startTimer() {

    this.interval = setInterval(() => {

      if (this.gs.IsLoginSuccess) {

        this.loginservice.SaveActiveUser(this.isActive);
        this.isActive = "N";

        var timeDiff = Date.now() - this.startTime; //in ms
        // strip the ms
        timeDiff /= 1000;
        // get seconds 
        var seconds = Math.round(timeDiff);
        if (seconds >= this.gs.timeoutCount) {
          this.Logout();
        }

      }
    }, 60000) //time tick interval

  }
  savetimerLocalStorage() {
    try {
      localStorage.setItem('timer', this.startTime.toString());
    } catch (Exception) {
    }
  }

  readtimerLocalStorage() {
    let storeStartTime = '0';
    try {
      storeStartTime = localStorage.getItem('timer');
      if (this.gs.isBlank(storeStartTime))
        storeStartTime = '0';
    } catch (Exception) {
    }
    return storeStartTime;
  }

  stopTimer() {
    // localStorage.removeItem('timer');
    clearInterval(this.interval);
  }

  Logout() {
    this.loginservice.Logout();
    this.gs.MenuList = null;
    this.gs.Modules = null;

    this.router.navigate(['/login'], { replaceUrl: true });

  }



}
