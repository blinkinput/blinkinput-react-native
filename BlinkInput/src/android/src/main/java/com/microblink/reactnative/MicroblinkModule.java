package com.microblink.reactnative;

import android.app.Activity;
import android.content.Intent;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableNativeMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.bridge.WritableArray;
import com.microblink.MicroblinkSDK;
import com.microblink.entities.parsers.config.fieldbyfield.FieldByFieldBundle;
import com.microblink.entities.recognizers.RecognizerBundle;
import com.microblink.intent.IntentDataTransferMode;
import com.microblink.reactnative.overlays.OverlaySettingsSerializers;
import com.microblink.uisettings.ActivityRunner;
import com.microblink.uisettings.FieldByFieldUISettings;
import com.microblink.uisettings.UISettings;
import com.microblink.locale.LanguageUtils;
import com.microblink.entities.recognizers.blinkinput.documentcapture.DocumentCaptureRecognizer;
import com.microblink.entities.recognizers.blinkinput.documentcapture.DocumentCaptureRecognizerTransferable;
import com.microblink.uisettings.DocumentCaptureUISettings;
import com.microblink.reactnative.SerializationUtils;
import com.microblink.reactnative.recognizers.RecognizerSerializers;
import com.microblink.reactnative.parsers.ParserSerializers;

/**
 * React Native module for BlinkInput.
 */
public class MicroblinkModule extends ReactContextBaseJavaModule {

    // promise reject message codes
    private static final String ERROR_ACTIVITY_DOES_NOT_EXIST = "ERROR_ACTIVITY_DOES_NOT_EXIST";
    private static final String ERROR_LICENSE_KEY_NOT_SET = "ERROR_LICENSE_KEY_NOT_SET";
    private static final String STATUS_SCAN_CANCELED = "STATUS_SCAN_CANCELED";

    private static final String PARAM_LICENSE_KEY = "licenseKey";
    private static final String PARAM_LICENSEE = "licensee";
    private static final String PARAM_SHOW_TIME_LIMITED_LICENSE_WARNING = "showTimeLimitedLicenseKeyWarning";
    private static final String RESULT_DOCUMENT_CAPTURE_RECOGNIZER_RESULT = "documentCaptureRecognizerResult";
    private static final String RESULT_CAPTURED_FULL_IMAGE = "capturedFullImage";
    /**
     * Request code for document capture feature
     */
    private static final int DOCUMENT_CAPTURE_REQUEST_CODE = 1338;

    private static final int FIELD_BY_FIELD_CAPTURE_REQUEST_CODE = 2338;
    private FieldByFieldBundle mFieldByFieldBundle;

    /**
     * Request code for scan activity
     */
    private static final int REQUEST_CODE = 1337;

    private Promise mScanPromise;
    private RecognizerBundle mRecognizerBundle;
    private DocumentCaptureRecognizerTransferable mDocumentCaptureRecognizerTransferable;

    public MicroblinkModule(ReactApplicationContext reactContext) {
        super(reactContext);

        // Add the listener for `onActivityResult`
        reactContext.addActivityEventListener(mScanActivityListener);
    }

    @Override
    public String getName() {
        return "BlinkInputAndroid";
    }

    @ReactMethod
    public void scanWithCamera(ReadableMap jsonOverlaySettings, ReadableMap jsonRecognizerCollection, ReadableMap license, Promise promise) {
        prepareScanning(license, promise);

        mRecognizerBundle = RecognizerSerializers.INSTANCE.deserializeRecognizerCollection(jsonRecognizerCollection);
        UISettings overlaySettings = OverlaySettingsSerializers.INSTANCE.getOverlaySettings(getReactApplicationContext(), jsonOverlaySettings, mRecognizerBundle);
        if (jsonOverlaySettings.hasKey("language")) {
            String language = jsonOverlaySettings.getString("language");
            if (language != null) {
                String country = jsonOverlaySettings.hasKey("country") ? jsonOverlaySettings.getString("country") : null;
                LanguageUtils.setLanguageAndCountry(language, country, getCurrentActivity());
            }
        }

        ActivityRunner.startActivityForResult(getCurrentActivity(), REQUEST_CODE, overlaySettings);
    }
    @ReactMethod
    public void captureDocument(ReadableMap documentCaptureRecognizerSerialized, ReadableMap license, Promise promise) {
        prepareScanning(license, promise);

        DocumentCaptureRecognizer recognizer = (DocumentCaptureRecognizer) RecognizerSerializers.INSTANCE.getRecognizerSerialization(documentCaptureRecognizerSerialized).createRecognizer(documentCaptureRecognizerSerialized);
        mDocumentCaptureRecognizerTransferable = new DocumentCaptureRecognizerTransferable(recognizer);
        DocumentCaptureUISettings overlaySettings = new DocumentCaptureUISettings(mDocumentCaptureRecognizerTransferable);

        ActivityRunner.startActivityForResult(getCurrentActivity(), DOCUMENT_CAPTURE_REQUEST_CODE, overlaySettings);
    }
    @ReactMethod
    public void scanWithFieldByField(ReadableMap jsonFieldByFieldCollection, ReadableMap license, Promise promise) {
        prepareScanning(license, promise);
        mFieldByFieldBundle = ParserSerializers.INSTANCE.deserializeFieldByFieldCollection(jsonFieldByFieldCollection);
        FieldByFieldUISettings overlaySettings = new FieldByFieldUISettings(mFieldByFieldBundle);
        ActivityRunner.startActivityForResult(getCurrentActivity(), FIELD_BY_FIELD_CAPTURE_REQUEST_CODE, overlaySettings);
    }

