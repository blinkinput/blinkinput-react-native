package com.microblink.reactnative.parsers;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.microblink.entities.parsers.Parser;

public interface ParserSerialization {
    Parser<?> createParser(ReadableMap jsonParser);
    WritableMap serializeResult(Parser<?> parser);

    String getJsonName();
    Class<?> getParserClass();
}
