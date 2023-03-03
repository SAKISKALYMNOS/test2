import { Component, OnInit } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import {
   debounceTime, distinctUntilChanged, switchMap
 } from 'rxjs/operators';

import { User } from '../users';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-search',
  templateUrl: './user-search.component.html',
  styleUrls: [ './user-search.component.css' ]
})
export class UserSearchComponent implements OnInit {
  users$!: Observable<User[]>;
  private searchTerms = new Subject<string>();

  constructor(private userService: UserService) {}

  // Push a search term into the observable stream.
  // Σπρώξτε έναν όρο αναζήτησης στην παρατηρήσιμη ροή.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.users$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      // περιμένετε 300 ms μετά από κάθε πάτημα πλήκτρων πριν εξετάσετε τον όρο
      debounceTime(300),

      // ignore new term if same as previous term
      // αγνοήστε τον νέο όρο εάν είναι ίδιος με τον προηγούμενο όρο
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      // μετάβαση σε νέα αναζήτηση που μπορεί να παρατηρηθεί κάθε φορά που αλλάζει ο όρος
      switchMap((term: string) => this.userService.searchUsers(term)),
    );
  }
}