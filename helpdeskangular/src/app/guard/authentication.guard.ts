import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthenticationService } from '../service/authentication.service';
import { NotificationService } from '../service/notification.service';
import { NotificationType } from '../enum/notification-type.enum';

@Injectable({providedIn: 'root'})
export class AuthenticationGuard implements CanActivate {

  constructor(private authenticationService: AuthenticationService, private router: Router,
              private notificationService: NotificationService) {

  }

  // return:
  //    - true: allow access the page
  //    - false: do not allow to access the page
  // canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // return this.isUserLoggedIn();
    let url: string = state.url;
    
    if (this.isUserLoggedIn()){
      let role = this.authenticationService.getRoleFromLocalStorage();

      // if role is not correct
      if(route.data.roles.indexOf(role) === -1){
        this.router.navigate(['/login'], {
          queryParams: { returnUrl: state.url }});
        return false;
      }
      
      return true;
    }

    // if user has not yet logged in then re-direct to the "login" page
    this.router.navigate(['/login']);
    this.notificationService.notify(NotificationType.ERROR, `You need to log in to access this page`);
    return false;
  }

  // 
  private isUserLoggedIn(): boolean {

    // let role = this.authenticationService.getRoleFromLocalStorage();

    // if user logged in then return true(means allow to access the page)
    if (this.authenticationService.isUserLoggedIn()) {
      return true;
    }

    // // if user has not yet logged in then re-direct to the "login" page
    // this.router.navigate(['/login']);
    // this.notificationService.notify(NotificationType.ERROR, `You need to log in to access this page`);
    // return false;
  }

}
