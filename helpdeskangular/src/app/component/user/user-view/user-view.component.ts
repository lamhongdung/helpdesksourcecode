import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/entity/User';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { NotificationService } from 'src/app/service/notification.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.css']
})
export class UserViewComponent implements OnInit {

  // use to unsubcribe all subscribes easily, avoid leak memeory
  subscriptions: Subscription[] = [];

  userForm: FormGroup;
  user: User;

  // user id
  id: number;

  constructor(private router: Router, private userService: UserService, private notificationService: NotificationService,
    private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute) { }

  // initial values
  ngOnInit(): void {

    this.userForm = this.formBuilder.group({

      // initial values for fields
      id: [''],
      email: [''],
      firstName: [''],
      lastName: [''],
      phone: [''],
      address: [''],
      role: [{value: '', disabled: true}],
      status: [{value: '', disabled: true}]

    });

    // get user id from params of active route.
    // and get user based on user id from database
    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {

      // get id from param of active route.
      // ex: http://localhost:4200/user-view/:id
      // ex: http://localhost:4200/user-view/3
      this.id = +params.get('id');

      // get user by user id
      this.userService.findById(this.id).subscribe(

        (data: User) => {

          this.user = data;

          // load user information to the userForm
          this.userForm.patchValue(data);

        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        }
      );
    });

  }

  // send notification to user
  private sendNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, 'An error occurred. Please try again.');
    }
  }

  // unsubscribe all subscriptions from this component "UserComponent"
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
