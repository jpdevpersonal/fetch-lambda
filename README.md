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
```json
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
```

# Key Fields

| **Field**                  | **Description**                                                                                                                                             |
|----------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `Records`                  | An array of records—each record corresponds to a single SNS message event.                                                                                  |
| `EventSource`              | Typically `"aws:sns"`, indicating SNS is the source.                                                                                                        |
| `EventSubscriptionArn`     | The ARN of the subscription.                                                                                                                                |
| `Sns`                      | Details about the SNS message:                                                                                                                              |
| &emsp;`MessageId`          | A unique identifier for the SNS message.                                                                                                                    |
| &emsp;`Message`            | The actual content of the message.                                                                                                                          |
| &emsp;`MessageAttributes`  | Any custom attributes sent alongside the message.                                                                                                           |
| &emsp;`TopicArn`           | The ARN of the SNS topic.                                                                                                                                   |
| &emsp;`Subject`            | *(Optional)* Subject of the notification.                                                                                                                   |
| &emsp;`Timestamp`          | Time the message was published.                                                                                                                             |
| &emsp;`UnsubscribeUrl`     | URL to unsubscribe from this particular subscription.                                                                                                       |
| `Signature`, `SignatureVersion`, `SigningCertUrl` | Used for message authenticity verification (usually handled by SNS/Lambda internally).                                               |
| **Lambda Handling**        | Your Lambda (with a handler signature like `handler(event: SNSEvent)`) will receive this payload under the `event` parameter.                               |


# Packaging and Deploying with AWS CLI

### Step 1: Package Your Lambda Code

Assuming your compiled JavaScript code (e.g., `index.js`) is in your current directory, create a zip file containing the file (and any dependencies if necessary):

```bash
zip -r hello-world.zip index.js
```

> **Tip:** If your Lambda depends on additional files or the `node_modules` folder, include them in the zip. For example:
> ```bash
> zip -r hello-world.zip index.js node_modules
> ```

### Step 2: Upload the Zip Package to Your S3 Bucket

Use the AWS CLI to copy your deployment package to your S3 bucket (`jp-lambda-tests`):

```bash
aws s3 cp hello-world.zip s3://jp-lambda-tests/hello-world.zip
```

This command uploads the local `hello-world.zip` file to the specified bucket so that CloudFormation can reference it when deploying the Lambda function.

### Step 3: Deploy the CloudFormation Stack

Now, deploy the CloudFormation stack with your template. Use the following command:

```bash
aws cloudformation deploy \
  --template-file lambda-template.yaml \
  --stack-name hello-world-stack \
  --capabilities CAPABILITY_NAMED_IAM
```

#### Explanation of the Command:

- **`aws cloudformation deploy`**  
  This command instructs AWS CLI to deploy a CloudFormation stack based on your template.
- **`--template-file lambda-template.yaml`**  
  Specifies the file that contains your CloudFormation YAML template.
- **`--stack-name hello-world-stack`**  
  Sets the name for your CloudFormation stack. You can choose any unique name.
- **`--capabilities CAPABILITY_NAMED_IAM`**  
  This flag is required because your template creates IAM resources (the Lambda execution role). It grants CloudFormation permission to create roles with custom names.

### Step 4: Verify Your Deployment

After the deployment command finishes, verify that your Lambda function has been created. You can check in the AWS Management Console under Lambda or use the CLI:

```bash
aws lambda get-function --function-name HelloWorldFunction
```

This command returns details about your deployed Lambda function, such as its configuration and runtime information.

---

## Recap

1. **CloudFormation Template:**  
   You created a YAML file that defines two resources—a Lambda execution role and a Lambda function. Each property in the template was explained in detail.

2. **Packaging:**  
   You zipped your compiled JavaScript code to create a deployment package.

3. **Uploading:**  
   The zip file was uploaded to your existing S3 bucket so CloudFormation could access it.

4. **Deployment:**  
   You used the AWS CLI command `aws cloudformation deploy` with the proper parameters to create the resources as defined in the template.

5. **Verification:**  
   Finally, you verified that your Lambda function was deployed successfully using either the AWS Console or the AWS CLI.

This complete walkthrough should give you a clear understanding of both how to write a CloudFormation YAML template for a Lambda function and the exact commands required to deploy it. If you have any further questions or need additional details, feel free to ask!
