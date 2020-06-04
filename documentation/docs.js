/**
 * @apiDefine ServerError
 *
 * @apiError ServerError 500 This error occurs when server rans into an unknown error.
 *
 * @apiErrorExample { json } Error-Response:
 * {
 *  "error": true,
 *  "message": "Server Error Occurred",
 *  "status": 500,
 *  "data": null
 * }
 */

/**
 * @apiDefine NotAllowed
 *
 * @apiError NotAllowed  This error occurs when you've
 * signed up but our team has yet not authorized your account.
 *
 * @apiErrorExample { json } Error-Response:
 * {
 *  "error": true,
 *  "message": "Please allow some time for our team to evaluate your application",
 *  "status": 403,
 *  "data": null
 * }
 */

/**
 * @api { post }  /api/v1/auth/signup Create your account
 * @apiVersion 1.0.0
 * @apiGroup Auth
 *
 * @apiParam { String } name as a body parameter.
 * @apiParam { Number } mobile as a body parameter, it has to be 10 digits
 * long and unique without country code.
 * @apiParam { String } email as a body parameter, it has to be an unique email.
 * @apiParam { String } password as a body parameter, it has to be atleast 6 characters long.
 *
 * @apiSuccessExample { json } Success-Response:
 * {
 *  "error": false,
 *  "message": "Registration successful,please check you registered email address for
 *  a confirmation and click on the confirmation link.",
 *  "status": 201,
 *  "data": {
 *            "_id": "String",
              "name": "String",
              "email": "String",
              "mobile": "String",
              "userType": "String",
              "createdAt": Number,
              "isBlocked": Boolean,
              "isVerified": Boolean,
              "isAgreed": Boolean
 *          }
 * }
 *
 * @apiError  AlreadyInUse  This error occurs when you try to
 * signup with already existing mobile number or email id.
 *
 * @apiErrorExample Error-Response:
 * {
 *  "error": true,
 *  "message": "Please use different email or mobile number",
 *  "status": 403,
 *  "data": null
 * }
 *
 * @apiUse  ServerError
 */

/**
 * @api { post }  /api/v1/auth/login  Login to your account or to
 * generate a token for your future actions.
 * @apiVersion 1.0.0
 * @apiGroup Auth
 *
 * @apiParam { String } email your registered email as a body parameter.
 * @apiParam { String } password  your chosen password as a body parameter.
 *
 * @apiSuccessExample Success-Response:
 * {
 *  "error": false,
 *  "message": "User logged-in successfully",
 *  "status": 201,
 *  "data": {
 *            "_id": "String",
              "email": "String",
              "userType": "String",
              "name": "String",
              "mobile": "String",
              "isBlocked": Boolean,
              "isVerified": Boolean,
              "isActive": Boolean,
              "token": "String",
              "tokenExpiry": Number
 *          }
 * }
 *
 * @apiError  NotVerified This error occurs when you haven't verified your email address.
 *
 * @apiErrorExample { json } Error-Response:
 * {
 *  "error": true,
 *  "message": "Please click on the link in your registered email and verify your account to login",
 *  "status": 403,
 *  "data": null
 * }
 *
 * @apiUse NotAllowed
 *
 * @apiUse ServerError
 *
 */

/**
 * @api { get } /api/v1/auth/logout Logout so that your token can expire and cannot be misused.
 * @apiVersion 1.0.0
 * @apiGroup Auth
 *
 * @apiParam  { String }  Token as an Authorization header in a Bearer token format.
 *
 * @apiSuccessExample { json } Success-Response:
 * {
 *  "error": false,
 *  "message": "You've logged out successfully",
 *  "status": 200,
 *  "data": null
 * }
 *
 * @apiUse ServerError
 */

/**
 * @api { get } /api/v1/com-type/getall Get all types of insurance complaints and their details
 * @apiVersion  1.0.0
 *
 * @apiGroup Complaint Types
 *
 * @apiParam  { String }  Token as an Authorization header in a Bearer token format.
 *
 * @apiSuccessExample { json } Success-Response:
 * {
 *  "error": false,
 *  "message": "All Complaint Types fetched successfully",
 *  "status": 200,
 *  "data": [
        {
            "_id": "String",
            "isActive": Boolean,
            "createdAt": Number,
            "updatedAt": Number,
            "name": "String",
            "policyTypeId": "String",
        }
      ]
 * }
 *
 * @apiUse  ServerError
 */

