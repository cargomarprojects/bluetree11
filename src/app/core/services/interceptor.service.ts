import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from "rxjs/operators";
import { LoadingScreenService } from './loadingscreen.service';
import { ActivationEnd, Router } from '@angular/router';



@Injectable({
    providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

    skippUrls = [
        '/to',
        '/api/Auth/ActiveUser'
    ];

    
    sub: any;

    activeRequests: number = 0;

    constructor(private loadingScreenService: LoadingScreenService,
        router : Router
    ) {

/*         this.sub = router.events.subscribe(event => {
            // An event triggered at the end of the activation part of the Resolve phase of routing.
            if (event instanceof ActivationEnd ) {
              // Cancel pending calls
              this.activeRequests  =0;
              this.loadingScreenService.stopLoading();
            }
        }); */
    }

    
    ngOnDestroy() {
        this.sub.unsusbscribe();
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
            
        let displayLoadingScreen = true;

        for (const skippUrl of this.skippUrls) {
            if (new RegExp(skippUrl).test(request.url)) {
                displayLoadingScreen = false;
                break;
            }
        }

        if (displayLoadingScreen) {
            if (this.activeRequests === 0) {
                this.loadingScreenService.startLoading();
            }
            this.activeRequests++;
            return next.handle(request).pipe(
                finalize(() => {
                    this.activeRequests--;
                    if (this.activeRequests === 0) {
                        this.loadingScreenService.stopLoading();
                    }
                })
            )
        }
        else {
            return next.handle(request);
        }
    };

}


