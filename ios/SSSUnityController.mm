#import "SSSUnityController.h"

#import "AppDelegate.h"
#import "UnityAppController.h"
#import "UnityAppController+Rendering.h"
#import "UnityAppController+ViewHandling.h"

#import "DisplayManager.h"
#import "UnityView.h"

#include "RegisterMonoModules.h"
#include "RegisterFeatures.h"
#include <csignal>

@interface SSSUnityController()

@property (nonatomic, assign) BOOL isInitUnity;

@end

@implementation SSSUnityController

static NSHashTable* mUnityEventListeners = [NSHashTable weakObjectsHashTable];

+ (instancetype)instance {
  AppDelegate *delegate = (AppDelegate *)[UIApplication sharedApplication].delegate;
  return delegate.unityController;
}

- (instancetype)init {
  self = [super init];
  if (self) {
    self.isInitUnity = NO;
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(appDidBecomeActive:) name:UIApplicationDidBecomeActiveNotification object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(appWillEnterForeground:) name:UIApplicationWillEnterForegroundNotification object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(appWillResignActive:) name:UIApplicationWillResignActiveNotification object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(appWillTerminate:) name:UIApplicationWillTerminateNotification object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(appDidReceiveMemoryWarning:) name:UIApplicationDidReceiveMemoryWarningNotification object:nil];
  }
  return self;
}

void UnityInitTrampoline();

- (void)initUnity:(void (^)(void))completed {
  AppDelegate *delegate = (AppDelegate *)[UIApplication sharedApplication].delegate;
  if (!self.isInitUnity) {
    [super applicationDidBecomeActive:[UIApplication sharedApplication]];
    
    UnityInitApplicationNoGraphics([[[NSBundle mainBundle] bundlePath] UTF8String]);
    
    [self selectRenderingAPI];
    [UnityRenderingView InitializeForAPI:self.renderingAPI];
    
    _window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
    _unityView = [self createUnityView];
    
    [DisplayManager Initialize];
    _mainDisplay = [DisplayManager Instance].mainDisplay;
    [_mainDisplay createWithWindow:_window andView:_unityView];
    
    [self createUI];
    [self preStartUnity];
    self.isInitUnity = YES;
    
//    _unityView.back = ^{
//      [delegate hideUnityWindow];
//    };
  } else {
    [self startUnity1];
  }
//  [delegate showUnityWindow];
  completed();
}

extern "C" {
  void ReturnToIOS() {
    AppDelegate *delegate = (AppDelegate *)[UIApplication sharedApplication].delegate;
    [delegate hideUnityWindow];
  }
}

- (void)pauseUnity {
  UnityPause(1);
}

- (void)startUnity1 {
  UnityPause(0);
}

- (void)postMessage:(NSString *)gameObject :(NSString *)methodName :(NSString *)message {
  UnitySendMessage([gameObject UTF8String], [methodName UTF8String], [message UTF8String]);
}

- (BOOL)isPaused {
  if (UnityIsPaused() == 1) {
    return YES;
  } else {
    return NO;
  }
}

extern "C" void onUnityMessage(const char* message)
{
    for (id<UnityEventListener> listener in mUnityEventListeners) {
        [listener onMessage:[NSString stringWithUTF8String:message]];
    }
}

+ (void)addUnityEventListener:(id<UnityEventListener>)listener
{
    [mUnityEventListeners addObject:listener];
}

+ (void)removeUnityEventListener:(id<UnityEventListener>)listener
{
    [mUnityEventListeners removeObject:listener];
}

- (void)applicationDidFinishLaunching:(UIApplication *)application {
  
}

- (void)appWillEnterForeground:(NSNotification *)notification {
    [super applicationWillEnterForeground:[UIApplication sharedApplication]];
}

- (void)appDidBecomeActive:(NSNotification *)notification {
    if (nil == self.unityView) {
        return;
    }
    [super applicationDidBecomeActive:[UIApplication sharedApplication]];
}

- (void)appWillResignActive:(NSNotification *)notification {
    [super applicationWillResignActive:[UIApplication sharedApplication]];
}

- (void)appWillTerminate:(NSNotification *)notification {
    [super applicationWillTerminate:[UIApplication sharedApplication]];
}

- (void)appDidReceiveMemoryWarning:(NSNotification *)notification {
    [super applicationDidReceiveMemoryWarning:[UIApplication sharedApplication]];
}

@end
