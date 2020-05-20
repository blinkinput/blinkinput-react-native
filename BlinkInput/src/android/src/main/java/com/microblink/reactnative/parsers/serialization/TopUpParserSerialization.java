package com.microblink.reactnative.parsers.serialization;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.microblink.entities.parsers.Parser;
import com.microblink.reactnative.parsers.ParserSerialization;
import com.microblink.reactnative.SerializationUtils;

public final class TopUpParserSerialization implements ParserSerialization {
    @Override
    public Parser<?> createParser(ReadableMap jsonMap) {
        com.microblink.entities.parsers.topup.TopUpParser parser = new com.microblink.entities.parsers.topup.TopUpParser();
        if (jsonMap.hasKey("allowNoPrefix")) {
            parser.setAllowNoPrefix(jsonMap.getBoolean("allowNoPrefix"));
        }
        if (jsonMap.hasKey("returnCodeWithoutPrefix")) {
            parser.setReturnCodeWithoutPrefix(jsonMap.getBoolean("returnCodeWithoutPrefix"));
        }
        return parser;
    }

    @Override
    public WritableMap serializeResult(Parser<?> parser) {
        com.microblink.entities.parsers.topup.TopUpParser.Result result = ((com.microblink.entities.parsers.topup.TopUpParser)parser).getResult();
        WritableMap jsonResult = new WritableNativeMap();
        SerializationUtils.addCommonParserResultData(jsonResult, result);
        jsonResult.putString("topUp", result.getTopUp());
        return jsonResult;
    }

    @Override
    public String getJsonName() {
        return "TopUpParser";
    }

    @Override
    public Class<?> getParserClass() {
        return com.microblink.entities.parsers.topup.TopUpParser.class;
    }
}