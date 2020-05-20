package com.microblink.reactnative.parsers.serialization;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.microblink.entities.parsers.Parser;
import com.microblink.reactnative.parsers.ParserSerialization;
import com.microblink.reactnative.SerializationUtils;

public final class RawParserSerialization implements ParserSerialization {
    @Override
    public Parser<?> createParser(ReadableMap jsonMap) {
        com.microblink.entities.parsers.raw.RawParser parser = new com.microblink.entities.parsers.raw.RawParser();
        if (jsonMap.hasKey("useSieve")) {
            parser.setUseSieve(jsonMap.getBoolean("useSieve"));
        }
        return parser;
    }

    @Override
    public WritableMap serializeResult(Parser<?> parser) {
        com.microblink.entities.parsers.raw.RawParser.Result result = ((com.microblink.entities.parsers.raw.RawParser)parser).getResult();
        WritableMap jsonResult = new WritableNativeMap();
        SerializationUtils.addCommonParserResultData(jsonResult, result);
        jsonResult.putString("rawText", result.getRawText());
        return jsonResult;
    }

    @Override
    public String getJsonName() {
        return "RawParser";
    }

    @Override
    public Class<?> getParserClass() {
        return com.microblink.entities.parsers.raw.RawParser.class;
    }
}