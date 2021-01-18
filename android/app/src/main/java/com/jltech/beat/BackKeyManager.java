package com.jltech.beat;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class BackKeyManager extends ReactContextBaseJavaModule {
    private ReactApplicationContext mContext;

    public BackKeyManager(ReactApplicationContext reactContext) {
        super(reactContext);
        mContext = reactContext;
    }

    @Override
    public String getName() { return "BackKeyManager"; }

    @ReactMethod
    public void setBackKeyDisabled(final boolean disabled) {
        Data.setBackKeyDisabled(disabled);
    }
}
