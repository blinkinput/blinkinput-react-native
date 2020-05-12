import { Recognizer, RecognizerResult } from '../recognizer'
import {
    Date, 
    Point, 
    Quadrilateral,
    
    
} from '../types'

/**
 * Result object for DocumentCaptureRecognizer.
 */
export class DocumentCaptureRecognizerResult extends RecognizerResult {
    constructor(nativeResult) {
        super(nativeResult.resultState);
        
        /** 
         * Quadrangle represeting corner points of location of the captured document 
         */
        this.detectionLocation = nativeResult.detectionLocation != null ? new Quadrilateral(nativeResult.detectionLocation) : null;
        
        /** 
         * full document image if enabled with returnFullDocumentImage property. 
         */
        this.fullDocumentImage = nativeResult.fullDocumentImage;
        
    }
}

/**
 * A recognizer for DocumentCaptureRecognizer
 */
export class DocumentCaptureRecognizer extends Recognizer {
    constructor() {
        super('DocumentCaptureRecognizer');
        
        /** 
         * Image extension factors for full document image.
         * 
         * @see ImageExtensionFactors
         *  
         */
        this.fullDocumentImageExtensionFactors = new ImageExtensionFactors();
        
        /** 
         * Defines minimum document scale calculated as ratio of minimal document dimension and minimal dimension of the input image.
         * 
         *  
         */
        this.minDocumentScale = 0.5;
        
        /** 
         * Defines how many times the same document should be detected before the detector
         * returns this document as a result of the deteciton
         * 
         * Higher number means more reliable detection, but slower processing
         * 
         *  
         */
        this.numStableDetectionsThreshold = 3;
        
        /** 
         * Sets whether full document image of ID card should be extracted.
         * 
         *  
         */
        this.returnFullDocumentImage = false;
        
        this.createResultFromNative = function (nativeResult) { return new DocumentCaptureRecognizerResult(nativeResult); }
    }
}