/* tslint:disable */
/* eslint-disable */
/**
 * My API
 * API Documentation
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface ErrorResponse403
 */
export interface ErrorResponse403 {
    /**
     * 
     * @type {number}
     * @memberof ErrorResponse403
     */
    code?: number;
    /**
     * 
     * @type {string}
     * @memberof ErrorResponse403
     */
    message?: string;
}

/**
 * Check if a given object implements the ErrorResponse403 interface.
 */
export function instanceOfErrorResponse403(value: object): value is ErrorResponse403 {
    return true;
}

export function ErrorResponse403FromJSON(json: any): ErrorResponse403 {
    return ErrorResponse403FromJSONTyped(json, false);
}

export function ErrorResponse403FromJSONTyped(json: any, ignoreDiscriminator: boolean): ErrorResponse403 {
    if (json == null) {
        return json;
    }
    return {
        
        'code': json['code'] == null ? undefined : json['code'],
        'message': json['message'] == null ? undefined : json['message'],
    };
}

export function ErrorResponse403ToJSON(value?: ErrorResponse403 | null): any {
    if (value == null) {
        return value;
    }
    return {
        
        'code': value['code'],
        'message': value['message'],
    };
}

