package com.microblink.reactnative.parsers.serialization;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.microblink.entities.parsers.Parser;
import com.microblink.reactnative.parsers.ParserSerialization;
import com.microblink.reactnative.SerializationUtils;

public final class LicensePlatesParserSerialization implements ParserSerialization {
    @Override
    public Parser<?> createParser(ReadableMap jsonMap) {
        com.microblink.entities.parsers.licenseplates.LicensePlatesParser parser = new com.microblink.entities.parsers.licenseplates.LicensePlatesParser();
        return parser;
    }

    @Override
    public WritableMap serializeResult(Parser<?> parser) {
        com.microblink.entities.parsers.licenseplates.LicensePlatesParser.Result result = ((com.microblink.entities.parsers.licenseplates.LicensePlatesParser)parser).getResult();
        WritableMap jsonResult = new WritableNativeMap();
        SerializationUtils.addCommonParserResultData(jsonResult, result);
        jsonResult.putString("licensePlateString", result.getLicensePlateString());
        return jsonResult;
    }

    @Override
    public String getJsonName() {
        return "LicensePlatesParser";
    }

    @Override
    public Class<?> getParserClass() {
        return com.microblink.entities.parsers.licenseplates.LicensePlatesParser.class;
    }
}