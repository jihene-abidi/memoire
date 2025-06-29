import {UserModel} from "./user";
import{Cv} from "./cv";
import { Offer } from "./offer.model";
import { JobOffer } from "./jobOffer";

export class Candidature{

    public _id?: string | undefined;
    public user: UserModel;
    public cv: Cv;
    public job: JobOffer;
    public job_id?: string;
    public identifier?: string;
    application_code?:string;
    public notes?: string;
    public status?: string;
    public appliedAt?: Date;
    public cv_id?:string
    public report_s3?:string;
  constructor() {
      this.user = new UserModel();
      this.cv = new Cv();
      this.job = new JobOffer();
    
    }
  
  }
  
  