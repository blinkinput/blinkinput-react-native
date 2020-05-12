//
//  MBRecognizer+MBRecognizerWrapper_m.h
//  BlinkIdDevDemo
//
//  Created by DoDo on 01/06/2018.
//

#import "MBProcessorWrapper.h"
#import <Foundation/Foundation.h>

@implementation MBProcessor (JsonSerialization)

-(NSDictionary *) serializeResult {
    NSMutableDictionary* result = [[NSMutableDictionary alloc] init];

    [result setObject:[NSNumber numberWithUnsignedInteger:(self.baseResult.resultState + 1)] forKey:@"resultState"];
    return result;
}

@end