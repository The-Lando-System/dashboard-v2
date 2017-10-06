import { Injectable } from '@angular/core';

@Injectable()
export class TokenReplacer {

    constructor(
    ) {}

    replaceToken(token:string, value:string, html:string): string {
        // All tokens will be in the ${TOKEN} format
        var re = new RegExp('\\${' + token + '}',"g");
        return html.replace(re,value);
    }

}