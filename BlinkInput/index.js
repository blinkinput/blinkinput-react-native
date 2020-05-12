'use strict';

import { Platform, NativeModules } from 'react-native';

import { RecognizerResultState } from './recognizer'

const BlinkInputNative = Platform.select({
      ios: NativeModules.BlinkInputIos,
      android: NativeModules.BlinkInputAndroid
})

/**
 * This exposes the appropriate native BlinkInput module module as a JS module, based on 
 * detected platform: Android or iOS. This has functions:
 * -> 'scanWithCamera' which takes the following parameters:
 * 1. Object overlaySettings: instance of OverlaySettings, contains settings for desired camera overlay
 * 2. RecognizerCollection recognizerCollection: object containing recognizers to use for scanning
 * 3. String license: BlinkInput base64 license key bound to application ID for Android or iOS. To obtain
 *                       valid license key, please visit http://microblink.com/login or
 *                       contact us at http://help.microblink.com
 *
 *    OR
 *
 *    Object license: containing:
 *               - mandatory parameter 'licenseKey': base64 license key bound to application ID
 *                       for Android or iOS. To obtain valid license key, please visit
 *                       http://microblink.com/login or contact us at http://help.microblink.com
 *               - optioanl parameter 'licensee' when license for multiple apps is used
 *               - optional flag 'showTimeLimitedLicenseKeyWarning' which indicates
 *                  whether warning for time limited license key will be shown
 *        in format
 *  {
 *      licenseKey: '<base64iOSLicense or base64AndroidLicense>',
 *      licensee: String,
 *      showTimeLimitedLicenseKeyWarning: Boolean
 *  }
 * -> 'captureDocument' which takes following parameters:
 * 1. DocumentCaptureRecognizer documentCaptureRecognizer: object containing settings for document capture recognizer
 * 2. String license: the same as 'license' for 'scanWithCamera' function
 */
class BlinkInputWrapper {
      async scanWithCamera(overlaySettings, recognizerCollection, license) {
            try {
                  var bla = NativeModules;
                  console.log(bla);
                  var licenseObject = license;
                  if (typeof license === 'string' || license instanceof String) {
                      licenseObject = { licenseKey: license };
                  }
                  const nativeResults = await BlinkInputNative.scanWithCamera(overlaySettings, recognizerCollection, licenseObject);
                  if (nativeResults.length != recognizerCollection.recognizerArray.length) {
                        console.log("INTERNAL ERROR: native plugin returned wrong number of results!");
                        return [];
                  } else {
                        let results = [];
                        for (let i = 0; i < nativeResults.length; ++i) {
                              // native plugin must ensure types match
                              // recognizerCollection.recognizerArray[i].result = recognizerCollection.recognizerArray[i].createResultFromNative(nativeResults[i]);

                              // unlike Cordova, ReactNative does not allow mutation of user-provided recognizers, so we need to 
                              // return results and let user handle them manually.
                              let result = recognizerCollection.recognizerArray[i].createResultFromNative(nativeResults[i]);
                              if (result.resultState != RecognizerResultState.empty) {
                                    results.push(result);
                              }      
                        }
                        return results;
                  }
            } catch (error) {
                  console.log(error);
                  return [];
            }
      }
      async captureDocument(documentCaptureRecognizer, license) {
            try {
                  var licenseObject = license;
                  if (typeof license === 'string' || license instanceof String) {
                      licenseObject = { licenseKey: license };
                  }
                  const nativeDocumentCaptureResult = await BlinkInputNative.captureDocument(documentCaptureRecognizer, licenseObject);

                  return new DocumentCaptureResult(nativeDocumentCaptureResult);
            } catch (error) {
                  console.log(error);
                  return [];
            }
      }
}

export var BlinkInput = new BlinkInputWrapper();

import { Recognizer } from './recognizer'

/**
 * Represents a collection of recognizer objects.
 */
export class RecognizerCollection {
      /**
       * 
       * @param recognizerArray Array of recognizer objects that will be used for recognition. Must not be empty!
       */
      constructor(recognizerArray) {
            /** Array of recognizer objects that will be used for recognition */
            this.recognizerArray = recognizerArray;
            /** 
             * Whether or not it is allowed for multiple recognizers to process the same image.
             * If not, then first recognizer that will be successful in processing the image will
             * end the processing chain and other recognizers will not get the chance to process 
             * that image.
             */
            this.allowMultipleResults = false;
            /** Number of miliseconds after first non-empty result becomes available to end scanning with a timeout */
            this.milisecondsBeforeTimeout = 10000;

            if (!(this.recognizerArray instanceof Array)) {
                  throw new Error("recognizerArray must be array of Recognizer objects!");
            }
            // ensure every element in array is Recognizer
            for (var i = 0; i < this.recognizerArray.length; ++i) {
                  if (!(this.recognizerArray[i] instanceof Recognizer )) {
                        throw new Error( "Each element in recognizerArray must be instance of Recognizer" );
                  }
            }
      }
}
import { DocumentCaptureRecognizerResult } from './recognizers/documentCaptureRecognizer'
/**
 * Represents a result of 'captureDocument' functionality.
 */
export class DocumentCaptureResult {
      constructor(nativeDocumentCaptureResult) {
            this.documentCaptureRecognizerResult = new DocumentCaptureRecognizerResult(nativeDocumentCaptureResult.documentCaptureRecognizerResult);
            this.capturedFullImage = nativeDocumentCaptureResult.capturedFullImage;
      }
}

export { RecognizerResultState } from './recognizer'
export * from './types'

// export overlays that can be used
export * from './overlays/barcodeOverlays'

// export recognizers that can be used and their results
export * from './recognizers/successFrameGrabberRecognizer'
export * from './recognizers/barcodeRecognizer'
export * from './recognizers/documentCaptureRecognizer'
export * from './recognizers/pdf417Recognizer'
export * from './recognizers/simNumberRecognizer'
export * from './recognizers/vinRecognizer'
export * from './recognizers/blinkInputRecognizer'

export { ParserResultState } from './parser'
export { ProcessorResultState } from './processor'

// export parsers that can be used and their results
export * from './parsers/amountParser'
export * from './parsers/dateParser'
export * from './parsers/emailParser'
export * from './parsers/ibanParser'
export * from './parsers/licensePlatesParser'
export * from './parsers/rawParser'
export * from './parsers/topUpParser'
export * from './parsers/vinParser'
export * from './parsers/regexParser'

// export processors that can be used and their results
export * from './processors/parserGroupProcessor'
export * from './processors/imageReturnProcessor'

