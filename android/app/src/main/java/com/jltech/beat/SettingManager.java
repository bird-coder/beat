package com.jltech.beat;

import android.app.Activity;
import android.content.Intent;
import android.provider.Settings;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class SettingManager extends ReactContextBaseJavaModule {
    public SettingManager(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() { return "SettingManager"; }

    @ReactMethod
    public void openSettings() {
        Activity activity = getCurrentActivity();
        activity.startActivity(new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS));
    }
}
