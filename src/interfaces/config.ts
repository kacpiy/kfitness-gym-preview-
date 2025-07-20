interface Location {
  id: number;
  name: string;
  address: string;
  city: string;
  country: string;
}

interface Action {
  name: string[];
  relay_no: number;
}

interface Reader {
  name: string;
  type: string;
  direction: string;
  ip: string;
  mac: string;
  lcd: boolean;
  lcdTimer: number | null;
  lcdShowTime: number;
  bl: number;
  api: string | null;
  actions: Action[];
}

interface Config {
  location: Location;
  readers: Reader[];
}
