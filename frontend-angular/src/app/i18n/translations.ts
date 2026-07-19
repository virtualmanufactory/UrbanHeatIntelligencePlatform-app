export type AppLanguage = 'pl' | 'en';

export type TranslationKey =
  | 'nav.measurements'
  | 'nav.addMeasurement'
  | 'nav.language'
  | 'nav.languagePl'
  | 'nav.languageEn'
  | 'footer'
  | 'heat.title'
  | 'heat.subtitle'
  | 'heat.refresh'
  | 'heat.loading'
  | 'heat.statCount'
  | 'heat.statAvg'
  | 'heat.statMax'
  | 'heat.loadingData'
  | 'heat.mapTitle'
  | 'heat.measurementDate'
  | 'heat.fetching'
  | 'heat.fetchingForDate'
  | 'heat.noMeasurementsForDate'
  | 'heat.colIndex'
  | 'heat.colLocality'
  | 'heat.colDate'
  | 'heat.colLatitude'
  | 'heat.colLongitude'
  | 'heat.colTemperature'
  | 'heat.delete'
  | 'heat.deleting'
  | 'heat.errorLoad'
  | 'heat.errorSelectDate'
  | 'heat.errorFetchByDate'
  | 'heat.errorDelete'
  | 'ingest.title'
  | 'ingest.subtitle'
  | 'ingest.formTitle'
  | 'ingest.localityName'
  | 'ingest.localityPlaceholder'
  | 'ingest.latitude'
  | 'ingest.longitude'
  | 'ingest.measurementDate'
  | 'ingest.boundsHint'
  | 'ingest.latShort'
  | 'ingest.lonShort'
  | 'ingest.add'
  | 'ingest.adding'
  | 'ingest.capitalsTitle'
  | 'ingest.capitalsHint'
  | 'ingest.capitalsButton'
  | 'ingest.fetching'
  | 'ingest.loadingSuggestions'
  | 'ingest.suggestionsTitle'
  | 'ingest.suggestionsHint'
  | 'ingest.resultTitle'
  | 'ingest.geeMode'
  | 'ingest.kafkaTopic'
  | 'ingest.published'
  | 'ingest.colLocality'
  | 'ingest.colLatitude'
  | 'ingest.colLongitude'
  | 'ingest.colTemperature'
  | 'ingest.colDate'
  | 'ingest.resultFooter'
  | 'ingest.viewMap'
  | 'ingest.errorLoadSuggestions'
  | 'ingest.errorCoordinates'
  | 'ingest.errorNameRequired'
  | 'ingest.errorLoadCapitals'
  | 'ingest.errorOutsidePoland'
  | 'ingest.errorAdd'
  | 'map.legendAria'
  | 'map.temperature'
  | 'map.cooler'
  | 'map.warmer'
  | 'map.measurementFallback';

export type TranslationDict = Record<TranslationKey, string>;

