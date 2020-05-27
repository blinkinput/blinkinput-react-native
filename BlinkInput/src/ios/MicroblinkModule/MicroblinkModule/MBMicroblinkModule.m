#import "MBOverlayViewControllerDelegate.h"
#import "MBRecognizerSerializers.h"
#import "MBOverlaySettingsSerializers.h"
#import "MBRecognizerWrapper.h"
#import "MBSerializationUtils.h"
#import "MBParserSerializers.h"
#import "MBParserWrapper.h"

#import <Foundation/Foundation.h>
#import "MBMicroblinkModule.h"
#import <React/RCTConvert.h>
#import <MicroBlink/MicroBlink.h>

typedef NS_ENUM(NSUInteger, PPImageType) {
    PPImageTypeFace,
    PPImageTypeDocument,
    PPImageTypeSuccessful,
};

@interface MBMicroblinkModule () <MBOverlayViewControllerDelegate>

@property (nonatomic, strong) MBRecognizerCollection *recognizerCollection;
@property (nonatomic) id<MBRecognizerRunnerViewController> scanningViewController;
@property (nonatomic) MBImage *highResImage;

@property (nonatomic, strong) RCTPromiseResolveBlock promiseResolve;
@property (nonatomic, strong) RCTPromiseRejectBlock promiseReject;

@end

// promise reject message codes
static NSString* const kErrorLicenseKeyDoesNotExists = @"ERROR_LICENSE_KEY_DOES_NOT_EXISTS";
static NSString* const kErrorCoordniatorDoesNotExists = @"COORDINATOR_DOES_NOT_EXISTS";
static NSString* const kStatusScanCanceled = @"STATUS_SCAN_CANCELED";
static NSString* const RESULT_DOCUMENT_CAPTURE_RECOGNIZER_RESULT = @"documentCaptureRecognizerResult";
static NSString* const RESULT_CAPTURED_FULL_IMAGE = @"capturedFullImage";

// NSError Domain
static NSString* const MBErrorDomain = @"microblink.error";

@implementation MBMicroblinkModule

RCT_EXPORT_MODULE(BlinkInputIos);

- (instancetype)init {
    if (self = [super init]) {
    }
    return self;
}

+ (BOOL)requiresMainQueueSetup {
    return YES;
}

/**
 Method  sanitizes the dictionary replaces all occurances of NSNull with nil

 @param dictionary JSON objects
 @return new dictionary with NSNull values replaced with nil
 */
- (NSDictionary *)sanitizeDictionary:(NSDictionary *)dictionary {
    NSMutableDictionary *mutableDictionary = [[NSMutableDictionary alloc] initWithDictionary:dictionary];
    for (NSString* key in dictionary.allKeys) {
        if (mutableDictionary[key] == [NSNull null]) {
            mutableDictionary[key] = nil;
        }
    }
    return mutableDictionary;
}

