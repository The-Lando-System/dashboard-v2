import { Component, OnInit } from '@angular/core';

import { Broadcaster } from 'sarlacc-angular-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  constructor(
    private broadcaster: Broadcaster
  ){}

  ngOnInit() {}

}
