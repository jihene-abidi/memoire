import {UserModel} from "./user";
type tripleType = string | Date | undefined;


export class FileModel {
  public _id!: string;
  public type: string | undefined;
  public name: string | undefined;
  public hash: string | undefined;
  public path: string | undefined;
  public signedUrl: string | undefined;
  public context: string | undefined;
  public owner : UserModel;
  public createdAt:tripleType ;
  public updatedAt: tripleType;
  public deletion_date: tripleType;





  constructor() {
    this.owner = new UserModel();
  }
}
