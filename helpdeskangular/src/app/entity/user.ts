export class User {
  // public userId: string;
  public email: string;
  public firstName: string;
  public lastName: string;
  public phone: string;
  public address: string;
  public role: string;
  public status: string;

  public lastLoginDate: Date;
  public lastLoginDateDisplay: Date;
  public joinDate: Date;
  // public profileImageUrl: string;

  // public notLocked: boolean;

  // public authorities: [];

  constructor() {
    // this.userId = '';
    this.email = '';
    this.firstName = '';
    this.lastName = '';
    this.phone = '';
    this.address = '';
    this.role = '';
    this.status = 'Inactive';
    
    this.lastLoginDate = null;
    this.lastLoginDateDisplay = null;
    this.joinDate = null;
    // this.profileImageUrl = '';
    // this.notLocked = false;
    // this.authorities = [];
  }

}
