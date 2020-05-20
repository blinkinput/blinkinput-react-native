package com.microblink.reactnative.parsers.serialization;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.microblink.entities.parsers.Parser;
import com.microblink.reactnative.parsers.ParserSerialization;
import com.microblink.reactnative.SerializationUtils;

public final class DateParserSerialization implements ParserSerialization {
    @Override
    public Parser<?> createParser(ReadableMap jsonMap) {
        com.microblink.entities.parsers.date.DateParser parser = new com.microblink.entities.parsers.date.DateParser();
        return parser;
    }

    @Override
    public WritableMap serializeResult(Parser<?> parser) {
        com.microblink.entities.parsers.date.DateParser.Result result = ((com.microblink.entities.parsers.date.DateParser)parser).getResult();
        WritableMap jsonResult = new WritableNativeMap();
        SerializationUtils.addCommonParserResultData(jsonResult, result);
        jsonResult.putMap("date", SerializationUtils.serializeDate(result.getDate()));
        return jsonResult;
    }

    @Override
    public String getJsonName() {
        return "DateParser";
    }

    @Override
    public Class<?> getParserClass() {
        return com.microblink.entities.parsers.date.DateParser.class;
    }
}