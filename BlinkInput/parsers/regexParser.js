import { Parser, ParserResult } from '../parser'
import {
    Date
} from '../types'

/**
 * Result object for BlinkInput.
 */
export class RegexParserResult extends ParserResult {
    constructor(nativeResult) {
        super(nativeResult.resultState);

        /** 
        * Returns string containing parsed OCR result according to given regular expression. 
        */
        this.parsedString = nativeResult.parsedString;
    }
}

/**
 * Recognizer that scan 2D barcodes from United States Driver License.
 */
export class RegexParser extends Parser {
    constructor(regex) {
        super('RegexParser');
    
        /** 
         * If set to true, regex will not be matched if there is no whitespace after matched string.
         * Whitespace is not returned in parsed result.
         * 
         *  
         */
        this.endWithWhitespace = false;
        
        /** 
         * Sets the OCR engine options used in Regex OCR parser.
         * Returns the OCR engine options used in Regex OCR parser.
         * 
         *  
         */
        this.ocrEngineOptions = new BaseOcrEngineOptions();
        
        /** 
         * Defines regex that will be used to parse OCR data. Note that not all java regex features
         * are available, such as back references and '^' and '$' meta-character. '.' meta-character
         * that represents any character and '^' inside brackets representing all characters except those
         * in brackets are available only if alphabet is defined. 
         */
        this.regex = regex;
        
        /** 
         * If set to true, regex will not be matched if there is no whitespace before matched string.
         * Whitespace is not returned in parsed result.
         * 
         *  
         */
        this.startWithWhitespace = false;
        
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
    
        this.createResultFromNative = function (nativeResult) { return new RegexParser(nativeResult); }
    }
}