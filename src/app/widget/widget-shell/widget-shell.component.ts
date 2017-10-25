import { Component, OnInit, Input } from '@angular/core';
import { Broadcaster } from 'sarlacc-angular-client';

@Component({
  moduleId: module.id,
  selector: 'widget-shell',
  templateUrl: 'widget-shell.component.html',
  styleUrls: [ 'widget-shell.component.css' ]
})
export class WidgetShellComponent implements OnInit {

  @Input() title;
  @Input() id;

  constructor(
    private broadcaster: Broadcaster
  ){}

  ngOnInit(): void {}

}