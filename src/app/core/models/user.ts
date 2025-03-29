
interface Roles {
  companies?: string[];
  accounting?: string[];
  salaries?: string[];
  rh?: string[];
  partner?:string[];
  prestataire?:string[];
}

type tripleType=string | Date | undefined;
  export class UserModel {
  public _id: string | undefined;
  public userName:  string| undefined;
  public lastName:  string| undefined;
  public phone:  string| undefined;
  public email:  string| undefined;
  public email_verified: boolean| undefined;
  public sub: string | undefined;
  public clientId: string | undefined;
  public userPoolId: string | undefined;
  public createdAt: string | Date | undefined;
  public updatedAt: string | Date | undefined;
  public img: string | undefined;
  public isSuperAdmin: boolean | undefined;
  public deletionDate: tripleType;
  public roles: Roles;

  constructor(username?: string, email?: string) {

    this.userName = username;
    this.email = email;
    this.roles = {};
  }
}

