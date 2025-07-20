import axios, { AxiosInstance } from 'axios';
import * as dotenv from 'dotenv';
dotenv.config();

interface ReaderActions {
  name: string[],
  relay_no: number
}

interface ReaderConfig {
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
  actions: ReaderActions[]
}

export class Reader {
  private name: string;
  private type: string;
  private direction: string;
  private ip: string;
  private mac: string;
  private lcd: boolean;
  private lcdTimer: number | null;
  private lcdShowTime: number;
  private bl: number;
  private api: string | null;
  private actions: ReaderActions[];
  private axiosInstance: AxiosInstance;

  constructor(config: ReaderConfig) {
    this.name = config.name;
    this.type = config.type;
    this.direction = config.direction;
    this.ip = config.ip;
    this.mac = config.mac;
    this.lcd = config.lcd;
    this.lcdTimer = config.lcdTimer;
    this.lcdShowTime = config.lcdShowTime;
    this.bl = config.bl;
    this.api = config.api;
    this.actions = config.actions;

    this.axiosInstance = axios.create({
      baseURL: `http://${this.ip}`,
      auth: {
        username: process.env.READER_AUTH_USERNAME as string,
        password: process.env.READER_AUTH_PASSWORD as string,
      },
      timeout: 3000
    });
  }

  public getName(): string {
    return this.name;
  }

  public getType(): string {
    return this.type;
  }

  public getDirection(): string {
    return this.direction;
  }

  public getIP(): string {
    return this.ip;
  }

  public getMac(): string {
    return this.mac;
  }

  public getLcd(): boolean {
    return this.lcd;
  }

  public getLcdTimer(): number | null {
    return this.lcdTimer;
  }

  public getLcdShowTime(): number {
    return this.lcdShowTime;
  }

  public getBl(): number {
    return this.bl;
  }

  public getApi(): string | null {
    return this.api;
  }

  public getActions(): ReaderActions[] {
    return this.actions;
  }

  public getRelayByAction(action: string): number | undefined {
    const actionObj = this.actions.find(a => a.name.includes(action));
    return actionObj?.relay_no;
  }

  public static findByName(readers: Reader[], name: string): Reader | undefined {
    return readers.find(reader => reader.getName() === name);
  }

  public static findByIp(readers: Reader[], ip: string): Reader | undefined {
    return readers.find(reader => reader.getIP() === ip);
  }

  public static findByTypeAndDirection(readers: Reader[], type: string, direction: string = ''): Reader | undefined {
    return readers.find(reader => reader.getType() === type && reader.getDirection() === direction);
  }

  public static findByAction(readers: Reader[], action: string): Reader | undefined {
    return readers.find(reader => reader.getActions().some(a => a.name.includes(action)));
  }

  public getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}
