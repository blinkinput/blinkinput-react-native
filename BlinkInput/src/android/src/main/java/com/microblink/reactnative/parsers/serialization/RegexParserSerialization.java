package com.microblink.reactnative.parsers.serialization;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.microblink.entities.parsers.Parser;
import com.microblink.reactnative.parsers.ParserSerialization;
import com.microblink.reactnative.SerializationUtils;

public final class RegexParserSerialization implements ParserSerialization {

    @Override
    public Parser<?> createParser(ReadableMap jsonMap) {
        String regex = jsonMap.getString("regex");
        com.microblink.entities.parsers.regex.RegexParser parser = new com.microblink.entities.parsers.regex.RegexParser(regex);
        if (jsonMap.hasKey("startWithWhitespace")) {
            parser.setStartWithWhitespace(jsonMap.getBoolean("startWithWhitespace"));
        }
        if (jsonMap.hasKey("endWithWhitespace")) {
            parser.setEndWithWhitespace(jsonMap.getBoolean("endWithWhitespace"));
        }
        if (jsonMap.hasKey("useSieve")) {
            parser.setUseSieve(jsonMap.getBoolean("useSieve"));
        }
        return parser;
    }

    @Override
    public WritableMap serializeResult(Parser<?> parser) {
        com.microblink.entities.parsers.regex.RegexParser.Result result = ((com.microblink.entities.parsers.regex.RegexParser)parser).getResult();
        WritableMap jsonResult = new WritableNativeMap();
        SerializationUtils.addCommonParserResultData(jsonResult, result);
        jsonResult.putString("parsedString", result.getParsedString());
        return jsonResult;
    }

    @Override
    public String getJsonName() {
        return "RegexParser";
    }

    @Override
    public Class<?> getParserClass() {
        return com.microblink.entities.parsers.regex.RegexParser.class;
    }

}
