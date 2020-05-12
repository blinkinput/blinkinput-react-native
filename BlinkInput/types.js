/**
 * Represents a date extracted from image.
 */
export class Date {
    constructor(nativeDate) {
        /** day in month */
        this.day = nativeDate.day;
        /** month in year */
        this.month = nativeDate.month;
        /** year */
        this.year = nativeDate.year;
    }    
}

/**
 * Represents a point in image
 */
export class Point {
    constructor(nativePoint) {
        /** x coordinate of the point */
        this.x = nativePoint.x;
        /** y coordinate of the point */
        this.y = nativePoint.y;
    }
}

/**
 * Represents a quadrilateral location in the image
 */
export class Quadrilateral {
    constructor(nativeQuad) {
        /** upper left point of the quadrilateral */
        this.upperLeft = new Point(nativeQuad.upperLeft);
        /** upper right point of the quadrilateral */
        this.upperRight = new Point(nativeQuad.upperRight);
        /** lower left point of the quadrilateral */
        this.lowerLeft = new Point(nativeQuad.lowerLeft);
        /** lower right point of the quadrilateral */
        this.lowerRight = new Point(nativeQuad.lowerRight);
    }
}

/**
 * Represents base ocr options
 */
export class BaseOcrEngineOptions {
    constructor(nativeOcrEngineOptions) {
        /** maximal chars expected on the image. */
        this.maxCharsExpected = nativeOcrEngineOptions.maxCharsExpected;
        /** specifies if the additional image processing which drops the background colors should be performed. */
        this.colorDropoutEnabled = nativeOcrEngineOptions.colorDropoutEnabled;
    }
}

/**
 * Extension factors relative to corresponding dimension of the full image. For example,
 * upFactor and downFactor define extensions relative to image height, e.g.
 * when upFactor is 0.5, upper image boundary will be extended for half of image's full
 * height.
 */
export class ImageExtensionFactors {
    constructor() {
        /** image extension factor relative to full image height in UP direction. */
        this.upFactor = 0.0;
        /** image extension factor relative to full image height in RIGHT direction. */
        this.rightFactor = 0.0;
        /** image extension factor relative to full image height in DOWN direction. */
        this.downFactor = 0.0;
        /** image extension factor relative to full image height in LEFT direction. */
        this.leftFactor = 0.0;
    }
};
/**
 * Represents the type of scanned barcode
 */
export const BarcodeType = Object.freeze(
    {
        /** No barcode was scanned */
        None: 1,
        /** QR code was scanned */
        QRCode: 2,
        /** Data Matrix 2D barcode was scanned */
        DataMatrix: 3,
        /** UPC E barcode was scanned */
        UPCE: 4,
        /** UPC A barcode was scanned */
        UPCA: 5,
        /** EAN 8 barcode was scanned */
        EAN8: 6,
        /** EAN 13 barcode was scanned */
        EAN13: 7,
        /** Code 128 barcode was scanned */
        Code128: 8,
        /** Code 39 barcode was scanned */
        Code39: 9,
        /** ITF barcode was scanned */
        ITF: 10,
        /** Aztec 2D barcode was scanned */
        Aztec: 11,
        /** PDF417 2D barcode was scanned */
        PDF417: 12
    }
);

/**
 * Represents data extracted from the Driver's license.
 */
export class DriverLicenseDetailedInfo {
    constructor(nativeDriverLicenseDetailedInfo) {
        /**  Restrictions to driving privileges for the driver license owner. */
        this.restrictions = nativeDriverLicenseDetailedInfo.restrictions;
        /** Additional privileges granted to the driver license owner. */
        this.endorsements = nativeDriverLicenseDetailedInfo.endorsements;
        /** The type of vehicle the driver license owner has privilege to drive. */
        this.vehicleClass = nativeDriverLicenseDetailedInfo.vehicleClass;
    }
}

/** Result of the data matching algorithm for scanned parts/sides of the document. */
export const DataMatchResult = Object.freeze(
    {
        /** Data matching has not been performed. */
        NotPerformed : 1,
        /** Data does not match. */
        Failed : 2,
        /** Data match. */
        Success : 3
    }
);
