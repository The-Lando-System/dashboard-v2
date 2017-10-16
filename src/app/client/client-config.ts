export class ClientConfig {
  id: string;
  name: string;
  tokens: Token[];
  url: string;
  headers: ClientHeader[];
  method: string;
  interval: number;
  oauth2_config: Oauth2Config;
}

export class Oauth2Config {
  api_key: string;
  api_secret: string;
  auth_url: string;
  auth_headers: ClientHeader[];
}

export class ClientHeader {
  key: string;
  value: string;

  constructor(key:string,value:string){
    this.key = key;
    this.value = value;
  }
}

export class Token {
    name: string;
    parse_rules: string[];
}