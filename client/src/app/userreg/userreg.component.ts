import { Component, OnInit } from '@angular/core';
import { User } from './user.model'
import { CommonService } from '../common/common.service'

@Component({
	selector: 'user-reg',
	templateUrl: './userreg.component.html',
	styleUrls: ['./userreg.component.css']

})
export class UserRegComponent implements OnInit {

	private user


	constructor(private commonService:CommonService) {

	}

	register(){
		this.commonService.register(this.user).subscribe(res => {
			this.commonService.add_subject.next()
		})

		this.user = ''
	}

	ngOnInit() {

	}
}
