import { Injectable } from '@angular/core';

import { Widget } from '../widget';
import { ApiInvoker } from './api-invoker';
import { JsonPathParser } from './json-path-parser';

@Injectable()
export class TokenProcessor {
    
    constructor(
        private apiInvoker: ApiInvoker,
        private jsonPathParser: JsonPathParser
    ){}

    public processTokens(widget:Widget): Promise<string> {

        let tokenStatus = {};
        for (let token of widget.tokens) {
            tokenStatus[token.name] = false;
        }

        return new Promise<string>((resolve, reject) => {
            for (let token of widget.tokens) {
                this.apiInvoker.invokeRequest(token.endpoint)
                .then((response:any) => {
                    token.value = this.jsonPathParser.parsePath(response,token.responseParseRules);
                    widget.html = this.replaceToken(token.name, token.value, widget.html);
                    tokenStatus[token.name] = true;
                    if (this.allTokensReplaced(tokenStatus)) {
                        resolve(widget.html);
                    }
                });
            }
        });
    }

    private allTokensReplaced(tokenStatus:any): boolean {
        for (let key of Object.keys(tokenStatus)){
            if (!tokenStatus[key]) {
                return false;
            }
        }
        return true;
    }


    private replaceToken(token:string, value:string, html:string): string {
        // All tokens will be in the ${TOKEN} format
        var re = new RegExp('\\${' + token + '}',"g");
        return html.replace(re,value);
    }

}