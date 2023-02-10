import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { ShareService } from 'src/app/service/share.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  loggedInEmail: string;
  loggedInRole: string;

  constructor(private authenticationService: AuthenticationService,
              private shareService : ShareService) { 

    this.shareService.getClickEvent().subscribe(
      () => {
        this.loadHeader();
      }
    )
  }

  loadHeader() {
    this.loggedInEmail = this.authenticationService.getEmailFromLocalStorage();
    this.loggedInRole = this.authenticationService.getRoleFromLocalStorage();
    console.log(this.loggedInEmail);
  }

  ngOnInit(): void {
    this.loadHeader();
  }

  logOut(){
    
  }
}
