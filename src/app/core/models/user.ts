export type UserRole = 'candidat' | 'recruteur';

export class UserModel {
  public _id: string | undefined;
  public first_name: string | undefined;
  public last_name: string | undefined;
  public phone: string | undefined;
  public email: string | undefined;
  public email_verified: boolean | undefined;
  public createdAt: string | Date | undefined;
  public updatedAt: string | Date | undefined;
  public img: string | undefined;
  public role: UserRole | undefined;

  constructor(data?: Partial<UserModel>) {
    this._id = data?._id;
    this.first_name = data?.first_name;
    this.last_name = data?.last_name;
    this.phone = data?.phone;
    this.email = data?.email;
    this.email_verified = data?.email_verified;
    this.createdAt = data?.createdAt;
    this.updatedAt = data?.updatedAt;
    this.img = data?.img;
    this.role = data?.role;
  }
}

