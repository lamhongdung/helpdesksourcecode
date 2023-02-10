import { Component, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { User } from '../model/user';
import { UserService } from '../service/user.service';
import { NotificationService } from '../service/notification.service';
import { NotificationType } from '../enum/notification-type.enum';
import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { CustomHttpRespone } from '../model/custom-http-response';
import { AuthenticationService } from '../service/authentication.service';
import { Router } from '@angular/router';
import { FileUploadStatus } from '../model/file-upload.status';
import { Role } from '../enum/role.enum';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, OnDestroy {
  private titleSubject = new BehaviorSubject<string>('Users');
  public titleAction$ = this.titleSubject.asObservable();
  public users: User[];
  public user: User;
  public refreshing: boolean;
  public selectedUser: User;
  public fileName: string;
  public profileImage: File;

  // use to unsubcribe all subscribe easily, avoid leak memeory
  private subscriptions: Subscription[] = [];
  public editUser = new User();
  private currentUsername: string;
  public fileStatus = new FileUploadStatus();

  constructor(private router: Router, private authenticationService: AuthenticationService,
              private userService: UserService, private notificationService: NotificationService) {}

  ngOnInit(): void {
    // get user info who has just logged in successful
    // this.user = this.authenticationService.getUserFromLocalCache();
    this.user = this.authenticationService.getUserFromLocalStorage();

    // get all users for loading in the table on the screen
    this.getUsers(true);
  }

  public changeTitle(title: string): void {
    this.titleSubject.next(title);
  }

  // showNotification:
  //    - true: will send notification
  //    - false: no need send notification
  public getUsers(showNotification: boolean): void {
    this.refreshing = true;
    this.subscriptions.push(

      // get all users from backend
      this.userService.getUsers().subscribe(
        (response: User[]) => {
          // add users to local storage for searching user
          // this.userService.addUsersToLocalCache(response);

          this.users = response;
          this.refreshing = false;
          if (showNotification) {
            this.sendNotification(NotificationType.SUCCESS, `${response.length} user(s) loaded successfully.`);
          }
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          this.refreshing = false;
        }
      )
    );

  }

  // 
  public onSelectUser(selectedUser: User): void {
    this.selectedUser = selectedUser;
    this.clickButton('openUserInfo');
  }

  public onProfileImageChange(fileName: string, profileImage: File): void {
    this.fileName =  fileName;
    this.profileImage = profileImage;
  }

  public saveNewUser(): void {
    this.clickButton('new-user-save');
  }

  // public onAddNewUser(userForm: NgForm): void {
  //   const formData = this.userService.createUserFormDate(null, userForm.value, this.profileImage);
  //   this.subscriptions.push(
  //     this.userService.addUser(formData).subscribe(
  //       (response: User) => {
  //         // click button "Close"
  //         this.clickButton('new-user-close');
  //         this.getUsers(false);
  //         this.fileName = null;
  //         this.profileImage = null;
  //         userForm.reset();
  //         this.sendNotification(NotificationType.SUCCESS, `${response.firstName} ${response.lastName} added successfully`);
  //       },
  //       (errorResponse: HttpErrorResponse) => {
  //         this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
  //         this.profileImage = null;
  //       }
  //     )
  //     );
  // }

  // public onUpdateUser(): void {
  //   const formData = this.userService.createUserFormDate(this.currentUsername, this.editUser, this.profileImage);
  //   this.subscriptions.push(
  //     this.userService.updateUser(formData).subscribe(
  //       (response: User) => {
  //         this.clickButton('closeEditUserModalButton');
  //         this.getUsers(false);
  //         this.fileName = null;
  //         this.profileImage = null;
  //         this.sendNotification(NotificationType.SUCCESS, `${response.firstName} ${response.lastName} updated successfully`);
  //       },
  //       (errorResponse: HttpErrorResponse) => {
  //         this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
  //         this.profileImage = null;
  //       }
  //     )
  //     );
  // }

  // public onUpdateCurrentUser(user: User): void {
  //   this.refreshing = true;
  //   this.currentUsername = this.authenticationService.getUserFromLocalCache().username;
  //   const formData = this.userService.createUserFormDate(this.currentUsername, user, this.profileImage);
  //   this.subscriptions.push(
  //     this.userService.updateUser(formData).subscribe(
  //       (response: User) => {
  //         this.authenticationService.addUserToLocalCache(response);
  //         this.getUsers(false);
  //         this.fileName = null;
  //         this.profileImage = null;
  //         this.sendNotification(NotificationType.SUCCESS, `${response.firstName} ${response.lastName} updated successfully`);
  //       },
  //       (errorResponse: HttpErrorResponse) => {
  //         this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
  //         this.refreshing = false;
  //         this.profileImage = null;
  //       }
  //     )
  //     );
  // }

  // public onUpdateProfileImage(): void {
  //   const formData = new FormData();
  //   formData.append('username', this.user.username);
  //   formData.append('profileImage', this.profileImage);
  //   this.subscriptions.push(
  //     this.userService.updateProfileImage(formData).subscribe(
  //       (event: HttpEvent<any>) => {
  //         this.reportUploadProgress(event);
  //       },
  //       (errorResponse: HttpErrorResponse) => {
  //         this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
  //         this.fileStatus.status = 'done';
  //       }
  //     )
  //   );
  // }

  // private reportUploadProgress(event: HttpEvent<any>): void {
  //   switch (event.type) {
  //     case HttpEventType.UploadProgress:
  //       // status uploading image file
  //       this.fileStatus.percentage = Math.round(100 * event.loaded / event.total);
  //       this.fileStatus.status = 'progress';
  //       break;
  //     case HttpEventType.Response:
  //       if (event.status === 200) {
  //         this.user.profileImageUrl = `${event.body.profileImageUrl}?time=${new Date().getTime()}`;
  //         this.sendNotification(NotificationType.SUCCESS, `${event.body.firstName}\'s profile image updated successfully`);
  //         this.fileStatus.status = 'done';
  //         break;
  //       } else {
  //         this.sendNotification(NotificationType.ERROR, `Unable to upload image. Please try again`);
  //         break;
  //       }
  //     default:
  //       `Finished all processes`;
  //   }
  // }

  public updateProfileImage(): void {
    this.clickButton('profile-image-input');
  }

  public onLogOut(): void {
    this.authenticationService.logOut();
    this.router.navigate(['/login']);
    this.sendNotification(NotificationType.SUCCESS, `You've been successfully logged out`);
  }

  public onResetPassword(emailForm: NgForm): void {
    this.refreshing = true;
    const emailAddress = emailForm.value['reset-password-email'];
    this.subscriptions.push(
      this.userService.resetPassword(emailAddress).subscribe(
        (response: CustomHttpRespone) => {
          this.sendNotification(NotificationType.SUCCESS, response.message);
          this.refreshing = false;
        },
        (error: HttpErrorResponse) => {
          this.sendNotification(NotificationType.WARNING, error.error.message);
          this.refreshing = false;
        },
        () => emailForm.reset()
      )
    );
  }

  public onDeleteUder(username: string): void {
    this.subscriptions.push(
      this.userService.deleteUser(username).subscribe(
        (response: CustomHttpRespone) => {
          this.sendNotification(NotificationType.SUCCESS, response.message);
          this.getUsers(false);
        },
        (error: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, error.error.message);
        }
      )
    );
  }

  // public onEditUser(editUser: User): void {
  //   this.editUser = editUser;
  //   this.currentUsername = editUser.username;
  //   this.clickButton('openUserEdit');
  // }

  // public searchUsers(searchTerm: string): void {
  //   const results: User[] = [];
  //   for (const user of this.userService.getUsersFromLocalCache()) {
  //     if (user.firstName.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
  //         user.lastName.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
  //         user.username.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
  //         user.userId.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
  //         results.push(user);
  //     }
  //   }
  //   this.users = results;
  //   if (results.length === 0 || !searchTerm) {
  //     this.users = this.userService.getUsersFromLocalCache();
  //   }
  // }

  public get isAdmin(): boolean {
    return this.getUserRole() === Role.ADMIN;
  }

  public get isCustomer(): boolean {
    return this.getUserRole() === Role.CUSTOMER;
  }

  public get isSupporter(): boolean {
    return this.getUserRole() === Role.SUPPORTER;
  }

  // get user role from user saved in the local storage
  private getUserRole(): string {
    // return this.authenticationService.getUserFromLocalCache().role;
    return this.authenticationService.getRoleFromLocalStorage();
  }

  private sendNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, 'An error occurred. Please try again.');
    }
  }

  private clickButton(buttonId: string): void {
    document.getElementById(buttonId).click();
  }

  // unsubscribe all subscriptions
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
