# Key Points
Import the SQS Client:

We use @aws-sdk/client-sqs from the AWS SDK for JavaScript v3.
If you haven’t installed it yet, run:

npm install @aws-sdk/client-sqs
Initialize the SQS Client:

You can optionally configure the region or credentials if needed. Otherwise, the client will use the defaults from the environment (e.g., AWS_REGION).
Queue URL:

In SQS, each queue has a Queue URL, which looks like:

https://sqs.<region>.amazonaws.com/<account-id>/<queue-name>
Make sure to replace QUEUE_URL with your actual queue’s URL (not just the name).
Send the Message:

We use SendMessageCommand to send the JSON stringified logMessage.
The result from sqsClient.send(...) includes metadata about the message send, e.g., MessageId.
Error Handling:

If sending fails, we log the error. We also throw it to indicate a failure in the Lambda. If you want the Lambda to silently ignore SQS errors, you can simply log and continue.
With this setup, each incoming SNS event record will result in a message being sent to your sqs.


# Example SNS JSON
Below is a basic example of what the SNS event JSON might look like when your Lambda function is triggered by an SNS topic. This is the structure passed to your Lambda handler in the event parameter (of type SNSEvent in @types/aws-lambda):
'''JSON
{
  "Records": [
    {
      "EventVersion": "1.0",
      "EventSubscriptionArn": "arn:aws:sns:us-east-1:123456789012:ExampleTopic:abcdef01-2345-6789-abcd-ef0123456789",
      "EventSource": "aws:sns",
      "Sns": {
        "SignatureVersion": "1",
        "Timestamp": "2025-01-01T12:45:07.000Z",
        "Signature": "EXAMPLElDMWd...EXAMPLE=",
        "SigningCertUrl": "https://sns.us-east-1.amazonaws.com/SimpleNotificationService-0000000000000000000000.pem",
        "MessageId": "95df01b4-ee98-5cb9-9903-4c221d41eb5e",
        "Message": "Hello from SNS!",
        "MessageAttributes": {
          "TestAttribute": {
            "Type": "String",
            "Value": "TestValue"
          },
          "TestNumber": {
            "Type": "Number",
            "Value": "1234"
          }
        },
        "Type": "Notification",
        "UnsubscribeUrl": "https://sns.us-east-1.amazonaws.com/?Action=Unsubscribe&...",
        "TopicArn": "arn:aws:sns:us-east-1:123456789012:ExampleTopic",
        "Subject": "Test SNS Subject"
      }
    }
  ]
}
'''

# Key Fields
Records: An array of records—each record corresponds to a single SNS message event.
EventSource: Typically "aws:sns" indicating SNS is the source.
EventSubscriptionArn: The ARN of the subscription.
Sns: Details about the SNS message:
MessageId: A unique identifier for the SNS message.
Message: The actual content of the message.
MessageAttributes: Any custom attributes sent alongside the message.
TopicArn: The ARN of the SNS topic.
Subject: (Optional) Subject of the notification.
Timestamp: Time the message was published.
UnsubscribeUrl: URL to unsubscribe this particular subscription.
Signature, SignatureVersion, and SigningCertUrl are used for message authenticity verification (usually handled by SNS/Lambda internally).
Your Lambda (with a handler signature like handler(event: SNSEvent)) will receive this payload under the event parameter.
