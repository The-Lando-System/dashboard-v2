import { Injectable } from '@angular/core';

@Injectable()
export class JsonPathParser {
    
    public parsePath(json:any, pathRules:string[]): string {
        let parsedValue = json;

        for (let rule of pathRules){
            if (rule.indexOf('@') != -1) {
                rule = rule.replace('@','');
                parsedValue = parsedValue[rule];
            }
            if (rule.indexOf('#') != -1) {
                rule = rule.replace('#','');
                parsedValue = parsedValue[parseInt(rule)];
            }
        }

        return parsedValue;
    }


}