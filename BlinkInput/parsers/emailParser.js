import { Parser, ParserResult } from '../parser'
import {
    Date,
    BaseOcrEngineOptions,
} from '../types'

/**
 * Result object for EmailParser.
 */
export class EmailParserResult extends ParserResult {
    constructor(nativeResult) {
        super(nativeResult.resultState);
        
        /** 
         * Returns the recognized email or empty string if recognition failed. 
         */
        this.email = nativeResult.email;
        
    }
}

/**
 * EmailParser is used for parsing emails
 */
export class EmailParser extends Parser {
    constructor() {
        super('EmailParser');
        
        this.createResultFromNative = function (nativeResult) { return new EmailParserResult(nativeResult); }
    }
}