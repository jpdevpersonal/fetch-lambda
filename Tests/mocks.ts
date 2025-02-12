import { APIGatewayProxyEvent, Context } from "aws-lambda";

/**
 * Mock API Gateway Event
 */
export const mockAPIGatewayEvent: APIGatewayProxyEvent = {
    body: null,
    headers: {},
    multiValueHeaders: {},
    httpMethod: "GET",
    isBase64Encoded: false,
    path: "/hello",
    pathParameters: null,
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    stageVariables: null,
    requestContext: {
        accountId: "123456789012",
        apiId: "testApiId",
        authorizer: null,
        protocol: "HTTP/1.1",
        httpMethod: "GET",
        identity: {
            accessKey: null,
            accountId: null,
            apiKey: null,
            apiKeyId: null,
            caller: null,
            clientCert: null,
            cognitoAuthenticationProvider: null,
            cognitoAuthenticationType: null,
            cognitoIdentityId: null,
            cognitoIdentityPoolId: null,
            principalOrgId: null,
            sourceIp: "127.0.0.1",
            user: null,
            userAgent: "jest-test-client",
            userArn: null,
        },
        path: "/hello",
        stage: "test",
        requestId: "test-request-id",
        requestTime: "12/Feb/2025:19:12:42 +0000",
        requestTimeEpoch: 1676212363000,
        resourceId: "test-resource-id",
        resourcePath: "/hello",
    },
    resource: "/hello",
};

/**
 * Mock Lambda Context
 */
export const mockContext: Context = {
    callbackWaitsForEmptyEventLoop: false,
    functionName: "testFunction",
    functionVersion: "$LATEST",
    invokedFunctionArn: "arn:aws:lambda:us-east-1:123456789012:function:testFunction",
    memoryLimitInMB: "128",
    awsRequestId: "test-request-id",
    logGroupName: "/aws/lambda/testFunction",
    logStreamName: "testLogStream",
    getRemainingTimeInMillis: () => 1000,
    done: jest.fn(),
    fail: jest.fn(),
    succeed: jest.fn(),
};
