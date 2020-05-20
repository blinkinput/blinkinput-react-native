package com.microblink.reactnative.parsers.serialization;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.microblink.entities.parsers.Parser;
import com.microblink.reactnative.parsers.ParserSerialization;
import com.microblink.reactnative.SerializationUtils;

public final class VinParserSerialization implements ParserSerialization {
    @Override
    public Parser<?> createParser(ReadableMap jsonMap) {
        com.microblink.entities.parsers.vin.VinParser parser = new com.microblink.entities.parsers.vin.VinParser();
        return parser;
    }

    @Override
    public WritableMap serializeResult(Parser<?> parser) {
        com.microblink.entities.parsers.vin.VinParser.Result result = ((com.microblink.entities.parsers.vin.VinParser)parser).getResult();
        WritableMap jsonResult = new WritableNativeMap();
        SerializationUtils.addCommonParserResultData(jsonResult, result);
        jsonResult.putString("vin", result.getVin());
        return jsonResult;
    }

    @Override
    public String getJsonName() {
        return "VinParser";
    }

    @Override
    public Class<?> getParserClass() {
        return com.microblink.entities.parsers.vin.VinParser.class;
    }
}