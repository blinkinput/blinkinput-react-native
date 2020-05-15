/**
 * Sample React Native App for BlinkIDCustom
 */

import React, { Component } from 'react';
import * as BlinkInputReactNative from 'blinkinput-react-native';
import {
    AppRegistry,
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    Button
} from 'react-native';

const licenseKey = Platform.select({
    // iOS license key for applicationID: org.reactjs.native.example.BlinkInputReactNative
    ios: 'sRwAAAEwb3JnLnJlYWN0anMubmF0aXZlLmV4YW1wbGUuQmxpbmtJbnB1dFJlYWN0TmF0aXZlbqrgdryv438C8trPOWHqrmgZCWpGe6EKxfypLI+X+vyccts4sh1wj+nT2pER2EvVzqaaB6A9K6tL6Gb4YUpYAHMiKkeVDhTDFw8r7eWppfN1Lm7oV/wo1Ts0L+NsaH50sZ3sqRP5Eem8QupVfYp81aqU3XYathY8udnt11sApQ0lIEbElaT+rpt2UNZ6VA==',
    // android license key for applicationID: com.BlinkInputReactNative
    android: 'sRwAAAAWY29tLmJsaW5raWRyZWFjdG5hdGl2ZYouOuuUS2CbdVuoF28kSae7Mot1KXNxSTJUEXsyYDMNvrttroS9LSNX1ykGhc0nWWZUDrZn3y8Yii16lnd617JrjUbB9eoxtnwRB69rnJU3RLIE1yw6rjpg5dSsud8+9v1ezxuZbjro+GabXMULTOJRKLtg1viNpvB3FaH8F4gKNyYAVQHM+wd01T0K7v5NmXDAwuW+25Hze30Iz5Hay0kBxcnXU8FNMtK7pL2K58iu2GNSMzJOHVtumPRDyH60yk+F52+UR64D1U4Ih+GB4w=='
})

var renderIf = function(condition, content) {
    if (condition) {
        return content;
    } 
    return null;
}

var createEmptyState = function() {
    return {
        showDocumentImage1: false,
        resultFrontImageDocument: '',
        showDocumentImage2: false,
        resultBackImageDocument: '',
        showImageFace: false,
        resultImageFace: '',
        showSuccessFrame: false,
        successFrame: '',
        results: '',
        licenseKeyErrorMessage: ''
    };
}

export default class BlinkInputReactNativeApp extends Component {
    constructor(props) {
        super(props);

        this.state = createEmptyState();
    }

    async scan() {
        try {

            // var mrtdSuccessFrameGrabber = new BlinkInputReactNative.SuccessFrameGrabberRecognizer(pdf417Recognizer);

            // BlinkIDCombinedRecognizer automatically classifies different document types and scans the data from
            // the supported document
            var pdf417Recognizer = new BlinkInputReactNative.Pdf417Recognizer();

            const scanningResults = await BlinkInputReactNative.BlinkInput.scanWithCamera(
                new BlinkInputReactNative.BarcodeOverlaySettings(),
                new BlinkInputReactNative.RecognizerCollection([pdf417Recognizer/*, mrtdSuccessFrameGrabber*/]),
                licenseKey
            );

            if (scanningResults) {
                let newState = createEmptyState();

                for (let i = 0; i < scanningResults.length; ++i) {
                    let localState = this.handleResult(scanningResults[i]);
                    newState.showDocumentImage1 = newState.showDocumentImage1 || localState.showDocumentImage1;
                    if (localState.showDocumentImage1) {
                        newState.resultFrontImageDocument = localState.resultFrontImageDocument;
                    }
                    newState.showDocumentImage2 = newState.showDocumentImage2 || localState.showDocumentImage2;
                    if (localState.showDocumentImage2) {
                        newState.resultBackImageDocument = localState.resultBackImageDocument;
                    }
                    newState.showImageFace = newState.showImageFace || localState.showImageFace;
                    if (localState.resultImageFace) {
                        newState.resultImageFace = localState.resultImageFace;
                    }
                    newState.results += localState.results;
                    newState.showSuccessFrame = newState.showSuccessFrame || localState.showSuccessFrame;
                    if (localState.successFrame) {
                        newState.successFrame = localState.successFrame;
                    }
                  
                }
                newState.results += '\n';
                this.setState(newState);
            }
        } catch (error) {
            console.log(error);
            this.setState({ showDocumentImage1: false, resultFrontImageDocument: '', showDocumentImage2: false, resultBackImageDocument: '', showImageFace: false, resultImageFace: '', results: 'Scanning has been cancelled', showSuccessFrame: false,
            successFrame: ''});
        }
    }

