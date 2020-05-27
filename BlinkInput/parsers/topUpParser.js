import { Parser, ParserResult } from '../parser'
import {
    Date,
    BaseOcrEngineOptions,
} from '../types'

/**
 * Result object for TopUpParser.
 */
export class TopUpParserResult extends ParserResult {
    constructor(nativeResult) {
        super(nativeResult.resultState);
        
        /** 
         * Returns the recognized Top Up number or empty string if recognition failed. 
         */
        this.topUp = nativeResult.topUp;
        
    }
}

/**
 * Enumeration of posibble top up presets
 * typedef NS_ENUM(NSUInteger, TopUpPreset) {
 *     
 *     /
 * 
 * For top ups which begin with <b>
 * 123
 * </b> prefix and USSD code length is <b>14</b>
 *     TopUp123,
 *     
 *     /
 * 
 * For top ups which begin with <b>
 * 103
 * </b> and USSD code length is <b>14</b>
 *     TopUp103,
 *     
 *     /
 * 
 * For top ups which begin with <b>
 * 131
 * </b> and USSD code length is <b>13</b>
 *     TopUp131,
 *     
 *     /
 * 
 * For top ups with any prefix and USSD code length from interval {[13, 16]}
 *     TopUpGeneric,
 *     
 * };
 * 
 * NS_ASSUME_falseNNULL_BEGIN
 * 
 * TopUpParser is used for parsing Top Up numbers
 */
export class TopUpParser extends Parser {
    constructor() {
        super('TopUpParser');
        
        /** 
         * Indicates whether USSD codes without prefix are allowed.
         * 
         *  
         */
        this.allowNoPrefix = false;
        
        /** 
         * Indicates whether digts prefix and # at the end of scanned USSD code will
         * be returned.
         * 
         *  
         */
        this.returnCodeWithoutPrefix = false;
        
        this.createResultFromNative = function (nativeResult) { return new TopUpParserResult(nativeResult); }
    }
}