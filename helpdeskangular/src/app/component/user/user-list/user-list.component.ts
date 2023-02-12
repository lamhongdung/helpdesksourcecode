import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { IUserDTO } from 'src/app/entity/IUserDTO';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  indexPagination: number = 1;
  totalPagination: number;

  totalOfUsers: number;

  searchUser = new FormGroup({
    searchTerm: new FormControl(''),
    role: new FormControl(''),
    status: new FormControl('')
  });

  users: IUserDTO[] = [];

  // listUserNotPagination: IUserDTO[] = [];

  constructor(private userService: UserService) { }

  ngOnInit(): void {

    this.userService.getAllUsers(0).subscribe(
      (data: IUserDTO[]) => {
        this.users = data;
      });

    // this.userService.getAllUsersNotPagination().subscribe(
    //   (data: IUserDTO[]) => {

    //     this.listUserNotPagination = data;

    //     if ((this.listUserNotPagination.length % 5) != 0) {
    //       this.totalPagination = (Math.round(this.listUserNotPagination.length / 5)) + 1;
    //     } else{
    //       this.totalPagination = this.listUserNotPagination.length / 5;
    //     }
    //   }
    // )

    this.userService.getTotalOfUsers().subscribe(
      (data: number) => {

        this.totalOfUsers = data;

        if ((this.totalOfUsers % 5) != 0) {
          this.totalPagination = (Math.round(this.totalOfUsers / 5)) + 1;
        } else{
          this.totalPagination = this.totalOfUsers / 5;
        }
      }
    )

  }

  search() {

  }

  findPaginnation() {
    this.userService.getAllUsers((this.indexPagination * 5) - 5).subscribe(
      (data: IUserDTO[]) => {
        this.users = data;
      })

  }

  indexPaginationChage(value: number) {
    this.indexPagination = value;
  }

  firtPage() {
    this.indexPagination = 1;
    this.ngOnInit();
  }

  nextPage() {
    this.indexPagination = this.indexPagination + 1;
    if (this.indexPagination > this.totalPagination) {
      this.indexPagination = this.indexPagination - 1;
    }
    this.userService.getAllUsers((this.indexPagination * 5) - 5).subscribe(
      (data: IUserDTO[]) => {
        this.users = data;
      })
  }

  prviousPage() {
    this.indexPagination = this.indexPagination - 1;
    if (this.indexPagination == 0) {
      this.indexPagination = 1;
      this.ngOnInit();
    } else {
      this.userService.getAllUsers((this.indexPagination * 5) - 5).subscribe(
        (data: IUserDTO[]) => {
          this.users = data;
        })
    }
  }

  lastPage() {

    // this.indexPagination = this.listUserNotPagination.length / 5;
    this.indexPagination = this.totalPagination;

    this.userService.getAllUsers((this.indexPagination * 5) - 5).subscribe(
      (data: IUserDTO[]) => {
        this.users = data;
      })
  }
}
