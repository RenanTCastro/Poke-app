import { Component, Input } from '@angular/core';
import { IonCard, IonIcon } from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { heartOutline } from 'ionicons/icons';

@Component({
  selector: 'app-card-info',
  standalone: true,
  templateUrl: './card-info.component.html',
  styleUrls: ['./card-info.component.scss'],
  imports: [ IonCard, IonIcon ],
})

export class CardInfoComponent {

  constructor (){
    addIcons({ heartOutline });
  }

  @Input() name: string = '';
  @Input() id: string = '';
  @Input() image: string = '';
}
