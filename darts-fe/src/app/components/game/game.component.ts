import { Component, OnInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

interface Player {
  name: string;
  legs: number;
  sets: number;
  scores: number[];
  currentScore: number; average: number;
}

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  private readonly MAX_SCORE = 180; // Maximum score for a single turn
  private readonly MIN_SCORE = 0; // Minimum score for a single turn

  players: Player[] = []; // Array of players
  currentPlayerIndex: number = 0; // Index of the current player
  currentScore: number = 0; // Current score displayed
  currentScoreInput: number = 0; // Input for current score
  selectedScore: number = 301; // Default Game type score
  selectedSets: number = 0; // Default number of sets
  selectedLegs: number = 0; // Default number of legs
  lastScoreAdded: { playerIndex: number; score: number }[] = []; // Last score added
  legsPlayed: number = 0; // Number of legs played

  @ViewChildren('playerInput') playerInputs!: QueryList<ElementRef>;

  constructor(private route: ActivatedRoute,
             private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const playerNames = JSON.parse(params['players']) || [];
      this.selectedScore = +params['score'] || 301;
      this.selectedSets = +params['set'] || 0;
      this.selectedLegs = +params['legs'] || 0;

      this.players = playerNames.map((name: string) => ({
        name,
        legs: 0,
        sets: 0,
        scores: [],
        currentScore: this.selectedScore,
        average: 0
      }));

      this.currentScore = this.selectedScore;
    });
  }

  addScore(playerIndex: number) {
    if (this.currentScoreInput > this.MAX_SCORE
       || this.currentScoreInput < this.MIN_SCORE) {
      return;
    }

    if (this.currentScoreInput > this.players[playerIndex].currentScore) {
      this.currentScoreInput = 0; // bust
    }

    // Add score to the current player's score list
    this.players[playerIndex].scores.push(this.currentScoreInput);
    this.lastScoreAdded.push({ playerIndex, score: this.currentScoreInput }); // Save last added score
    this.currentScoreInput = 0; // Reset input
    this.updateCurrentScore(); // Update current score

    // Check if the player has won
    if (this.players[playerIndex].currentScore === 0) {
      this.players[playerIndex].legs++;
      if (this.players[playerIndex].legs === this.selectedLegs) {
        if (this.selectedSets > 0) {
          this.players[playerIndex].sets++;
          if (this.players[playerIndex].sets === this.selectedSets) {
            // Player has won
            alert(`${this.players[playerIndex].name} has won the game!`);
            this.router.navigate(['/game-setup']);
          } else {
            // Reset legs
            this.players.forEach(player => player.legs = 0);
          }
        } else {
          alert(`${this.players[playerIndex].name} has won the game!`);
          this.router.navigate(['/game-setup']);
        }
      }

      // Reset scores
      this.players.forEach(player => player.scores = []);
      this.currentScore = this.selectedScore; // Reset current score
      this.currentPlayerIndex = 0; // Reset player index
      this.legsPlayed++;
      this.players.forEach(player => player.currentScore = this.selectedScore); // Reset current score for all players
      this.currentPlayerIndex = this.legsPlayed % this.players.length; // Move to next player
    }
    else {
      this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length; // Move to next player
    }

    setTimeout(() => this.focusNextPlayerInput(), 0);
  }

  undoLastScore() {
    if (this.lastScoreAdded) {
      const { playerIndex, score } = this.lastScoreAdded.pop()!;
      const playerScores = this.players[playerIndex].scores;

      if (playerScores.length > 0) {
        // Remove the last score added
        this.players[playerIndex].scores.pop(); // Remove the last score
        this.currentScoreInput = score; // Restore the score to the input for possible reuse
        this.currentPlayerIndex = playerIndex; // Set back to the correct player index
        this.updateCurrentScore(); // Update the current score
      }
    }
  }

  updateCurrentScore() {
    // Update the current score based on the player's scores
    this.players[this.currentPlayerIndex].currentScore = this.selectedScore - this.players[this.currentPlayerIndex].scores.reduce((a, b) => a + b, 0);
    this.players[this.currentPlayerIndex].average = Math.round(this.players[this.currentPlayerIndex].scores.reduce((a, b) => a + b, 0) / this.players[this.currentPlayerIndex].scores.length * 100) / 100;
  }

  focusNextPlayerInput() {
    const nextPlayerInput = this.playerInputs.toArray()[this.currentPlayerIndex]?.nativeElement;
    if (nextPlayerInput) {
      nextPlayerInput.focus();
    }
  }
}

