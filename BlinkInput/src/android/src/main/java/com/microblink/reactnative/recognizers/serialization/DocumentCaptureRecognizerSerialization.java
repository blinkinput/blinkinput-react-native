package com.microblink.reactnative.recognizers.serialization;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.microblink.entities.recognizers.Recognizer;
import com.microblink.reactnative.recognizers.RecognizerSerialization;
import com.microblink.reactnative.SerializationUtils;

public final class DocumentCaptureRecognizerSerialization implements RecognizerSerialization {
    @Override
    public Recognizer<?> createRecognizer(ReadableMap jsonMap) {
        com.microblink.entities.recognizers.blinkinput.documentcapture.DocumentCaptureRecognizer recognizer = new com.microblink.entities.recognizers.blinkinput.documentcapture.DocumentCaptureRecognizer();
        if (jsonMap.hasKey("fullDocumentImageExtensionFactors")) {
            recognizer.setFullDocumentImageExtensionFactors(SerializationUtils.deserializeExtensionFactors(jsonMap.getMap("fullDocumentImageExtensionFactors")));
        }
        if (jsonMap.hasKey("minDocumentScale")) {
            recognizer.setMinDocumentScale((float)jsonMap.getDouble("minDocumentScale"));
        }
        if (jsonMap.hasKey("numStableDetectionsThreshold")) {
            recognizer.setNumStableDetectionsThreshold(jsonMap.getInt("numStableDetectionsThreshold"));
        }
        if (jsonMap.hasKey("returnFullDocumentImage")) {
            recognizer.setReturnFullDocumentImage(jsonMap.getBoolean("returnFullDocumentImage"));
        }
        return recognizer;
    }

    @Override
    public WritableMap serializeResult(Recognizer<?> recognizer) {
        com.microblink.entities.recognizers.blinkinput.documentcapture.DocumentCaptureRecognizer.Result result = ((com.microblink.entities.recognizers.blinkinput.documentcapture.DocumentCaptureRecognizer)recognizer).getResult();
        WritableMap jsonResult = new WritableNativeMap();
        SerializationUtils.addCommonRecognizerResultData(jsonResult, result);
        jsonResult.putMap("detectionLocation", SerializationUtils.serializeQuad(result.getDetectionLocation()));
        jsonResult.putString("fullDocumentImage", SerializationUtils.encodeImageBase64(result.getFullDocumentImage()));
        return jsonResult;
    }

    @Override
    public String getJsonName() {
        return "DocumentCaptureRecognizer";
    }

    @Override
    public Class<?> getRecognizerClass() {
        return com.microblink.entities.recognizers.blinkinput.documentcapture.DocumentCaptureRecognizer.class;
    }
}