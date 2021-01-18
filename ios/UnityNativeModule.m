//
//  UnityNativeModule.m
//  beat
//
//  Created by 俞嘉杰 on 2020/8/13.
//

#import <Foundation/Foundation.h>
#import "UnityNativeModule.h"

@implementation RCTUnityModule

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE(RnNativeModule);

- (id)init
{
    self = [super init];
    if (self) {
        [SSSUnityController addUnityEventListener:self];
    }
    return self;
}

- (NSArray<NSString *> *)supportedEvents
{
    return @[@"onUnityMessage"];
}

+ (BOOL)requiresMainQueueSetup
{
    return YES;
}

RCT_EXPORT_METHOD(createUnity)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    [[SSSUnityController instance] initUnity:^{}];
  });
}

RCT_EXPORT_METHOD(postMessage:(NSString *)gameObject methodName:(NSString *)methodName message:(NSString *)message)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    [[SSSUnityController instance] postMessage:gameObject :methodName :message];
  });
}

- (void)onMessage:(NSString *)message {
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"
    [_bridge.eventDispatcher sendDeviceEventWithName:@"onUnityMessage"
                                                body:message];
#pragma clang diagnostic pop
}

@end