    async captureDocument() {
        try {

            var documentCaptureRecognizer = new BlinkInputReactNative.DocumentCaptureRecognizer();
            documentCaptureRecognizer.returnFullDocumentImage = true;

            const documentCaptureResult = await BlinkInputReactNative.BlinkInput.captureDocument(
                documentCaptureRecognizer,
                licenseKey
            );

            if (documentCaptureResult) {
                let newState = createEmptyState();

                let localState = this.handleResult(documentCaptureResult);
                newState.showDocumentImage1 = newState.showDocumentImage1 || localState.showDocumentImage1;
                if (localState.showDocumentImage1) {
                    newState.resultFrontImageDocument = localState.resultFrontImageDocument;
                }
                newState.showDocumentImage2 = newState.showDocumentImage2 || localState.showDocumentImage2;
                if (localState.showDocumentImage2) {
                    newState.resultBackImageDocument = localState.resultBackImageDocument;
                }
                newState.showImageFace = newState.showImageFace || localState.showImageFace;
                if (localState.resultImageFace) {
                    newState.resultImageFace = localState.resultImageFace;
                }
                newState.results += localState.results;
                newState.showSuccessFrame = newState.showSuccessFrame || localState.showSuccessFrame;
                if (localState.successFrame) {
                    newState.successFrame = localState.successFrame;
                }
                  
                newState.results += '\n';
                this.setState(newState);
            }
        } catch (error) {
            console.log(error);
            this.setState({ showDocumentImage1: false, resultFrontImageDocument: '', showDocumentImage2: false, resultBackImageDocument: '', showImageFace: false, resultImageFace: '', results: 'Scanning has been cancelled', showSuccessFrame: false,
            successFrame: ''});
        }
    }

    async scanFieldByField() {
        try {

            var fieldByFieldElement = new BlinkInputReactNative.FieldByFieldElement('Raw', new BlinkInputReactNative.RawParser(), 'Raw Text', 'Scan text');
            var fieldByFieldCollection = new BlinkInputReactNative.FieldByFieldCollection([fieldByFieldElement]);

            const fieldByFieldResult = await BlinkInputReactNative.BlinkInput.scanWithFieldByField(
                fieldByFieldCollection,
                licenseKey
            );

            if (fieldByFieldResult) {
                let newState = createEmptyState();

                for (let i = 0; i < fieldByFieldResult.length; ++i) {
                    let localState = this.handleResult(fieldByFieldResult[i]);
                    newState.showDocumentImage1 = newState.showDocumentImage1 || localState.showDocumentImage1;
                    if (localState.showDocumentImage1) {
                        newState.resultFrontImageDocument = localState.resultFrontImageDocument;
                    }
                    newState.showDocumentImage2 = newState.showDocumentImage2 || localState.showDocumentImage2;
                    if (localState.showDocumentImage2) {
                        newState.resultBackImageDocument = localState.resultBackImageDocument;
                    }
                    newState.showImageFace = newState.showImageFace || localState.showImageFace;
                    if (localState.resultImageFace) {
                        newState.resultImageFace = localState.resultImageFace;
                    }
                    newState.results += localState.results;
                    newState.showSuccessFrame = newState.showSuccessFrame || localState.showSuccessFrame;
                    if (localState.successFrame) {
                        newState.successFrame = localState.successFrame;
                    }
                }

                newState.results += '\n';
                this.setState(newState);
            }
        } catch (error) {
            console.log(error);
            this.setState({ showDocumentImage1: false, resultFrontImageDocument: '', showDocumentImage2: false, resultBackImageDocument: '', showImageFace: false, resultImageFace: '', results: 'Scanning has been cancelled', showSuccessFrame: false,
            successFrame: ''});
        }
    }

