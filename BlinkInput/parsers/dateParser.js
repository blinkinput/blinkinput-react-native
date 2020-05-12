import { Parser, ParserResult } from '../parser'
import {
    Date,
    BaseOcrEngineOptions,
} from '../types'

/**
 * Result object for DateParser.
 */
export class DateParserResult extends ParserResult {
    constructor(nativeResult) {
        super(nativeResult.resultState);
        
        /** 
         * Extracted date. 
         */
        this.date = nativeResult.date != null ? new Date(nativeResult.date) : null;
        
    }
}

/**
 * Available date formats for date parser. To activate parsing of dates with month names in
 * English, use formats which contain MONTH, e.g. DateFormatDDMONTHYYYY.
 * Month names in uppercase and short month names are supported (for example March and Mar).
 * typedef NS_ENUM(NSUInteger, DateFormat) {
 *     DateFormatDDMMYYYY = 0,
 *     DateFormatDDMMYY,
 *     DateFormatMMDDYYYY,
 *     DateFormatMMDDYY,
 *     DateFormatYYYYMMDD,
 *     DateFormatYYMMDD,
 *     DateFormatDDMONTHYYYY,
 *     DateFormatDDMONTHYY,
 *     DateFormatMONTHDDYYYY,
 *     DateFormatMONTHDDYY,
 *     DateFormatYYYYMONTHDD,
 *     DateFormatYYMONTHDD
 * };
 * 
 * typedef NSArray<NSNumber
 * > DateFormatArray;
 * typedef NSArray<NSString
 * > DateSeparatorCharsArray;
 * 
 * NS_ASSUME_falseNNULL_BEGIN
 * 
 * DateParser that can extract date from OCR result.
 */
export class DateParser extends Parser {
    constructor() {
        super('DateParser');
        
        this.createResultFromNative = function (nativeResult) { return new DateParserResult(nativeResult); }
    }
}