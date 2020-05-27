import { Parser, ParserResult } from '../parser'
import {
    Date,
    BaseOcrEngineOptions,
} from '../types'

/**
 * Result object for LicensePlatesParser.
 */
export class LicensePlatesParserResult extends ParserResult {
    constructor(nativeResult) {
        super(nativeResult.resultState);
        
        /** 
         * Returns the recognized license plate number or empty string if recognition failed. 
         */
        this.licensePlate = nativeResult.licensePlate;
        
    }
}

/**
 * LicensePlatesParser is used for parsing license plates
 */
export class LicensePlatesParser extends Parser {
    constructor() {
        super('LicensePlatesParser');
        
        this.createResultFromNative = function (nativeResult) { return new LicensePlatesParserResult(nativeResult); }
    }
}