    handleResult(result) {
        let fieldDelim = ";\n";
        
        var localState = createEmptyState();
        
        if (result instanceof BlinkInputReactNative.Pdf417RecognizerResult) {
            let pdf417Result = result;
            let resultString =
                "Data: " + pdf417Result.stringData + fieldDelim;
            localState.results += resultString;

        } else if (result instanceof BlinkInputReactNative.DocumentCaptureResult) {
            localState.results = "Document Capture result";
            // Document image is returned as Base64 encoded JPEG
            if (result.documentCaptureRecognizerResult.fullDocumentImage) {
                localState.showDocumentImage1 = true;
                localState.resultFrontImageDocument = 'data:image/jpg;base64,' + result.documentCaptureRecognizerResult.fullDocumentImage;
            }
            if (result.capturedFullImage) {
                localState.showDocumentImage2 = true;
                localState.resultBackImageDocument = 'data:image/jpg;base64,' + result.capturedFullImage;
            }
        } else if (result instanceof BlinkInputReactNative.FieldByFieldResult) {
            localState.results = "Field by Field result";
            let fieldByfieldResult = result;
            let resultString =
                "Identifier: " + fieldByfieldResult.identifier + fieldDelim + "Value: " + fieldByfieldResult.value + fieldDelim;
            localState.results += resultString;
        }
        return localState;
    }

    render() {
        let displayFrontImageDocument = this.state.resultFrontImageDocument;
        let displayBackImageDocument = this.state.resultBackImageDocument;
        let displayImageFace = this.state.resultImageFace;
        let displaySuccessFrame = this.state.successFrame;
        let displayFields = this.state.results;
        return (
        <View style={styles.container}>
            <Text style={styles.label}>MicroBlink Ltd</Text>
            <View style={styles.buttonContainer}>
            <Button
                onPress={this.scan.bind(this)}
                title="Scan"
                color="#87c540"
            />
            </View>
            <View style={styles.buttonContainer}>
            <Button
                onPress={this.captureDocument.bind(this)}
                title="Capture document"
                color="#87c540"
            />
            </View>
            <View style={styles.buttonContainer}>
            <Button
                onPress={this.scanFieldByField.bind(this)}
                title="Field by Field Scanning BlinkInput"
                color="#87c540"
            />
            </View>
            <ScrollView
            automaticallyAdjustContentInsets={false}
            scrollEventThrottle={200}y> 
            {renderIf(this.state.showDocumentImage1,
                <View style={styles.imageContainer}>
                <Image
                    resizeMode='contain'
                    source={{uri: displayFrontImageDocument, scale: 3}} style={styles.imageResult}/>
                </View>
            )}
            {renderIf(this.state.showDocumentImage2,
                <View style={styles.imageContainer}>
                <Image
                    resizeMode='contain'
                    source={{uri: displayBackImageDocument, scale: 3}} style={styles.imageResult}/>
                </View>
            )}
            {renderIf(this.state.showImageFace,
                <View style={styles.imageContainer}>
                <Image
                    resizeMode='contain'
                    source={{uri: displayImageFace, scale: 3}} style={styles.imageResult}/>
                </View>
            )}
            {renderIf(this.state.showSuccessFrame,
                <View style={styles.imageContainer}>
                    <Image
                    resizeMode='contain'
                    source={{uri: displaySuccessFrame, scale: 3}} style={styles.imageResult}/>
                </View>
            )}
            <Text style={styles.results}>{displayFields}</Text>
            </ScrollView>
        </View>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  label: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 50
  },
  buttonContainer: {
    margin: 20
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  results: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  imageResult: {
    flex: 1,
    flexShrink: 1,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10
  },
});

AppRegistry.registerComponent('BlinkInputReactNative', () => BlinkInputReactNativeApp);
