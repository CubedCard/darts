import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game-setup',
  templateUrl: './game-setup.component.html',
  styleUrls: ['./game-setup.component.scss']
})
export class GameSetupComponent {
  gameScores = [101, 301, 501, 701, 1001];
  selectedScore = 301; // Default game type
  selectedSet = '0'; // Default set option
  selectedLegs = '3'; // Default legs option

  players = [{ name: 'Player 1' }, { name: 'Player 2' }]; // Default 2 players

  constructor(private router: Router) {}

  setStartingScore(score: number) {
    this.selectedScore = score;
  }

  addPlayer() {
    this.players.push({ name: '' });
  }

  removePlayer(index: number) {
    if (this.players.length > 2) {
      this.players.splice(index, 1);
    }
  }

  startGame() {
    // Logic to start the game, possibly store player info and redirect
    this.router.navigate(['/game'], {
      queryParams: {
        score: this.selectedScore,
        set: this.selectedSet,
        legs: this.selectedLegs,
        players: JSON.stringify(this.players.map(p => p.name))
      }
    });
  }
}

