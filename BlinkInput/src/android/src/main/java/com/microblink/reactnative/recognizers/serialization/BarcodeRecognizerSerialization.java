package com.microblink.reactnative.recognizers.serialization;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.microblink.entities.recognizers.Recognizer;
import com.microblink.reactnative.recognizers.RecognizerSerialization;
import com.microblink.reactnative.SerializationUtils;

public final class BarcodeRecognizerSerialization implements RecognizerSerialization {
    @Override
    public Recognizer<?> createRecognizer(ReadableMap jsonMap) {
        com.microblink.entities.recognizers.blinkbarcode.barcode.BarcodeRecognizer recognizer = new com.microblink.entities.recognizers.blinkbarcode.barcode.BarcodeRecognizer();
        if (jsonMap.hasKey("autoScaleDetection")) {
            recognizer.setAutoScaleDetection(jsonMap.getBoolean("autoScaleDetection"));
        }
        if (jsonMap.hasKey("nullQuietZoneAllowed")) {
            recognizer.setNullQuietZoneAllowed(jsonMap.getBoolean("nullQuietZoneAllowed"));
        }
        if (jsonMap.hasKey("readCode39AsExtendedData")) {
            recognizer.setReadCode39AsExtendedData(jsonMap.getBoolean("readCode39AsExtendedData"));
        }
        if (jsonMap.hasKey("scanAztecCode")) {
            recognizer.setScanAztecCode(jsonMap.getBoolean("scanAztecCode"));
        }
        if (jsonMap.hasKey("scanCode128")) {
            recognizer.setScanCode128(jsonMap.getBoolean("scanCode128"));
        }
        if (jsonMap.hasKey("scanCode39")) {
            recognizer.setScanCode39(jsonMap.getBoolean("scanCode39"));
        }
        if (jsonMap.hasKey("scanDataMatrix")) {
            recognizer.setScanDataMatrix(jsonMap.getBoolean("scanDataMatrix"));
        }
        if (jsonMap.hasKey("scanEan13")) {
            recognizer.setScanEan13(jsonMap.getBoolean("scanEan13"));
        }
        if (jsonMap.hasKey("scanEan8")) {
            recognizer.setScanEan8(jsonMap.getBoolean("scanEan8"));
        }
        if (jsonMap.hasKey("scanInverse")) {
            recognizer.setScanInverse(jsonMap.getBoolean("scanInverse"));
        }
        if (jsonMap.hasKey("scanItf")) {
            recognizer.setScanItf(jsonMap.getBoolean("scanItf"));
        }
        if (jsonMap.hasKey("scanPdf417")) {
            recognizer.setScanPdf417(jsonMap.getBoolean("scanPdf417"));
        }
        if (jsonMap.hasKey("scanQrCode")) {
            recognizer.setScanQrCode(jsonMap.getBoolean("scanQrCode"));
        }
        if (jsonMap.hasKey("scanUncertain")) {
            recognizer.setScanUncertain(jsonMap.getBoolean("scanUncertain"));
        }
        if (jsonMap.hasKey("scanUpca")) {
            recognizer.setScanUpca(jsonMap.getBoolean("scanUpca"));
        }
        if (jsonMap.hasKey("scanUpce")) {
            recognizer.setScanUpce(jsonMap.getBoolean("scanUpce"));
        }
        if (jsonMap.hasKey("slowerThoroughScan")) {
            recognizer.setSlowerThoroughScan(jsonMap.getBoolean("slowerThoroughScan"));
        }
        return recognizer;
    }

    @Override
    public WritableMap serializeResult(Recognizer<?> recognizer) {
        com.microblink.entities.recognizers.blinkbarcode.barcode.BarcodeRecognizer.Result result = ((com.microblink.entities.recognizers.blinkbarcode.barcode.BarcodeRecognizer)recognizer).getResult();
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
        return "BarcodeRecognizer";
    }

    @Override
    public Class<?> getRecognizerClass() {
        return com.microblink.entities.recognizers.blinkbarcode.barcode.BarcodeRecognizer.class;
    }
}