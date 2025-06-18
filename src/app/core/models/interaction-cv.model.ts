import { Cv } from "./cv";

export interface InteractionCVModel { 
    user_id: string;
    cv: Cv;
    prompt: any;
    chats?: any[];
}