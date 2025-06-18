import {UserModel} from "./user";

export enum Visibility {
  Public = 'public',
  Private = 'private',
}


export class Cv {
  public _id: string | undefined;
  public title: string;
  public user: UserModel;
  //public cv_txt: string | undefined;
  //public expertise: any;
  imageSrc?: string;
  createdAt?: Date | undefined;
  updatedAt?: Date | undefined;
  public visibility: Visibility;

  constructor() {
    this._id = undefined;
    this.title = '';
    this.user = new UserModel();
    this.visibility = Visibility.Private;
  }
}