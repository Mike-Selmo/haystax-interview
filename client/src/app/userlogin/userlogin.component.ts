import { Component, OnInit } from '@angular/core';
import { CommonService } from '../common/common.service'
import { User } from '../userreg/user.model'

@Component({
  selector: 'article-list',
  templateUrl: './userlogin.component.html',
  styleUrls: ['./userlogin.component.css']
})
export class UserLoginComponent implements OnInit {

	constructor(private commonService:CommonService){

	}

	ngOnInit(){


	}

}
