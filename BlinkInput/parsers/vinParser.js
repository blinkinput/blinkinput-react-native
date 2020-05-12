import { Parser, ParserResult } from '../parser'
import {
    Date,
    BaseOcrEngineOptions,
} from '../types'

/**
 * Result object for VinParser.
 */
export class VinParserResult extends ParserResult {
    constructor(nativeResult) {
        super(nativeResult.resultState);
        
        /** 
         * Returns the recognized VIN number or empty string if recognition failed. 
         */
        this.vin = nativeResult.vin;
        
    }
}

/**
 * VinParser is used for parsing VIN numbers
 */
export class VinParser extends Parser {
    constructor() {
        super('VinParser');
        
        this.createResultFromNative = function (nativeResult) { return new VinParserResult(nativeResult); }
    }
}