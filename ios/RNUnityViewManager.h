//
//  RNUnityViewManager.h
//  RNUnityView
//
//  Created by xzper on 2018/2/23.
//  Copyright © 2018年 xzper. All rights reserved.
//

#import <React/RCTViewManager.h>
#import <React/RCTBridgeModule.h>
#import "SSSUnityController.h"
#import "RNUnityView.h"

@interface RNUnityViewManager : RCTViewManager <RCTBridgeModule>

@property (nonatomic, strong) RNUnityView *currentView;

@end
