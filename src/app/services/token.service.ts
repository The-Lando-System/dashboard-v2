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