/**
  * @api { get } /api/v1/ins-comp/getall Get list of insurance companies and their details
  * @apiVersion  1.0.0
  *
  * @apiGroup Insurance Companies
  *
  * @apiParam  { String }  Token as an Authorization header in a Bearer token format.
  *
  * @apiSuccessExample { json } Success-Response:
  * {
  *  "error": false,
  *  "message": "All Insurance Companies fetched successfully",
  *  "status": 200,
  *  "data": [
        {
              "_id": "String",
              "name": "String",
              "isActive": "String",
              "updatedAt": "String",
              "createdAt": "String"
          }
        ]
  * }
  *
  * @apiUse  ServerError
  */

/**
  * @api { get } /api/v1/policy-type/getall Get list of types of policies and their details
  * @apiVersion  1.0.0
  *
  * @apiGroup Policy Types
  *
  * @apiParam  { String }  Token as an Authorization header in a Bearer token format.
  *
  * @apiSuccessExample { json } Success-Response:
  * {
  *  "error": false,
  *  "message": "All Policies fetched successfully",
  *  "status": 200,
  *  "data": [
        {
              "_id": "String",
              "isActive": Boolean,
              "createdAt": Number,
              "updatedAt": Number,
              "name": "String",
          },
        ]
  * }
  *
  * @apiUse  ServerError
  */

/**
  * @api { post } /api/v1/lead/new Create new Lead
  * @apiVersion  1.0.0
  *
  * @apiGroup Lead/Case
  *
  * @apiParam  { String }  Token as an Authorization header in a Bearer token format.
  * @apiParam { String }  name  Name of the policy holder as a body parameter.
  * @apiParam { String }  email  Email of the policy holder as a body parameter.
  * @apiParam { String }  phone  Phone number of the policy
  * holder as a body parameter (10 digits without country code).
  * @apiParam { String }  policyTypeId  Id of the policy type as a body parameter.
  * @apiParam { String }  complaintTypeId  Id of the complaint type as a body parameter.
  * @apiParam { String }  companyId  Id of the insurance company as a body parameter.
  *
  * @apiSuccessExample { json } Success-Response:
  * {
  *  "error": false,
  *  "message": "new lead added successfully",
  *  "status": 201,
  *  "data": {
              "_id": "String",
              "status": "String",
              "doc": Array,
              "name": "String",
              "phone": Number,
              "email": "String",
              "policyTypeId": "String",
              "complaintTypeId": "String",
              "companyId": "String",
              "leadId": "String",
              "userId": "String",
              "assign_date": "Date",
              "createdAt": Number,
              "updatedAt": Number,
              "communication": Array,
          }
  * }
  *
  * @apiUse  ServerError
  */

/**
 * @api { get } /api/v1/lead/get Get all leads by user
 * @apiVersion  1.0.0
 *
 * @apiGroup Lead/Case
 *
 * @apiParam  { String }  Token as an Authorization header in a Bearer token format.
 *
 * @apiSuccessExample { json } Success-Response:
 * {
 *  "error": false,
 *  "message": "All leads for the user fetched succcessfully",
 *  "status": 200,
 *  "data":  [
 *         {
            "_id": "String",
            "status": "String",
            "doc": Array,
            "name": "String",
            "phone": Number,
            "email": "String",
            "policyTypeId": "Object",
            "complaintTypeId": "Object",
            "companyId": "String",
            "leadId": "String",
            "userId": "Object",
            "assign_date": "Date",
            "createdAt": Number,
            "updatedAt": Number,
            "communication": Array,
          }
        ]
 * }
 *
 * @apiUse  ServerError
 */

/**
 * @api { get } /api/v1/lead/single/:leadId Get single leads by user
 * @apiVersion  1.0.0
 *
 * @apiGroup Lead/Case
 *
 * @apiParam  { String }  Token as an Authorization header in a Bearer token format.
 * @apiParam  { String }  leadId as a params parameter passed in the url.
 *
 * @apiSuccessExample { json } Success-Response:
 * {
 *  "error": false,
 *  "message": "Lead fetched successfully",
 *  "status": 200,
 *  "data": {
            "_id": "String",
            "status": "String",
            "doc": Array,
            "name": "String",
            "phone": Number,
            "email": "String",
            "policyTypeId": "Object",
            "complaintTypeId": "Object",
            "companyId": "String",
            "leadId": "String",
            "userId": "Object",
            "assign_date": "Date",
            "createdAt": Number,
            "updatedAt": Number,
            "communication": Array,
          }
 * }
 *
 * @apiUse  ServerError
 */

/**
* @api { get } /api/v1/lead/count Get the total number of leads by user
* @apiVersion  1.0.0
*
* @apiGroup Lead/Case
*
* @apiParam  { String }  Token as an Authorization header in a Bearer token format.
*
* @apiSuccessExample { json } Success-Response:
* {
*  "error": false,
*  "message": "Number of leads fetched successfully",
*  "status": 200,
*  "data": Number
* }
*
* @apiUse  ServerError
*/
