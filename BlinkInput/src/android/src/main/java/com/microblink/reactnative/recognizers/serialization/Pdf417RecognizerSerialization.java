package com.microblink.reactnative.recognizers.serialization;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.microblink.entities.recognizers.Recognizer;
import com.microblink.reactnative.recognizers.RecognizerSerialization;
import com.microblink.reactnative.SerializationUtils;

public final class Pdf417RecognizerSerialization implements RecognizerSerialization {
    @Override
    public Recognizer<?> createRecognizer(ReadableMap jsonMap) {
        com.microblink.entities.recognizers.blinkbarcode.pdf417.Pdf417Recognizer recognizer = new com.microblink.entities.recognizers.blinkbarcode.pdf417.Pdf417Recognizer();
        if (jsonMap.hasKey("nullQuietZoneAllowed")) {
            recognizer.setNullQuietZoneAllowed(jsonMap.getBoolean("nullQuietZoneAllowed"));
        }
        if (jsonMap.hasKey("scanInverse")) {
            recognizer.setScanInverse(jsonMap.getBoolean("scanInverse"));
        }
        if (jsonMap.hasKey("scanUncertain")) {
            recognizer.setScanUncertain(jsonMap.getBoolean("scanUncertain"));
        }
        return recognizer;
    }

    @Override
    public WritableMap serializeResult(Recognizer<?> recognizer) {
        com.microblink.entities.recognizers.blinkbarcode.pdf417.Pdf417Recognizer.Result result = ((com.microblink.entities.recognizers.blinkbarcode.pdf417.Pdf417Recognizer)recognizer).getResult();
        WritableMap jsonResult = new WritableNativeMap();
        SerializationUtils.addCommonRecognizerResultData(jsonResult, result);
        jsonResult.putInt("barcodeType", SerializationUtils.serializeEnum(result.getBarcodeType()));
        jsonResult.putString("rawData", SerializationUtils.encodeByteArrayToBase64(result.getRawData()));
        jsonResult.putString("stringData", result.getStringData());
        jsonResult.putBoolean("uncertain", result.isUncertain());
        return jsonResult;
    }

    @Override
    public String getJsonName() {
        return "Pdf417Recognizer";
    }

    @Override
    public Class<?> getRecognizerClass() {
        return com.microblink.entities.recognizers.blinkbarcode.pdf417.Pdf417Recognizer.class;
    }
}