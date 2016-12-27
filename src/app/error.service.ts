import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable()
export class ErrorService {
    public error = new BehaviorSubject<boolean>(false);

    constructor() {
    }
}