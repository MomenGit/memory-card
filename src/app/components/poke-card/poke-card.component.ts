import { Component, input, OnInit, output } from '@angular/core';
import { IPokemon } from '../../models/ipokemon';

@Component({
  selector: 'app-poke-card',
  imports: [],
  templateUrl: './poke-card.component.html',
  styleUrl: './poke-card.component.css',
})
export class PokeCardComponent {
  pokemon = input<IPokemon>();
  cardClicked = output();

  onClick() {
    this.cardClicked.emit();
  }
}