    private void prepareScanning(ReadableMap license, Promise promise) {
        Activity currentActivity = getCurrentActivity();
        if (currentActivity == null) {
            promise.reject(ERROR_ACTIVITY_DOES_NOT_EXIST, "Activity does not exist");
            return;
        }

        // Store the promise to resolve/reject when scanning is done
        mScanPromise = promise;
        if (!license.hasKey(PARAM_LICENSE_KEY)) {
            promise.reject(ERROR_LICENSE_KEY_NOT_SET, "License key is not set");
            return;
        }
        String licenseKey = license.getString(PARAM_LICENSE_KEY);
        String licensee = null;
        if (license.hasKey(PARAM_LICENSEE)) {
            licensee = license.getString(PARAM_LICENSEE);
        }
        Boolean showTimeLimitedLicenseKeyWarning = null;
        if (license.hasKey(PARAM_SHOW_TIME_LIMITED_LICENSE_WARNING)) {
            showTimeLimitedLicenseKeyWarning = license.getBoolean(PARAM_SHOW_TIME_LIMITED_LICENSE_WARNING);
        }
        setLicense(licenseKey, licensee, showTimeLimitedLicenseKeyWarning);
    }

    private void setLicense( String licenseKey, String licensee, Boolean showTimeLimitedLicenseKeyWarning ) {
        if (showTimeLimitedLicenseKeyWarning != null) {
            MicroblinkSDK.setShowTimeLimitedLicenseWarning(showTimeLimitedLicenseKeyWarning);
        }
        if (licensee != null) {
            MicroblinkSDK.setLicenseKey(licenseKey, licensee, this.getCurrentActivity());
        } else {
            MicroblinkSDK.setLicenseKey(licenseKey, this.getCurrentActivity());
        }
        MicroblinkSDK.setIntentDataTransferMode(IntentDataTransferMode.PERSISTED_OPTIMISED);
    }

    private void rejectPromise(String code, String message) {
        if (mScanPromise == null) {
            return;
        }
        mScanPromise.reject(code, message);
        mScanPromise = null;
    }

    private final ActivityEventListener mScanActivityListener = new BaseActivityEventListener() {
        @Override
        public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
            if (mScanPromise != null) {
                if (resultCode == Activity.RESULT_OK) {
                    if (requestCode == REQUEST_CODE) {
                        mRecognizerBundle.loadFromIntent(data);
                        WritableArray resultList = RecognizerSerializers.INSTANCE.serializeRecognizerResults(mRecognizerBundle.getRecognizers());
                        mScanPromise.resolve(resultList);
                    } else if (requestCode == DOCUMENT_CAPTURE_REQUEST_CODE) {
                        mDocumentCaptureRecognizerTransferable.loadFromIntent(data);
                        DocumentCaptureRecognizer dcRecognizer = mDocumentCaptureRecognizerTransferable
                            .getDocumentCaptureRecognizer();
                        WritableMap resultMap = new WritableNativeMap();
                        resultMap.putMap(
                            RESULT_DOCUMENT_CAPTURE_RECOGNIZER_RESULT,
                            RecognizerSerializers.INSTANCE.getRecognizerSerialization(dcRecognizer).serializeResult(dcRecognizer)
                        );
                        resultMap.putString(
                            RESULT_CAPTURED_FULL_IMAGE,
                            SerializationUtils.encodeImageBase64(mDocumentCaptureRecognizerTransferable.getCapturedFullImage().getImage())
                        );
                        mScanPromise.resolve(resultMap);
                    } else if (requestCode == FIELD_BY_FIELD_CAPTURE_REQUEST_CODE) {
                        mFieldByFieldBundle.loadFromIntent(data);
                        WritableArray resultArray = ParserSerializers.INSTANCE.serializeFieldByFieldResults(getCurrentActivity(), mFieldByFieldBundle.getElements());
                        mScanPromise.resolve(resultArray);
                    }
                } else if (resultCode == Activity.RESULT_CANCELED) {
                    rejectPromise(STATUS_SCAN_CANCELED, "Scanning has been canceled");
                }
                mScanPromise = null;
            }
        }
    };
}