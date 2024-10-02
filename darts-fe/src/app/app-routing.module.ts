import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { GameComponent } from './components/game/game.component';
import { GameSetupComponent } from './components/game-setup/game-setup.component';

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'game', component: GameComponent},
  {path: 'game-setup', component: GameSetupComponent},
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: '**', redirectTo: '/home', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
