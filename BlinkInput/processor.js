/**
 * Base class for all processors.
 * Processor is object that performs specific parsing
 * and updates its result with data extracted from the image.
 */
export class Processor {
    constructor(processorType) {
        /** Type of processor */
        this.processorType = processorType;
    }
}

/**
* Possible states of the Processor's result
*/
export const ProcessorResultState = Object.freeze(
    {
        /** Processor result is empty */
        empty : 1,
        /** Processor result contains some values, but is incomplete or it contains all values, but some are uncertain */
        uncertain : 2,
        /** Processor result contains all required values */
        valid : 3
    }
);

/**
 * Base class for all processors's result objects.
 * Processor result contains data extracted from the image.
 */
export class ProcessorResult {
    constructor(resultState) {
        /** 
         * State of the result. It is always one of the values represented by ProcessorResultState enum 
         */
        this.resultState = resultState;
    }
}