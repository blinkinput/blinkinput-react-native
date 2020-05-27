package com.microblink.reactnative.parsers.serialization;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.microblink.entities.parsers.Parser;
import com.microblink.reactnative.parsers.ParserSerialization;
import com.microblink.reactnative.SerializationUtils;

public final class EmailParserSerialization implements ParserSerialization {
    @Override
    public Parser<?> createParser(ReadableMap jsonMap) {
        com.microblink.entities.parsers.email.EmailParser parser = new com.microblink.entities.parsers.email.EmailParser();
        return parser;
    }

    @Override
    public WritableMap serializeResult(Parser<?> parser) {
        com.microblink.entities.parsers.email.EmailParser.Result result = ((com.microblink.entities.parsers.email.EmailParser)parser).getResult();
        WritableMap jsonResult = new WritableNativeMap();
        SerializationUtils.addCommonParserResultData(jsonResult, result);
        jsonResult.putString("email", result.getEmail());
        return jsonResult;
    }

    @Override
    public String getJsonName() {
        return "EmailParser";
    }

    @Override
    public Class<?> getParserClass() {
        return com.microblink.entities.parsers.email.EmailParser.class;
    }
}