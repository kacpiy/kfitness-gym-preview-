declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production';
    SOCKET_URL: string;
    LOCATION_ID: number;
    LOCATION_NAME: string;
    WS_TOKEN: string;
    RFID_USERNAME: string;
    RFID_PASSWORD: string;
  }
}