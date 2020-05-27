package com.microblink.reactnative.parsers.serialization;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.microblink.entities.parsers.Parser;
import com.microblink.reactnative.parsers.ParserSerialization;
import com.microblink.reactnative.SerializationUtils;

public final class AmountParserSerialization implements ParserSerialization {
    @Override
    public Parser<?> createParser(ReadableMap jsonMap) {
        com.microblink.entities.parsers.amount.AmountParser parser = new com.microblink.entities.parsers.amount.AmountParser();
        if (jsonMap.hasKey("allowMissingDecimals")) {
            parser.setAllowMissingDecimals(jsonMap.getBoolean("allowMissingDecimals"));
        }
        if (jsonMap.hasKey("allowNegativeAmounts")) {
            parser.setAllowNegativeAmounts(jsonMap.getBoolean("allowNegativeAmounts"));
        }
        if (jsonMap.hasKey("allowSpaceSeparators")) {
            parser.setAllowSpaceSeparators(jsonMap.getBoolean("allowSpaceSeparators"));
        }
        if (jsonMap.hasKey("arabicIndicMode")) {
            parser.setArabicIndicMode(jsonMap.getBoolean("arabicIndicMode"));
        }
        return parser;
    }

    @Override
    public WritableMap serializeResult(Parser<?> parser) {
        com.microblink.entities.parsers.amount.AmountParser.Result result = ((com.microblink.entities.parsers.amount.AmountParser)parser).getResult();
        WritableMap jsonResult = new WritableNativeMap();
        SerializationUtils.addCommonParserResultData(jsonResult, result);
        jsonResult.putString("amount", result.getAmount());
        return jsonResult;
    }

    @Override
    public String getJsonName() {
        return "AmountParser";
    }

    @Override
    public Class<?> getParserClass() {
        return com.microblink.entities.parsers.amount.AmountParser.class;
    }
}