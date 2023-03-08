import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Team } from 'src/app/entity/Team';
import { NotificationType } from 'src/app/enum/NotificationType.enum';
import { NotificationService } from 'src/app/service/notification.service';
import { TeamService } from 'src/app/service/team.service';

@Component({
  selector: 'app-team-create',
  templateUrl: './team-create.component.html',
  styleUrls: ['./team-create.component.css']
})
export class TeamCreateComponent implements OnInit {

  // allow display spinner icon or not
  // =true: allow to display spinner in the "Save" button
  // =false: do not allow to display spinner in the "Save" button
  showSpinner: boolean;

  // use to unsubcribe all subscribes easily, avoid leak memeory
  subscriptions: Subscription[] = [];

  teamForm: FormGroup;

  team: Team;

  errorMessages = {
    name: [
      { type: 'required', message: 'Please input team name' },
      { type: 'maxlength', message: 'Name cannot be longer than 50 characters' }
    ]
  };

  constructor(private router: Router,
    private teamService: TeamService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService) { }

  // this method ngOnInit() is run after the component "TeamCreateComponent" is contructed
  ngOnInit(): void {

    // initial form
    this.teamForm = this.formBuilder.group({

      // required and max length = 50 characters
      name: ['', [Validators.required, Validators.maxLength(50)]],

      // initial value = 'A'(Auto)
      assignmentMethod: ['A'],

      // initial value = 'Active'
      status: ['Active']
    });

  } // end of ngOnInit()

  // create team.
  // when user clicks the "Save" button in the "Create tean" screen
  createTeam() {

    // allow to show spinner(circle)
    this.showSpinner = true;

    // push into the subscriptions list in order to unsubscribes all easily
    this.subscriptions.push(

      // create team
      this.teamService.createTeam(this.teamForm.value).subscribe(

        // create team successful
        (data: Team) => {

          this.team = data;

          // show successful message to user 
          this.sendNotification(NotificationType.SUCCESS, `Team '${data.name}' is created successfully`);

          // hide spinner(circle)
          this.showSpinner = false;

          // navigate to the "team-list" page
          this.router.navigateByUrl("/team-list");
        },

        // create team failure
        (errorResponse: HttpErrorResponse) => {

          // show the error message to user
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);

          // hide spinner(circle)
          this.showSpinner = false;
        }
      )
    );

  } // end of createTeam()

  // send notification to user
  private sendNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, 'An error occurred. Please try again.');
    }
  }

  // unsubscribe all subscriptions from this component "TeamCreateComponent"
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

} // end of the TeamCreateComponent class
