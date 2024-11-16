// Indirizzo del Backend
export class Backend {
  public static url: string = "http://localhost:8080";
}

// Le coordinate di default del comune
export class Geo {
  public static center = {
    'lat': 40.8253799,
    'lng': 16.5272887,
  };
}

// La chiave API di Google Maps
export class MapsApi {
  public static api: String = "AIzaSyAAZ0G29QkK2J9sZsAA4qgmCpCtnPQfaeQ";
}
