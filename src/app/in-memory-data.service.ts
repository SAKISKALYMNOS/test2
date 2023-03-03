import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { User } from './user';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const users = [
      { id: 12, name: 'SAKIS' },
      { id: 13, name: 'GIORGOS' },
      { id: 14, name: 'XRISTINA' },
      { id: 15, name: 'THEMI' },
      { id: 16, name: 'STELIOS' },
      { id: 17, name: 'GIANNHS' },
      { id: 18, name: 'DIMHTRA' },
      { id: 19, name: 'BAGGELIS' },
      { id: 20, name: 'XRISTOS' }
    ];
    return {users};
  }

  // Overrides the genId method to ensure that a hero always has an id.
  //Αντικαθιστά τη μέθοδο genId για να διασφαλίσει ότι ένας ήρωας έχει πάντα ένα αναγνωριστικό.
  // If the heroes array is empty,
  // Εάν ο πίνακας των ηρώων είναι κενός,
  // the method below returns the initial number (11).
    // η παρακάτω μέθοδος επιστρέφει τον αρχικό αριθμό (11).
  // if the heroes array is not empty, the method below returns the highest
    // εάν ο πίνακας ηρώων δεν είναι κενός, η παρακάτω μέθοδος επιστρέφει το υψηλότερο
  // hero id + 1.
  // αναγνωριστικό ήρωα + 1.
  genId(users: User[]): number {
    return users.length > 0 ? Math.max(...users.map(user => user.id)) + 1 : 11;
  }
}