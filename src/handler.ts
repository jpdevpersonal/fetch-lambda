import { SNSEvent } from "aws-lambda";
// If you haven't installed v3 yet, run: npm install @aws-sdk/client-sqs
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

// Initialize the SQS client (Optionally, specify region or credentials here)
const sqsClient = new SQSClient({ region: "eu-west-2" }); 

// Replace with your actual Queue URL
// (You can find it in the AWS SQS Console under "Queue Actions" > "View Queue URL")
const QUEUE_URL = "https://sqs.eu-west-2.amazonaws.com/535002890543/RealWorlddemoQueue";

export const handler = async (event: SNSEvent): Promise<void> => {
  for (const record of event.Records) {
    // Construct the message you want to send to SQS
    const logMessage = JSON.stringify({
      EventVersion: record.EventVersion,
      EventSubscriptionArn: record.EventSubscriptionArn,
      EventSource: record.EventSource,
      Sns: record.Sns,
    });

    // Prepare the SQS message parameters
    const params = {
      QueueUrl: QUEUE_URL,
      MessageBody: logMessage,
    };

    try {
      // Send the message to SQS
      const result = await sqsClient.send(new SendMessageCommand(params));
      console.log("Message sent to SQS:", result.MessageId);
    } catch (error) {
      console.error("Error sending message to SQS:", error);
      throw error; // Optionally rethrow if you want the Lambda to fail
    }
  }
};
