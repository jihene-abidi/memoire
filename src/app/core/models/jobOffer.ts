import {UserModel} from "./user";

export class JobOffer {
  public _id!: string;
  public link: string;
  public title?: string;
  public date: Date | undefined;
  public start_date?: string;;
  public company?: string;
  public location: string[] | undefined;
  public technologies?: string[] | string;
  public skills?: string[] | string;
  public level?: string;
  public description?: string;
  public salaire?: string;
  public published_on?: string;
  public expired?: string;
  public visibility?: string;
  public created_by?:any;
  public user: UserModel | undefined;
  public like: number | undefined;
  public dislike: number | undefined;
  public deletion_date: Date | undefined;
  public details: string;
  public createdAt: Date | undefined;
  public updatedAt: Date | undefined;

  constructor(link: string = '', title: string = '', details: string = '') {
    this.link = link;
    this.title = title;
    this.details = details;
  }
}