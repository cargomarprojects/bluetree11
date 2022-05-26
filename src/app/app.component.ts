import { HostListener, Component, ViewChild, ElementRef } from '@angular/core';
import { environment } from '../environments/environment';

import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError, ActivatedRoute } from '@angular/router';

import { LoadingScreenService } from './core/services/loadingscreen.service';
import { GlobalService } from './core/services/global.service';
import { LoginService } from './core/services/login.service';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
  password: string = '';
  modal: any;
  @ViewChild('pwdmodal') pwdmodal_Cntrl: ElementRef;
  @ViewChild('usr_pwd') usr_pwd_Cntrl: ElementRef;

  constructor(
    private modalconfig: NgbModalConfig,
    private modalservice: NgbModal,
    public gs: GlobalService,
    public loadingservice: LoadingScreenService,
    private router: Router,
    private loginservice: LoginService,
    private route: ActivatedRoute
  ) {
    modalconfig.backdrop = 'static'; //true/false/static
    modalconfig.keyboard = false; //true Closes the modal when escape key is pressed

    console.log('app constructor');
    this.gs.InitdefaultValues();

    let itot = +this.gs.getLocalStorageSize();
    console.log('LocalStorage Size ', itot);

    this.gs.RemoveLocalStorage();


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

        if (seconds >= this.gs.TIMEOUT_IN_MINUTES) {
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

        this.loginservice.SaveActiveUser(this.isActive,'ACTIVE');
        this.isActive = "N";

        if (this.gs.user_disable_timer == "N") {
          var timeDiff = Date.now() - this.startTime; //in ms
          // strip the ms
          timeDiff /= 1000;
          // get seconds 
          var seconds = Math.round(timeDiff);
          if (seconds >= this.gs.TIMEOUT_IN_MINUTES) { //TIMEOUT_IN_MINUTES convert to seconds while loading from globalsettings
            this.ShowValidateUser();
          }
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

  ShowValidateUser() {
    this.stopTimer();
    this.loginservice.SaveActiveUser(this.isActive,'LOGOUT');
    this.modalconfig.backdrop = 'static'; //true/false/static
    this.modalconfig.keyboard = false;
    this.modal = this.modalservice.open(this.pwdmodal_Cntrl, { centered: true });
  }

  validUser() {
    var SearchData = this.gs.UserInfo;
    SearchData.company_pkid = this.gs.company_pkid;
    SearchData.user_code = this.gs.user_code;
    SearchData.user_pwd = this.password.toString().toUpperCase();
    SearchData.user_pkid = this.gs.user_pkid;
    SearchData.appid = this.gs.appid;
   
    this.loginservice.ValidUser(SearchData)
      .subscribe(response => {
        if (response.blogin) {
          this.password = '';
          this.CloseModal();
          this.startTimer();
        }
        else {
          if (!this.gs.isBlank(this.usr_pwd_Cntrl))
            this.usr_pwd_Cntrl.nativeElement.focus();
          alert('Invalid Password');
        }

      }, error => {
        alert(this.gs.getError(error));
      });

  }
  CloseModal() {
    this.modal.close();
  }


}
