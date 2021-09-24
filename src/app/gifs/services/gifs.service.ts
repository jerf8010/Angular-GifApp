
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SearchGifsResponse, Gif } from '../interfaces/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private apiKey: string = 'B6epyS65FB008qZzjQTqaZKmgyzUNtYB';
  private servicioUrl: string = 'http://api.giphy.com/v1/gifs';
  private _historial: string[] = [];

  public resultados: Gif[] = [];

  get historial() {
    return [...this._historial];
  }

  constructor( private http: HttpClient ) {

    this._historial = JSON.parse( localStorage.getItem('historial')! ) || [];
    this.resultados = JSON.parse( localStorage.getItem( 'resultados' )! ) || [];
    /* if( localStorage.getItem('historial') ){
      this._historial = JSON.parse( localStorage.getItem('historial')! );
    } */

  } // Inyectamos el modulo HttpClient

  buscarGifs( query: string ){
   
    query = query.trim().toLowerCase(); // Convertir todo a minusculas

    // Evita insertar busquedas previas en el historial
    if( !this._historial.includes( query ) ){
      this._historial.unshift( query );
      this._historial = this._historial.splice(0, 10); // Solo permite 10 registros en el historial 

      localStorage.setItem('historial', JSON.stringify( this._historial ) );
    }

    const params = new HttpParams()
            .set('api_key', this.apiKey)
            .set('limit', '10')
            .set('q', query);

    this.http.get<SearchGifsResponse>(`${ this.servicioUrl }/search`, { params }) // peticion http get con Angular
          .subscribe( ( resp )  => { // similar a then

            // console.log( resp.data );
            this.resultados = resp.data;
            
            localStorage.setItem('resultados', JSON.stringify( this.resultados ) );
          })


    // Peticion http con javascript
    /* fetch('http://api.giphy.com/v1/gifs/search?api_key=B6epyS65FB008qZzjQTqaZKmgyzUNtYB&q=dragon ball z&limit=10')
      .then( resp => {
        resp.json().then( data => {
          console.log(data)
        })
      }) */

    // console.log( this._historial );
  }
}
