package com.microblink.reactnative.parsers;

import android.content.Context;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.ReadableArray;
import com.microblink.entities.parsers.Parser;
import com.microblink.entities.parsers.config.fieldbyfield.FieldByFieldBundle;
import com.microblink.entities.parsers.config.fieldbyfield.FieldByFieldElement;
import com.microblink.reactnative.parsers.serialization.*;

import java.util.HashMap;

public enum ParserSerializers {
    INSTANCE;

    private HashMap<String, ParserSerialization> parsersByJSONName = new HashMap<>();
    private HashMap<Class<?>, ParserSerialization> parsersByClass = new HashMap<>();

    ParserSerializers() {
        registerMapping(new AmountParserSerialization());
        registerMapping(new DateParserSerialization());
        registerMapping(new EmailParserSerialization());
        registerMapping(new IbanParserSerialization());
        registerMapping(new LicensePlatesParserSerialization());
        registerMapping(new RawParserSerialization());
        registerMapping(new TopUpParserSerialization());
        registerMapping(new VinParserSerialization());
        registerMapping(new RegexParserSerialization());
    }

    private void registerMapping( ParserSerialization parserSerialization ) {
        parsersByJSONName.put(parserSerialization.getJsonName(), parserSerialization);
        parsersByClass.put(parserSerialization.getParserClass(), parserSerialization);
    }

    public ParserSerialization getParserSerialization(ReadableMap jsonMap) {
        return parsersByJSONName.get(jsonMap.getString("parserType"));
    }

    public ParserSerialization getParserSerialization(Parser<?> parser) {
        return parsersByClass.get(parser.getClass());
    }

    public WritableArray serializeFieldByFieldResults(Context context, FieldByFieldElement[] elements) {
        WritableArray jsonArray = new WritableNativeArray();

        for (FieldByFieldElement elem : elements) {
            WritableMap jsonMap = new WritableNativeMap();
            String key = elem.getTitle(context);
            String stringValue = elem.getParser().getResult().toString();
            jsonMap.putString("identifier", key);
            jsonMap.putString("value", stringValue);
            jsonArray.pushMap(jsonMap);
        }

        return jsonArray;
    }

    public FieldByFieldBundle deserializeFieldByFieldCollection(ReadableMap jsonMap) {
        ReadableArray elementArray = jsonMap.getArray("fieldByFieldElementArray");
        int numElements = elementArray.size();
        FieldByFieldElement[] elements = new FieldByFieldElement[numElements];
        for (int i = 0; i < numElements; ++i) {
            ReadableMap elementMap = elementArray.getMap(i);
            Parser<?> parser = getParserSerialization(elementMap.getMap("parser")).createParser(elementMap.getMap("parser"));
            String title = elementMap.getString("localizedTitle");
            String text = elementMap.getString("localizedTooltip");
            elements[ i ] = new FieldByFieldElement(title, text, parser);
        }

        return new FieldByFieldBundle(elements);
    }

}