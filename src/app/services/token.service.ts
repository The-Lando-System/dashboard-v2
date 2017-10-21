import { Injectable } from '@angular/core';

@Injectable()
export class TokenService {

    constructor(
    ) {}

    replaceToken(token:string, value:string, html:string): string {
        // All tokens will be in the ${TOKEN} format
        var re = new RegExp('\\${' + token + '}',"g");
        return html.replace(re,value);
    }

    tokenizeJsonResponse(response:string): any[] {
      // "{\n  \"error\": \"An error occured during the client request\",\n  \"details\": \"options.uri is a required argument\"\n}"
      // { item: <item>, isToken: <true/false> }
      var parsedItems = [];

      console.log(response);

      // Potential regex
      // \\"(.+?)\\":\s\\".+?\\"(,|\\n)

      return parsedItems;
    }

}