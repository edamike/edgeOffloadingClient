import { Injectable } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';


const endpoint = 'http://localhost:8080/';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class OffloadingApiService {


  constructor(private http: HttpClient) { }

  private extractData(res: Response) {
    let body = res;
    return body || { };
  }

  simulate(uppaalRequest): Observable<any> {
    console.log(uppaalRequest);
    return this.http.post<any>(endpoint + 'resourcePlanning', JSON.stringify(uppaalRequest), httpOptions).pipe(
      tap((result) => console.log(`simulation result id=${result.error}`)),
      catchError(this.handleError<any>('resourcePlanning'))
    );
  }

  loadExample(string, numberEdges, numberUsers): Observable<any> {

    return this.http.get<any>(endpoint + 'testData/' + string + "/" + numberEdges + "/" + numberUsers, httpOptions).pipe(
      tap((result) => console.log(`simulation result id=${result.error}`)),
      catchError(this.handleError<any>('testData'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
