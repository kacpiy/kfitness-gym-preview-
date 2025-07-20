import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config();

import { Reader } from './readers/readers'; 

const rfidAuth: any = {
  username: process.env.RFID_USERNAME,
  password: process.env.RFID_PASSWORD
}

const configPath = path.join(__dirname, 'config.json');
const configData = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const locationId = +process.env.LOCATION_ID;
const locationConfig = configData.find((config: Config) => config.location.id === locationId);

if (!locationConfig) {
  throw new Error(`Nie znaleziono konfiguracji dla LOCATION_ID=${locationId}.`);
}

const readers: Reader[] = locationConfig.readers.map((readerConfig: any) => new Reader(readerConfig));

export const handleSocketAction = (message: any) => {
  if (message.action === 'door-entry' || message.action === 'door-exit') {
    handleDoorOpen(message.action);
  } 
  else if (message.action === 'gate-entry' || message.action === 'gate-exit') {
    handleGate(message.action);
  }
  else if (message.action === 'exit') {
    handleGate('gate-exit');
    handleDoorOpen('door-exit');
  } 
  else {
    console.error(`Nieznana akcja: ${message.action}`);
  }
};

const handleDoorOpen = (action: string) => {
  const reader = Reader.findByAction(readers, action);
  
  if (reader) {
    console.log(`Otwieranie drzwi: ${reader.getName()}`);
    
    const axiosInstance = reader.getAxiosInstance();
    const relay = reader.getRelayByAction(action);
    
    let url = '/status.xml';
    if (relay === 1) {
      url += '?open=1';
    } else if (relay === 2) {
      url += '?open2=1';
    }

    axiosInstance.get(url, { auth: rfidAuth })
      .then(_response => {
        console.log('Drzwi zostały otwarte');
      })
      .catch(error => {
        console.error('Błąd przy otwieraniu drzwi', error);
      });
  } else {
    console.error(`Czytnik zarządzający otwarciem drzwi nie został znaleziony.`);
  }
};

const handleGate = (action: 'gate-entry' | 'gate-exit') => {
  const reader = Reader.findByAction(readers, action);
  
  if (reader) {
    console.log(`${action === 'gate-entry' ? 'Wejście' : 'Wyjście'} przez bramkę: ${reader.getName()}`);

    const axiosInstance = reader.getAxiosInstance();
    
    let url = '/status.xml';
    let params: string[] = [];

    const readerAction = reader.getActions().find(a => a.name.includes(action));
    if (readerAction) {
      if (readerAction.relay_no === 1) {
        params.push('open=1');
      } else if (readerAction.relay_no === 2) {
        params.push('open2=1');
      }
    }

    if (params.length > 0) {
      url += '?' + params.join('&');
    }

    axiosInstance.get(url, { auth: rfidAuth })
      .then(_response => {
        console.log(`Akcja handleGate (${action}) wykonana, odpowiedź: `);
      })
      .catch(error => {
        console.error(`Błąd przy wykonywaniu akcji handleGate (${action})`, error);
      });
    
  } else {
    console.error(`Czytnik bramki ${action} nie został znaleziony lub kierunek jest nieprawidłowy.`);
  }
};
