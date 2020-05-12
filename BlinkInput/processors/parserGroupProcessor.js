import { Processor, ProcessorResult } from '../processor'

/**
 * Result object for ParserGroupProcessor.
 */
export class ParserGroupProcessorResult extends ProcessorResult {
    constructor(nativeResult) {
        super(nativeResult.resultState);
    }
}

/**
 * ParserGroupProcessorResult can have all wanted parsers
 * frame on which the other recognizer finished recognition.
 */
export class ParserGroupProcessor extends Processor {
    constructor(parsers) {
        super('ParserGroupProcessor');
        /** Parser array for parser group */
        this.parsers = parsers;

        if (!this.parsers.constructor instanceof Array) {
            throw new Error("Parsers must be an array of parsers!");
        }

        this.createResultFromNative = (function (nativeResult) { return new ParserGroupProcessorResult(nativeResult); }).bind(this);
    }
}