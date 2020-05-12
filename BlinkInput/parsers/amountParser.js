import { Parser, ParserResult } from '../parser'
import {
    Date,
    BaseOcrEngineOptions,
} from '../types'

/**
 * Result object for AmountParser.
 */
export class AmountParserResult extends ParserResult {
    constructor(nativeResult) {
        super(nativeResult.resultState);
        
        /** 
         * Returns the recognized amount number or empty string if recognition failed. 
         */
        this.amount = nativeResult.amount;
        
    }
}

/**
 * AmountParser is used for extracting amount from OCR result
 */
export class AmountParser extends Parser {
    constructor() {
        super('AmountParser');
        
        /** 
         * Indicates whether amounts without decimal are accepted as valid. For example 1.465 is
         * accepted as valid amount, but 1465 is not, unless this is set to true.
         * Setting this to {@code true} can yield to more false positives
         * because any set of consequent digits can represent valid amount.
         * 
         *  
         */
        this.allowMissingDecimals = false;
        
        /** 
         * Indicates whether negative values are accepted as valid amounts.
         * Setting this to true can yield to more false positives.
         * 
         *  
         */
        this.allowNegativeAmounts = false;
        
        /** 
         * Indicates whether amounts with space separators between groups of digits(thousands) are allowed.
         * 
         *  
         */
        this.allowSpaceSeparators = false;
        
        /** 
         * Indicates whether Arabic-Indic mode is enabled. In Arabic-Indic mode parser can recognize
         * only amounts which consist of Arabic-Indic digits and decimal separator.
         * 
         *  
         */
        this.arabicIndicMode = false;
        
        this.createResultFromNative = function (nativeResult) { return new AmountParserResult(nativeResult); }
    }
}