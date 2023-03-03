import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { User } from './user';
import { MessageService } from './message.service';


@Injectable({ providedIn: 'root' })
export class UserService {

  private usersUrl = 'api/users';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  /** GET heroes from the server 
  ΛΑΒΕΤΕ ήρωες από τον διακομιστή */
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.usersUrl)
      .pipe(
        tap(_ => this.log('fetched users')),
        catchError(this.handleError<User[]>('getUsers', []))
      );
  }

  /** GET hero by id. Return `undefined` when id not found--
  GET hero by id. Επιστρέψτε "undefined" όταν δεν βρέθηκε 
   */
  getUserNo404<Data>(id: number): Observable<User> {
    const url = `${this.usersUrl}/?id=${id}`;
    return this.http.get<User[]>(url)
      .pipe(
        map(users => users[0]), // returns a {0|1} element array
        
        // επιστρέφει έναν πίνακα στοιχείων {0|1}
        tap(h => {
          const outcome = h ? 'fetched' : 'did not find';
          this.log(`${outcome} user id=${id}`);
        }),
        catchError(this.handleError<User>(`getUser id=${id}`))
      );
  }

  /** GET hero by id. Will 404 if id not found-- 
  GET hero by id. Θα 404 αν δεν βρεθεί */
  getUser(id: number): Observable<User> {
    const url = `${this.usersUrl}/${id}`;
    return this.http.get<User>(url).pipe(
      tap(_ => this.log(`fetched user id=${id}`)),
      catchError(this.handleError<User>(`getUser id=${id}`))
    );
  }

  /* GET heroes whose name contains search term-- 
  GET ήρωες των οποίων το όνομα περιέχει τον όρο αναζήτησης */
  searchUsers(term: string): Observable<User[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      //Αν όχι όρος αναζήτησης, επιστρέψτε τον κενό πίνακα ηρώων.
      return of([]);
    }
    return this.http.get<User[]>(`${this.usersUrl}/?name=${term}`).pipe(
      tap(x => x.length ?
         this.log(`found users matching "${term}"`) :
         this.log(`no users matching "${term}"`)),
      catchError(this.handleError<User[]>('searchUsers', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new hero to the server */
  
/** POST: προσθήκη νέου ήρωα στον διακομιστή */
  addUser(user: User): Observable<User> {
    return this.http.post<User>(this.usersUrl, user, this.httpOptions).pipe(
      tap((newUser: User) => this.log(`added user w/ id=${newUser.id}`)),
      catchError(this.handleError<User>('addUser'))
    );
  }

  /** DELETE: delete the hero from the server */
  /** ΔΙΑΓΡΑΦΗ: διαγραφή του ήρωα από τον διακομιστή */
  deleteUser(id: number): Observable<User> {
    const url = `${this.usersUrl}/${id}`;

    return this.http.delete<User>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted user id=${id}`)),
      catchError(this.handleError<User>('deleteUser'))
    );
  }

  /** PUT: update the hero on the server */
  /** PUT: ενημέρωση του ήρωα στον διακομιστή */
  updateUser(user: User): Observable<any> {
    return this.http.put(this.usersUrl, user, this.httpOptions).pipe(
      tap(_ => this.log(`updated user id=${user.id}`)),
      catchError(this.handleError<any>('updateUser'))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * * Χειριστείτε τη λειτουργία Http που απέτυχε.
   * Αφήστε την εφαρμογή να συνεχίσει.
   *
   * @param operation - όνομα της λειτουργίας που απέτυχε - name of the operation that failed
   * @param result - προαιρετική τιμή για επιστροφή ως παρατηρήσιμο αποτέλεσμα - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      // TODO: αποστολή του σφάλματος στην υποδομή απομακρυσμένης καταγραφής
      console.error(error); // συνδεθείτε στην κονσόλα
      // log to console instead

      // TODO: better job of transforming error for user consumption
      
      // TODO: καλύτερη δουλειά μετατροπής του σφάλματος για    κατανάλωση από τον χρήστη  
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      // Αφήστε την εφαρμογή να συνεχίσει να εκτελείται επιστρέφοντας ένα κενό αποτέλεσμα.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  /** Καταγραφή μηνύματος HeroService με το MessageService */
  private log(message: string) {
    this.messageService.add(`UserService: ${message}`);
  }
}