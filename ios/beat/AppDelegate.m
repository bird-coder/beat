#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <CodePush/CodePush.h>
#import <RNSplashScreen.h>
#import <UMShare/UMShare.h>
#import "RNUMConfigure.h"
#import <Orientation.h>

#ifdef FB_SONARKIT_ENABLED
#import <FlipperKit/FlipperClient.h>
#import <FlipperKitLayoutPlugin/FlipperKitLayoutPlugin.h>
#import <FlipperKitUserDefaultsPlugin/FKUserDefaultsPlugin.h>
#import <FlipperKitNetworkPlugin/FlipperKitNetworkPlugin.h>
#import <SKIOSNetworkPlugin/SKIOSNetworkAdapter.h>
#import <FlipperKitReactPlugin/FlipperKitReactPlugin.h>

static void InitializeFlipper(UIApplication *application) {
  FlipperClient *client = [FlipperClient sharedClient];
  SKDescriptorMapper *layoutDescriptorMapper = [[SKDescriptorMapper alloc] initWithDefaults];
  [client addPlugin:[[FlipperKitLayoutPlugin alloc] initWithRootNode:application withDescriptorMapper:layoutDescriptorMapper]];
  [client addPlugin:[[FKUserDefaultsPlugin alloc] initWithSuiteName:nil]];
  [client addPlugin:[FlipperKitReactPlugin new]];
  [client addPlugin:[[FlipperKitNetworkPlugin alloc] initWithNetworkAdapter:[SKIOSNetworkAdapter new]]];
  [client start];
}
#endif

@import GoogleMobileAds;

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
#ifdef FB_SONARKIT_ENABLED
  InitializeFlipper(application);
#endif

  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"beat"
                                            initialProperties:nil];

  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  [RNSplashScreen show];
  [self configUShareSettings];
  [self configUSharePlatforms];
  [[GADMobileAds sharedInstance] startWithCompletionHandler:nil];
  return YES;
}

-(UIInterfaceOrientationMask)application:(UIApplication *)application supportedInterfaceOrientationsForWindow:(UIWindow *)window {
  return [Orientation getOrientation];
}

- (void)configUShareSettings
{
  [UMConfigure setLogEnabled:YES];
  //设置友盟appkey
  [RNUMConfigure initWithAppkey:@"5f5096dba4aebb6a2feaf68e" channel:@"App Store"];
  //关闭强制验证https，可允许http图片分享，但需要在info.plist设置安全域名
  [UMSocialGlobal shareInstance].isUsingHttpsWhenShareContent = NO;
  
  //配置微信平台的Universal Links
  //微信和QQ完整版会校验合法的universalLink，不设置会在初始化平台失败
  [UMSocialGlobal shareInstance].universalLinkDic = @{
    @(UMSocialPlatformType_WechatSession):@"https://ble.jltech.org.cn/",
    @(UMSocialPlatformType_QQ):@"https://ble.jltech.org.cn/qq_conn/101905791"
  };
}

- (void)configUSharePlatforms
{
  //设置微信的appKey和appSecret
  [[UMSocialManager defaultManager] setPlaform:UMSocialPlatformType_WechatSession appKey:@"wx7d836b2091ad8e2a" appSecret:@"cb6510e94dc1a4f19580d03eeb4b1518" redirectURL:@"http://mobile.umeng.com/social"];
  //设置小程序回调app的回调
  [[UMSocialManager defaultManager] setLauchFromPlatform:UMSocialPlatformType_WechatSession completion:^(id userInfoResponse, NSError *error) {
    NSLog(@"setLauchFromPlatform:userInfoResponse:%@",userInfoResponse);
  }];
  
  //设置分享到QQ互联的appID
  [[UMSocialManager defaultManager] setPlaform:UMSocialPlatformType_QQ appKey:@"101905791" appSecret:nil redirectURL:@"http://mobile.umeng.com/social"];
  
//  //设置新浪的appKey和appSecret
//  [[UMSocialManager defaultManager] setPlaform:UMSocialPlatformType_Sina appKey:@"3921700954" appSecret:@"04b48b094faeb16683c32669824ebdad" redirectURL:@"https://sns.whalecloud.com/sina2/callback"];
//  
//  //支付宝的appKey
//  [[UMSocialManager defaultManager] setPlaform: UMSocialPlatformType_APSession appKey:@"2015111700822536" appSecret:nil redirectURL:@"http://mobile.umeng.com/social"];
}

- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation
{
  BOOL result = [[UMSocialManager defaultManager] handleOpenURL:url sourceApplication:sourceApplication annotation:annotation];
  if (!result) {
    //其他如支付等SDK的回调
  }
  return result;
}

- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url
{
  BOOL result = [[UMSocialManager defaultManager] handleOpenURL:url];
  if (!result) {
    //其他如支付等SDK的回调
  }
  return result;
}

- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity restorationHandler:(void(^)(NSArray * __nullable restorableObjects))restorationHandler
{
  if (![[UMSocialManager defaultManager] handleUniversalLink:userActivity options:nil]) {
      // 其他SDK的回调
  }
  return YES;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
//  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
  return [CodePush bundleURL];
#endif
}

@end
