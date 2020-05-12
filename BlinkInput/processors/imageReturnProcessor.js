import { Processor, ProcessorResult } from '../processor'
import {
    Date,
    BaseOcrEngineOptions,
} from '../types'

/**
 * Result object for ImageReturnProcessor.
 */
export class ImageReturnProcessorResult extends ProcessorResult {
    constructor(nativeResult) {
        super(nativeResult.resultState);
        
        /** 
         * Returns the raw image saved by the processor. If no image was saved by processor, returns null.
         * falseTE: Internal buffers of the returned image are valid as long as Result object (this) is alive. 
         */
        this.rawImage = nativeResult.rawImage;
        
    }
}

/**
 * Processor that will simply save given image.
 */
export class ImageReturnProcessor extends Processor {
    constructor() {
        super('ImageReturnProcessor');
        
        this.createResultFromNative = function (nativeResult) { return new ImageReturnProcessorResult(nativeResult); }
    }
}