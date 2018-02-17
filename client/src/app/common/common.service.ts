import { Injectable } from '@angular/core';
import { User } from '../userreg/user.model';
import { Subject } from 'rxjs/Subject';
import { Http } from '@angular/http';
import {Observable} from 'rxjs';

@Injectable()
export class CommonService {
	public UserList: User[]
	public add_subject=new Subject<String>()

constructor(private http: Http) { }

	register(user: User) {
        return this.http.put('/api/register', user);
    }
}