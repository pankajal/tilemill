//
//  TileMillVersionComparator.h
//  TileMill
//
//  Created by Will White on 11/23/11.
//  Copyright (c) 2011 Development Seed. All rights reserved.
//

#import <Sparkle/SUVersionComparisonProtocol.h>

@interface TileMillVersionComparator : NSObject <SUVersionComparison>

- (NSComparisonResult)compareVersion:(NSString *)versionA toVersion:(NSString *)versionB;

@end