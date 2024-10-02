import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

interface Player {
  name: string;
  legs: number;
  sets: number;
  scores: number[];
}

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  players: Player[] = []; // Array of players
  currentPlayerIndex: number = 0; // Index of the current player
  currentScore: number = 0; // Current score displayed
  currentScoreInput: number = 0; // Input for current score
  selectedScore: number = 301; // Default Game type score
  selectedSets: number = 0; // Default number of sets
  selectedLegs: number = 0; // Default number of legs
  lastScoreAdded: { playerIndex: number; score: number } | null = null; // Store last added score

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const playerNames = JSON.parse(params['players']) || [];
      this.selectedScore = +params['score'] || 301;
      this.selectedSets = +params['set'] || 0;
      this.selectedLegs = +params['legs'] || 0;

      this.players = playerNames.map((name: string) => ({
        name,
        legs: this.selectedLegs,
        sets: this.selectedSets,
        scores: []
      }));

      this.currentScore = this.selectedScore;
    });
  }

  addScore(playerIndex: number) {
    if (this.currentScoreInput) {
      // Add score to the current player's score list
      this.players[playerIndex].scores.push(this.currentScoreInput);
      this.lastScoreAdded = { playerIndex, score: this.currentScoreInput }; // Save last added score
      this.currentScoreInput = 0; // Reset input
      this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length; // Move to next player
      this.updateCurrentScore(); // Update current score
    }
  }

  undoLastScore() {
    if (this.lastScoreAdded) {
      const { playerIndex, score } = this.lastScoreAdded;
      const playerScores = this.players[playerIndex].scores;

      if (playerScores.length > 0) {
        // Remove the last score added
        this.players[playerIndex].scores.pop(); // Remove the last score
        this.currentScoreInput = score; // Restore the score to the input for possible reuse
        this.lastScoreAdded = null; // Clear last added score reference
        this.currentPlayerIndex = playerIndex; // Set back to the correct player index
        this.updateCurrentScore(); // Update the current score
      }
    }
  }

  updateCurrentScore() {
    // Update the current score based on the player's scores
    this.currentScore = this.selectedScore - this.players[this.currentPlayerIndex].scores.reduce((a, b) => a + b, 0);
  }
}

