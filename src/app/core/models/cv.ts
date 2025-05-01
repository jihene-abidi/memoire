import {UserModel} from "./user";

export enum Visibility {
  Public = 'Public',
  Private = 'Private',
}


export class Cv {
  public _id: string | undefined;
  public title: string;
  public user: UserModel;
  public cv_s3: string;
  public cv_txt: string | undefined;
  public expertise: any;
  imageSrc?: string;
  createdAt?: Date | undefined;
  updatedAt?: Date | undefined;
  public visibility: Visibility;

  constructor() {
    this._id = undefined;
    this.title = '';
    this.user = new UserModel();
    this.cv_s3 = '';
    this.cv_txt = '';
    this.expertise = '';
    this.visibility = Visibility.Private;
  }
}
