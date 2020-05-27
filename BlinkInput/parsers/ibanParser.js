import { Parser, ParserResult } from '../parser'
import {
    Date,
    BaseOcrEngineOptions,
} from '../types'

/**
 * Result object for IbanParser.
 */
export class IbanParserResult extends ParserResult {
    constructor(nativeResult) {
        super(nativeResult.resultState);
        
        /** 
         * Returns the rparsed IBAN or empty string if recognition failed. 
         */
        this.iban = nativeResult.iban;
        
    }
}

/**
 * AmountParser that can extract IBAN (International Bank Account Number) from OCR result.
 */
export class IbanParser extends Parser {
    constructor() {
        super('IbanParser');
        
        /** 
         * Should prefix (country code) always be returned.
         * 
         *  
         */
        this.alwaysReturnPrefix = false;
        
        this.createResultFromNative = function (nativeResult) { return new IbanParserResult(nativeResult); }
    }
}