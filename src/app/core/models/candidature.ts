import {UserModel} from "./user";
import{Cv} from "./cv";
import { Offer } from "./offer.model";
import { JobOffer } from "./jobOffer";
export interface Conversation {
  user: string;
  Gpt: string;
}
export class Candidature{

    public _id?: string | undefined;
    public user: UserModel;
    public cv: Cv;
    public job: JobOffer;
    public job_id?: string;
    public identifier?: string;
    public application_code?:string;
    public notes?: string;
    public status?: string;
    public appliedAt?: Date;
    public cv_id?:string
    public report_s3?:string;
    public report_path?: string;
    public conversation?: Conversation[];
    public interview_completed?: boolean;
  constructor() {
      this.user = new UserModel();
      this.cv = new Cv();
      this.job = new JobOffer();
    
    }
  
  }
  
  