import {UserModel} from "./user";
import {Expertise} from "./expertise";

export enum Visibility {
  Public = 'public',
  Private = 'private',
}


export class Cv {
  public _id: string | undefined;
  public title: string;
  public user: UserModel;
  imageSrc?: string;
  createdAt?: Date | undefined;
  updatedAt?: Date | undefined;
  public expertise: Expertise;
  public visibility: Visibility;
  public cv_txt: string | undefined;

  constructor() {
    this._id = undefined;
    this.title = '';
    this.user = new UserModel();
    this.expertise = new Expertise();
    this.visibility = Visibility.Private;
    this.cv_txt = '';
  }
}