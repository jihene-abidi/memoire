import {ResponseStatusEnum} from "../enums/response-status";

export class ResponseStatusModel {
    status: ResponseStatusEnum;
    message: string;

    constructor(status: ResponseStatusEnum, message: string) {
        this.status = status;
        this.message = message;
    }
}
