import { Category } from 'src/app/model/Category';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CategoryService } from 'src/app/service/category.service';
import { NotificationService } from 'src/app/service/notification.service';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {

  public categories: Category[];
  public refreshing: boolean;
  private subscriptions: Subscription[] = [];
  
  constructor(private categoryService: CategoryService, 
              private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.getCategories(true);
  }

  public getCategories(showNotification: boolean): void {
    this.refreshing = true;
    this.subscriptions.push(
      this.categoryService.getAllCategories().subscribe(
        (response: Category[]) => {
          this.categories = response;
          this.refreshing = false;

          // if (showNotification) {
          //   this.sendNotification(NotificationType.SUCCESS, `${response.length} category(s) loaded successfully.`);
          // }
        }
        // ,
        // (errorResponse: HttpErrorResponse) => {
        //   this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        //   this.refreshing = false;
        // }
      )
    );

  }



}
