import { Recognizer, RecognizerResult } from '../recognizer'
import {
    Date
} from '../types'

/**
 * Result object for BlinkInput.
 */
export class BlinkInputRecognizerResult extends RecognizerResult {
    constructor(nativeResult) {
        super(nativeResult.resultState);
    }
}

/**
 * Recognizer that scan 2D barcodes from United States Driver License.
 */
export class BlinkInputRecognizer extends Recognizer {
    constructor(processors) {
        super('BlinkInputRecognizer');
    
        /** Array of processors */
        this.processors = processors;

        if (!(this.processors.constructor === Array)) {
            throw new Error("processors must be array of Processor objects!");
        }
        // ensure every element in array is Recognizer
        for (var i = 0; i < this.processors.length; ++i) {
            if (!(this.processors[i] instanceof Processor )) {
                throw new Error( "Each element in processors must be instance of Processor" );
            }
        }
    
        this.createResultFromNative = function (nativeResult) { return new BlinkInputRecognizer(nativeResult); }
    }
}