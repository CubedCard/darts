import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Assuming you'll navigate to a new game component

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router) {}

  startGame() {
    // Navigate to the game component, assuming you have a route for it
    this.router.navigate(['/game-setup']);
  }

  ngOnInit(): void {
  }

}
