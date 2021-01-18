package com.jltech.beat;

import android.content.Intent;
import android.content.res.Configuration;
import android.os.Bundle;

import com.facebook.react.ReactActivity;
//import com.google.android.gms.ads.MobileAds;
//import com.google.android.gms.ads.initialization.InitializationStatus;
//import com.google.android.gms.ads.initialization.OnInitializationCompleteListener;
import com.umeng.message.PushAgent;
import com.umeng.socialize.UMShareAPI;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "beat";
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    ShareModule.initSocialSDK(this);
    PushModule.initPushSDK(this);
    PushAgent.getInstance(this).onAppStart();

//    MobileAds.initialize(this, new OnInitializationCompleteListener() {
//      @Override
//      public void onInitializationComplete(InitializationStatus initializationStatus) {
//
//      }
//    });
  }

  @Override
  public void onActivityResult(int requestCode, int resultCode, Intent data) {
    super.onActivityResult(requestCode, resultCode, data);
    UMShareAPI.get(this).onActivityResult(requestCode, resultCode, data);
  }

  @Override
  public void onConfigurationChanged(Configuration newConfig) {
    super.onConfigurationChanged(newConfig);
    Intent intent = new Intent("onConfigurationChanged");
    intent.putExtra("newConfig", newConfig);
    this.sendBroadcast(intent);
  }

  @Override
  public void onBackPressed() {
    if (Data.isBackKeyDisabled()) {
      return;
    }
    super.onBackPressed();
  }
}
