#import "UnityFramework/UnityFramework.h"

@protocol UnityEventListener <NSObject>
- (void)onMessage:(NSString *)message;
@end

@interface SSSUnityController : UnityAppController

+ (instancetype)instance;
- (void)initUnity:(void (^)(void))completed;
- (void)pauseUnity;
- (void)startUnity1;
- (void)postMessage:(NSString *)gameObject :(NSString *)methodName :(NSString *)message;
- (BOOL)isPaused;
+ (void)addUnityEventListener:(id<UnityEventListener>)listener;
+ (void)removeUnityEventListener:(id<UnityEventListener>)listener;

@end
