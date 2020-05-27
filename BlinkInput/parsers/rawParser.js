import { Parser, ParserResult } from '../parser'
import {
    Date,
    BaseOcrEngineOptions,
} from '../types'

/**
 * Result object for RawParser.
 */
export class RawParserResult extends ParserResult {
    constructor(nativeResult) {
        super(nativeResult.resultState);
        
        /** 
         * Extracted date string. 
         */
        this.rawText = nativeResult.rawText;
        
    }
}

/**
 * RawParser that simply returns the string version of raw OCR result, without performing
 * any smart parsing operations.
 */
export class RawParser extends Parser {
    constructor() {
        super('RawParser');
        
        /** 
         * Enable the usage of algorithm for combining consecutive OCR results between video frames
         * for improving OCR quality. By default this is turned off.
         * Note: This option works together only with if instance of {@link com.microblink.entities.ocrengine.legacy.BlinkOCREngineOptions} is given
         * to {@link #setOcrEngineOptions(com.microblink.entities.ocrengine.AbstractOCREngineOptions)}. Otherwise, it will not be
         * enabled and {@link IllegalArgumentException} will be thrown.
         * 
         *  
         */
        this.useSieve = false;
        
        this.createResultFromNative = function (nativeResult) { return new RawParserResult(nativeResult); }
    }
}