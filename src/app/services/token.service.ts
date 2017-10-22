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

    tokenizeJsonResponse(response:any): any[] {
      // "{\n  \"error\": \"An error occured during the client request\",\n  \"details\": \"options.uri is a required argument\"\n}"
      // { item: <item>, isToken: <true/false> }
      var parsedItems = [];

      var attrLocations = [];

      this.findAttrLocations(attrLocations, [], response);

      console.log('Final attr locations');
      console.log(attrLocations);

      // Potential regex
      // \\"(.+?)\\":\s\\".+?\\"(,|\\n)

      return parsedItems;
    }

    findAttrLocations(attrLocations:any[], parentLocation:string[], obj:any): void {

      var isArray = Array.isArray(obj);

      for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) {
          if (typeof obj[attr] === 'object') {

            if (isArray)
              parentLocation.push(`#${attr}`);
            else
              parentLocation.push(`@${attr}`);

            this.findAttrLocations(attrLocations, parentLocation, obj[attr]);
            parentLocation.pop();

          } else {
            
            let location:string = (parentLocation.length > 0 ? parentLocation.join(',') + ',' : '') + `@${attr}`;
            
            let locationObj = {
              'location': location,
              'value': obj[attr]
            };
            
            attrLocations.push(locationObj);
          }
        }
      }
    }

}