RCT_REMAP_METHOD(scanWithCamera, scanWithCamera:(NSDictionary *)jsonOverlaySettings recognizerCollection:(NSDictionary *)jsonRecognizerCollection license:(NSDictionary *)jsonLicense resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {

    // Sanitize the dictionaries
    jsonOverlaySettings = [self sanitizeDictionary:jsonOverlaySettings];
    jsonRecognizerCollection = [self sanitizeDictionary:jsonRecognizerCollection];
    jsonLicense = [self sanitizeDictionary:jsonLicense];

    self.promiseResolve = resolve;
    self.promiseReject = reject;

    if ([jsonLicense objectForKey:@"showTimeLimitedLicenseKeyWarning"] != nil) {
        BOOL showTimeLimitedLicenseKeyWarning = [[jsonLicense objectForKey:@"showTimeLimitedLicenseKeyWarning"] boolValue];
        [MBMicroblinkSDK sharedInstance].showLicenseKeyTimeLimitedWarning = showTimeLimitedLicenseKeyWarning;
    }
    NSString* iosLicense = [jsonLicense objectForKey:@"licenseKey"];
    if ([jsonLicense objectForKey:@"licensee"] != nil) {
        NSString *licensee = [jsonLicense objectForKey:@"licensee"];
        [[MBMicroblinkSDK sharedInstance] setLicenseKey:iosLicense andLicensee:licensee];
    }
    else {
        [[MBMicroblinkSDK sharedInstance] setLicenseKey:iosLicense];
    }

    self.recognizerCollection = [[MBRecognizerSerializers sharedInstance] deserializeRecognizerCollection:jsonRecognizerCollection];

    dispatch_sync(dispatch_get_main_queue(), ^{
        MBOverlayViewController *overlayVC = [[MBOverlaySettingsSerializers sharedInstance] createOverlayViewController:jsonOverlaySettings recognizerCollection:self.recognizerCollection delegate:self];
        
        UIViewController<MBRecognizerRunnerViewController>* recognizerRunnerViewController = [MBViewControllerFactory recognizerRunnerViewControllerWithOverlayViewController:overlayVC];
        self.scanningViewController = recognizerRunnerViewController;

        UIViewController *rootViewController = [[[UIApplication sharedApplication] keyWindow] rootViewController];
        [rootViewController presentViewController:self.scanningViewController animated:YES completion:nil];
    });
}
RCT_REMAP_METHOD(captureDocument, captureDocument:(NSDictionary *)jsonOverlaySettings license:(NSDictionary *)jsonLicense resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {

    // Sanitize the dictionaries
    jsonOverlaySettings = [self sanitizeDictionary:jsonOverlaySettings];
    jsonLicense = [self sanitizeDictionary:jsonLicense];

    self.promiseResolve = resolve;
    self.promiseReject = reject;

    if ([jsonLicense objectForKey:@"showTimeLimitedLicenseKeyWarning"] != nil) {
        BOOL showTimeLimitedLicenseKeyWarning = [[jsonLicense objectForKey:@"showTimeLimitedLicenseKeyWarning"] boolValue];
        [MBMicroblinkSDK sharedInstance].showLicenseKeyTimeLimitedWarning = showTimeLimitedLicenseKeyWarning;
    }
    NSString* iosLicense = [jsonLicense objectForKey:@"licenseKey"];
    if ([jsonLicense objectForKey:@"licensee"] != nil) {
        NSString *licensee = [jsonLicense objectForKey:@"licensee"];
        [[MBMicroblinkSDK sharedInstance] setLicenseKey:iosLicense andLicensee:licensee];
    }
    else {
        [[MBMicroblinkSDK sharedInstance] setLicenseKey:iosLicense];
    }

    id<MBRecognizerCreator> documentCaptureRecognizerJson = [[MBRecognizerSerializers sharedInstance] recognizerCreatorForJson:jsonOverlaySettings];
    MBDocumentCaptureRecognizer *recognizer = (MBDocumentCaptureRecognizer *)[documentCaptureRecognizerJson createRecognizer: jsonOverlaySettings];
    recognizer.returnFullDocumentImage = YES;

    self.recognizerCollection = [[MBRecognizerCollection alloc] initWithRecognizers:@[recognizer]];

    dispatch_sync(dispatch_get_main_queue(), ^{
        MBOverlayViewController *overlayVC = [[MBOverlaySettingsSerializers sharedInstance] createDocumentCaptureOverlayViewControllerWithCollection:self.recognizerCollection delegate:self];
        
        UIViewController<MBRecognizerRunnerViewController>* recognizerRunnerViewController = [MBViewControllerFactory recognizerRunnerViewControllerWithOverlayViewController:overlayVC];
        self.scanningViewController = recognizerRunnerViewController;

        UIViewController *rootViewController = [[[UIApplication sharedApplication] keyWindow] rootViewController];
        [rootViewController presentViewController:self.scanningViewController animated:YES completion:nil];
    });
}
RCT_REMAP_METHOD(scanWithFieldByField, fieldByFieldCollection:(NSDictionary *)jsonOverlaySettings license:(NSDictionary *)jsonLicense resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {

    // Sanitize the dictionaries
    jsonOverlaySettings = [self sanitizeDictionary:jsonOverlaySettings];
    jsonLicense = [self sanitizeDictionary:jsonLicense];

    self.promiseResolve = resolve;
    self.promiseReject = reject;

    if ([jsonLicense objectForKey:@"showTimeLimitedLicenseKeyWarning"] != nil) {
        BOOL showTimeLimitedLicenseKeyWarning = [[jsonLicense objectForKey:@"showTimeLimitedLicenseKeyWarning"] boolValue];
        [MBMicroblinkSDK sharedInstance].showLicenseKeyTimeLimitedWarning = showTimeLimitedLicenseKeyWarning;
    }
    NSString* iosLicense = [jsonLicense objectForKey:@"licenseKey"];
    if ([jsonLicense objectForKey:@"licensee"] != nil) {
        NSString *licensee = [jsonLicense objectForKey:@"licensee"];
        [[MBMicroblinkSDK sharedInstance] setLicenseKey:iosLicense andLicensee:licensee];
    }
    else {
        [[MBMicroblinkSDK sharedInstance] setLicenseKey:iosLicense];
    }

    NSArray *fieldByFieldElements = [jsonOverlaySettings valueForKey:@"fieldByFieldElementArray"];
    NSUInteger numOfFieldElements = fieldByFieldElements.count;
    NSMutableArray<MBScanElement *> *scanElementsArray = [[NSMutableArray alloc] initWithCapacity:numOfFieldElements];
    for (int i=0; i < numOfFieldElements; i++) {
        id<MBParserCreator> parserRecognizerJson = [[MBParserSerializers sharedInstance] parserCreatorForJson:[fieldByFieldElements[i] valueForKey:@"parser"]];
        MBParser *parser = (MBParser *)[parserRecognizerJson createParser:[fieldByFieldElements[i] valueForKey:@"parser"]];
        MBScanElement *scanElement = [[MBScanElement alloc] initWithIdentifier:[(NSString *)fieldByFieldElements[i] valueForKey:@"identifier"] parser:parser];
        scanElement.localizedTitle = [(NSString *)fieldByFieldElements[i] valueForKey:@"localizedTitle"];
        scanElement.localizedTooltip = [(NSString *)fieldByFieldElements[i] valueForKey:@"localizedTooltip"];
        [scanElementsArray addObject:scanElement];
    }

    dispatch_sync(dispatch_get_main_queue(), ^{
        MBOverlayViewController *overlayVC = [[MBOverlaySettingsSerializers sharedInstance] createFieldByFieldOverlayViewControllerWithScanelements:scanElementsArray delegate:self];
                
        UIViewController<MBRecognizerRunnerViewController>* recognizerRunnerViewController = [MBViewControllerFactory recognizerRunnerViewControllerWithOverlayViewController:overlayVC];
        self.scanningViewController = recognizerRunnerViewController;

        UIViewController *rootViewController = [[[UIApplication sharedApplication] keyWindow] rootViewController];
        [rootViewController presentViewController:self.scanningViewController animated:YES completion:nil];
    });
}

- (void)overlayViewControllerDidFinishScanning:(MBOverlayViewController *)overlayViewController state:(MBRecognizerResultState)state {
    if (state != MBRecognizerResultStateEmpty) {
        [overlayViewController.recognizerRunnerViewController pauseScanning];
        // recognizers within self.recognizerCollection now have their results filled
            NSDictionary *resultDocumentCapture;

        BOOL isDocumentCaptureRecognizer = NO;

        NSMutableArray *jsonResults = [[NSMutableArray alloc] initWithCapacity:self.recognizerCollection.recognizerList.count];
        
        for (NSUInteger i = 0; i < self.recognizerCollection.recognizerList.count; ++i) {
            [jsonResults addObject:[[self.recognizerCollection.recognizerList objectAtIndex:i] serializeResult]];
            if ([[self.recognizerCollection.recognizerList objectAtIndex:i] isKindOfClass:[MBDocumentCaptureRecognizer class]]) {
                    MBDocumentCaptureRecognizer *recognizer = (MBDocumentCaptureRecognizer *)[self.recognizerCollection.recognizerList objectAtIndex:i];
                    resultDocumentCapture = @{RESULT_DOCUMENT_CAPTURE_RECOGNIZER_RESULT: [recognizer serializeResult], RESULT_CAPTURED_FULL_IMAGE: [MBSerializationUtils encodeMBImage:self.highResImage]};
                    isDocumentCaptureRecognizer = YES;
            }

        if (!isDocumentCaptureRecognizer) {
            self.promiseResolve(jsonResults);
        }
        else {
            self.promiseResolve(resultDocumentCapture);
        }
        // dismiss recognizer runner view controller
        dispatch_async(dispatch_get_main_queue(), ^{
            UIViewController *rootViewController = [[[UIApplication sharedApplication] keyWindow] rootViewController];
            [rootViewController dismissViewControllerAnimated:YES completion:nil];
            self.recognizerCollection = nil;
            self.scanningViewController = nil;
            self.promiseResolve = nil;
            self.promiseReject = nil;
               self.highResImage = nil;
            });
        }
    }
}

- (void)overlayDidTapClose:(MBOverlayViewController *)overlayViewController {
    UIViewController *rootViewController = [[[UIApplication sharedApplication] keyWindow] rootViewController];
    [rootViewController dismissViewControllerAnimated:YES completion:nil];
    self.recognizerCollection = nil;
    self.scanningViewController = nil;
    NSError *error = [NSError errorWithDomain:MBErrorDomain
                                         code:-58
                                     userInfo:nil];
    self.promiseReject(kStatusScanCanceled, @"Scanning has been canceled", error);

    self.promiseResolve = nil;
    self.promiseReject = nil;
}
- (void)overlayViewControllerDidFinishScanning:(MBOverlayViewController *)overlayViewController highResImage:(MBImage *)highResImage state:(MBRecognizerResultState)state {
    self.highResImage = highResImage;
    if (state == MBRecognizerResultStateUncertain) {
        [overlayViewController.recognizerRunnerViewController pauseScanning];
        // recognizers within self.recognizerCollection now have their results filled

        NSDictionary *resultDocumentCapture;

        for (NSUInteger i = 0; i < self.recognizerCollection.recognizerList.count; ++i) {
            if ([[self.recognizerCollection.recognizerList objectAtIndex:i] isKindOfClass:[MBDocumentCaptureRecognizer class]]) {
                MBDocumentCaptureRecognizer *recognizer = (MBDocumentCaptureRecognizer *)[self.recognizerCollection.recognizerList objectAtIndex:i];
                resultDocumentCapture = @{RESULT_DOCUMENT_CAPTURE_RECOGNIZER_RESULT: [recognizer serializeResult], RESULT_CAPTURED_FULL_IMAGE: [MBSerializationUtils encodeMBImage:self.highResImage]};
            }
        }

        self.promiseResolve(resultDocumentCapture);

        // dismiss recognizer runner view controller
        dispatch_async(dispatch_get_main_queue(), ^{
            UIViewController *rootViewController = [[[UIApplication sharedApplication] keyWindow] rootViewController];
            [rootViewController dismissViewControllerAnimated:YES completion:nil];
            self.recognizerCollection = nil;
            self.scanningViewController = nil;
            self.promiseResolve = nil;
            self.promiseReject = nil;
            self.highResImage = nil;
        });
    }
}
- (void)overlayViewControllerDidFinishScanning:(MBOverlayViewController *)overlayViewController didFinishScanningWithElements:(NSArray<MBScanElement *> *)scanElements {
    
    [overlayViewController.recognizerRunnerViewController pauseScanning];
    NSMutableDictionary *dictResult = [[NSMutableDictionary alloc] init];
    NSMutableArray *jsonResults = [[NSMutableArray alloc] init];
    
    for (MBScanElement *element in scanElements) {
        if (element.scanned) {
            [dictResult setObject:element.identifier forKey:@"identifier"];
            [dictResult setObject:element.value forKey:@"value"];
            [jsonResults addObject:dictResult];
        }
    }
    
    self.promiseResolve(jsonResults);
    
    // dismiss recognizer runner view controller
    dispatch_async(dispatch_get_main_queue(), ^{
        UIViewController *rootViewController = [[[UIApplication sharedApplication] keyWindow] rootViewController];
        [rootViewController dismissViewControllerAnimated:YES completion:nil];
        self.recognizerCollection = nil;
        self.scanningViewController = nil;
        self.promiseResolve = nil;
        self.promiseReject = nil;
        self.highResImage = nil;
    });
}

@end