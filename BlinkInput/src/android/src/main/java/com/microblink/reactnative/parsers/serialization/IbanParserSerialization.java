package com.microblink.reactnative.parsers.serialization;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.microblink.entities.parsers.Parser;
import com.microblink.reactnative.parsers.ParserSerialization;
import com.microblink.reactnative.SerializationUtils;

public final class IbanParserSerialization implements ParserSerialization {
    @Override
    public Parser<?> createParser(ReadableMap jsonMap) {
        com.microblink.entities.parsers.iban.IbanParser parser = new com.microblink.entities.parsers.iban.IbanParser();
        if (jsonMap.hasKey("alwaysReturnPrefix")) {
            parser.setAlwaysReturnPrefix(jsonMap.getBoolean("alwaysReturnPrefix"));
        }
        return parser;
    }

    @Override
    public WritableMap serializeResult(Parser<?> parser) {
        com.microblink.entities.parsers.iban.IbanParser.Result result = ((com.microblink.entities.parsers.iban.IbanParser)parser).getResult();
        WritableMap jsonResult = new WritableNativeMap();
        SerializationUtils.addCommonParserResultData(jsonResult, result);
        jsonResult.putString("iban", result.getIban());
        return jsonResult;
    }

    @Override
    public String getJsonName() {
        return "IbanParser";
    }

    @Override
    public Class<?> getParserClass() {
        return com.microblink.entities.parsers.iban.IbanParser.class;
    }
}