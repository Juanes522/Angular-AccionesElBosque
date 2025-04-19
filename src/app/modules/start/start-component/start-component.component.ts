import { Component } from '@angular/core';

@Component({
  selector: 'app-start-component',
  templateUrl: './start-component.component.html',
  styleUrls: ['./start-component.component.css']
})
export class StartComponentComponent {

  menuActive = false;

  toggleMenu(){
    this.menuActive = !this.menuActive;
  }

}