export const TRANSLATIONS: Record<AppLanguage, TranslationDict> = {
  pl: {
    'nav.measurements': 'Pomiary',
    'nav.addMeasurement': 'Dodaj pomiar dla miejscowości',
    'nav.language': 'Język',
    'nav.languagePl': 'PL',
    'nav.languageEn': 'EN',
    footer: 'Angular frontend · Java API :8080 · GIS ingest :8000',
    'heat.title': 'Pomiary temperatury w Polsce',
    'heat.subtitle': 'Zapisane pomiary miejscowości na terenie Polski',
    'heat.refresh': 'Odśwież',
    'heat.loading': 'Ładowanie…',
    'heat.statCount': 'Liczba pomiarów',
    'heat.statAvg': 'Średnia temperatura',
    'heat.statMax': 'Maksymalna temperatura',
    'heat.loadingData': 'Ładowanie danych…',
    'heat.mapTitle': 'Mapa pomiarów w Polsce',
    'heat.measurementDate': 'Data pomiaru',
    'heat.fetching': 'Pobieranie…',
    'heat.fetchingForDate': 'Pobieranie pomiarów dla wybranej daty…',
    'heat.noMeasurementsForDate': 'Brak pomiarów dla wybranej daty.',
    'heat.colIndex': '#',
    'heat.colLocality': 'Miejscowość',
    'heat.colDate': 'Data',
    'heat.colLatitude': 'Szerokość geogr.',
    'heat.colLongitude': 'Długość geogr.',
    'heat.colTemperature': 'Temperatura',
    'heat.delete': 'Usuń',
    'heat.deleting': 'Usuwanie…',
    'heat.errorLoad':
      'Nie udało się pobrać danych z backendu (http://localhost:8080/api/heat). Upewnij się, że backend jest uruchomiony.',
    'heat.errorSelectDate': 'Wybierz datę pomiaru.',
    'heat.errorFetchByDate': 'Nie udało się pobrać pomiarów dla wybranej daty.',
    'heat.errorDelete': 'Nie udało się usunąć pomiaru.',
    'ingest.title': 'Dodaj pomiar miejscowości',
    'ingest.subtitle':
      'Wprowadź polską miejscowość i pobierz dla niej temperaturę z Google Earth Engine',
    'ingest.formTitle': 'Nowa miejscowość',
    'ingest.localityName': 'Nazwa miejscowości',
    'ingest.localityPlaceholder': 'np. Warszawa',
    'ingest.latitude': 'Szerokość geogr.',
    'ingest.longitude': 'Długość geogr.',
    'ingest.measurementDate': 'Data pomiaru',
    'ingest.boundsHint':
      'Dozwolone są wyłącznie miejscowości w granicach Polski ({latShort} {minLat}–{maxLat}, {lonShort} {minLon}–{maxLon}).',
    'ingest.latShort': 'szer.',
    'ingest.lonShort': 'dł.',
    'ingest.add': 'Dodaj pomiar',
    'ingest.adding': 'Dodawanie…',
    'ingest.capitalsTitle': 'Miasta wojewódzkie',
    'ingest.capitalsHint':
      'Pobierz temperaturę dla wszystkich 16 stolic województw w wybranej dacie.',
    'ingest.capitalsButton': 'Pobierz dla wszystkich miast wojewódzkich',
    'ingest.fetching': 'Pobieranie…',
    'ingest.loadingSuggestions': 'Ładowanie przykładowych miejscowości…',
    'ingest.suggestionsTitle': 'Przykładowe miejscowości',
    'ingest.suggestionsHint': 'Kliknij miejscowość, aby wypełnić formularz.',
    'ingest.resultTitle': 'Dodano pomiar',
    'ingest.geeMode': 'Tryb GEE',
    'ingest.kafkaTopic': 'Topic Kafka',
    'ingest.published': 'Opublikowano',
    'ingest.colLocality': 'Miejscowość',
    'ingest.colLatitude': 'Szerokość geogr.',
    'ingest.colLongitude': 'Długość geogr.',
    'ingest.colTemperature': 'Temperatura',
    'ingest.colDate': 'Data',
    'ingest.resultFooter': 'Pomiar trafi do bazy po przetworzeniu przez backend Java.',
    'ingest.viewMap': 'Zobacz mapę pomiarów w Polsce',
    'ingest.errorLoadSuggestions':
      'Nie udało się pobrać przykładowych miejscowości z backendu GIS (http://localhost:8000/cities). Upewnij się, że backend-python-gis jest uruchomiony.',
    'ingest.errorCoordinates':
      'Dozwolone współrzędne: {latShort} {minLat}–{maxLat}, {lonShort} {minLon}–{maxLon} (tylko Polska).',
    'ingest.errorNameRequired': 'Podaj nazwę miejscowości.',
    'ingest.errorLoadCapitals':
      'Nie udało się pobrać listy miast wojewódzkich (http://localhost:8000/voivodeship-capitals).',
    'ingest.errorOutsidePoland': "Miejscowość '{name}' musi leżeć na terenie Polski.",
    'ingest.errorAdd':
      'Nie udało się dodać pomiaru. Dozwolone są wyłącznie miejscowości w Polsce.',
    'map.legendAria': 'Legenda kolorów temperatury',
    'map.temperature': 'Temperatura',
    'map.cooler': 'Chłodniej',
    'map.warmer': 'Cieplej',
    'map.measurementFallback': 'Pomiar',
  },
  en: {
    'nav.measurements': 'Measurements',
    'nav.addMeasurement': 'Add locality measurement',
    'nav.language': 'Language',
    'nav.languagePl': 'PL',
    'nav.languageEn': 'EN',
    footer: 'Angular frontend · Java API :8080 · GIS ingest :8000',
    'heat.title': 'Temperature measurements in Poland',
    'heat.subtitle': 'Saved locality measurements across Poland',
    'heat.refresh': 'Refresh',
    'heat.loading': 'Loading…',
    'heat.statCount': 'Measurement count',
    'heat.statAvg': 'Average temperature',
    'heat.statMax': 'Maximum temperature',
    'heat.loadingData': 'Loading data…',
    'heat.mapTitle': 'Measurement map of Poland',
    'heat.measurementDate': 'Measurement date',
    'heat.fetching': 'Fetching…',
    'heat.fetchingForDate': 'Fetching measurements for the selected date…',
    'heat.noMeasurementsForDate': 'No measurements for the selected date.',
    'heat.colIndex': '#',
    'heat.colLocality': 'Locality',
    'heat.colDate': 'Date',
    'heat.colLatitude': 'Latitude',
    'heat.colLongitude': 'Longitude',
    'heat.colTemperature': 'Temperature',
    'heat.delete': 'Delete',
    'heat.deleting': 'Deleting…',
    'heat.errorLoad':
      'Could not fetch data from the backend (http://localhost:8080/api/heat). Make sure the backend is running.',
    'heat.errorSelectDate': 'Select a measurement date.',
    'heat.errorFetchByDate': 'Could not fetch measurements for the selected date.',
    'heat.errorDelete': 'Could not delete the measurement.',
    'ingest.title': 'Add locality measurement',
    'ingest.subtitle':
      'Enter a Polish locality and fetch its temperature from Google Earth Engine',
    'ingest.formTitle': 'New locality',
    'ingest.localityName': 'Locality name',
    'ingest.localityPlaceholder': 'e.g. Warsaw',
    'ingest.latitude': 'Latitude',
    'ingest.longitude': 'Longitude',
    'ingest.measurementDate': 'Measurement date',
    'ingest.boundsHint':
      'Only localities within Poland are allowed ({latShort} {minLat}–{maxLat}, {lonShort} {minLon}–{maxLon}).',
    'ingest.latShort': 'lat.',
    'ingest.lonShort': 'lon.',
    'ingest.add': 'Add measurement',
    'ingest.adding': 'Adding…',
    'ingest.capitalsTitle': 'Voivodeship capitals',
    'ingest.capitalsHint':
      'Fetch temperature for all 16 voivodeship capitals on the selected date.',
    'ingest.capitalsButton': 'Fetch for all voivodeship capitals',
    'ingest.fetching': 'Fetching…',
    'ingest.loadingSuggestions': 'Loading sample localities…',
    'ingest.suggestionsTitle': 'Sample localities',
    'ingest.suggestionsHint': 'Click a locality to fill the form.',
    'ingest.resultTitle': 'Measurement added',
    'ingest.geeMode': 'GEE mode',
    'ingest.kafkaTopic': 'Kafka topic',
    'ingest.published': 'Published',
    'ingest.colLocality': 'Locality',
    'ingest.colLatitude': 'Latitude',
    'ingest.colLongitude': 'Longitude',
    'ingest.colTemperature': 'Temperature',
    'ingest.colDate': 'Date',
    'ingest.resultFooter': 'The measurement will reach the database after Java backend processing.',
    'ingest.viewMap': 'View the measurement map of Poland',
    'ingest.errorLoadSuggestions':
      'Could not fetch sample localities from the GIS backend (http://localhost:8000/cities). Make sure backend-python-gis is running.',
    'ingest.errorCoordinates':
      'Allowed coordinates: {latShort} {minLat}–{maxLat}, {lonShort} {minLon}–{maxLon} (Poland only).',
    'ingest.errorNameRequired': 'Enter a locality name.',
    'ingest.errorLoadCapitals':
      'Could not fetch the voivodeship capitals list (http://localhost:8000/voivodeship-capitals).',
    'ingest.errorOutsidePoland': "Locality '{name}' must be located in Poland.",
    'ingest.errorAdd': 'Could not add the measurement. Only localities in Poland are allowed.',
    'map.legendAria': 'Temperature color legend',
    'map.temperature': 'Temperature',
    'map.cooler': 'Cooler',
    'map.warmer': 'Warmer',
    'map.measurementFallback': 'Measurement',
  },
};
