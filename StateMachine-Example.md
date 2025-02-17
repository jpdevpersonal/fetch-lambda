### **Real-World Example: Data Processing Pipeline with AWS Step Functions, Lambda, and S3**
This example demonstrates an **AWS Step Functions workflow** that:
1. **Extracts raw data** from an S3 bucket.
2. **Processes the data** using an AWS Lambda function.
3. **Stores the processed data** back into another S3 bucket.
4. **Handles errors and retries** automatically.

---

## **Architecture Overview**
1. **S3 (Input Bucket)** → Stores raw data.
2. **Step Functions (State Machine)** → Orchestrates the workflow.
3. **Lambda (Processing Function)** → Reads, processes, and writes data.
4. **S3 (Output Bucket)** → Stores processed data.

---

## **Step Functions State Machine (JSON)**
This state machine:
- **Starts by invoking a Lambda function** to process data.
- **Handles success** and stores results in S3.
- **Retries the function** in case of failure.

```json
{
  "Comment": "Data Processing Pipeline with AWS Step Functions, Lambda, and S3",
  "StartAt": "ExtractData",
  "States": {
    "ExtractData": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:us-east-1:123456789012:function:ExtractLambda",
      "Next": "ProcessData",
      "Retry": [
        {
          "ErrorEquals": ["Lambda.ServiceException", "Lambda.AWSLambdaException"],
          "IntervalSeconds": 2,
          "MaxAttempts": 3,
          "BackoffRate": 2.0
        }
      ]
    },
    "ProcessData": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:us-east-1:123456789012:function:ProcessLambda",
      "Next": "StoreData"
    },
    "StoreData": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:us-east-1:123456789012:function:StoreLambda",
      "End": true
    }
  }
}
```

---

## **Lambda Function Code (TypeScript)**
### **1. Extract Data from S3 (ExtractLambda)**
Reads raw data from an S3 bucket.

```typescript
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { S3Event } from "aws-lambda";
import { Readable } from "stream";

const s3 = new S3Client({ region: "us-east-1" });

export const handler = async (event: S3Event) => {
  try {
    const bucketName = event.Records[0].s3.bucket.name;
    const objectKey = event.Records[0].s3.object.key;

    const params = { Bucket: bucketName, Key: objectKey };
    const { Body } = await s3.send(new GetObjectCommand(params));

    // Convert stream to string
    const streamToString = (stream: Readable): Promise<string> =>
      new Promise((resolve, reject) => {
        const chunks: Uint8Array[] = [];
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
        stream.on("error", reject);
      });

    const fileContent = await streamToString(Body as Readable);
    return { data: fileContent, key: objectKey };
  } catch (error) {
    console.error("Error extracting data:", error);
    throw error;
  }
};
```

---

### **2. Process Data (ProcessLambda)**
Performs transformations on the extracted data.

```typescript
export const handler = async (event: { data: string; key: string }) => {
  try {
    const processedData = event.data.toUpperCase(); // Example transformation
    return { processedData, key: event.key };
  } catch (error) {
    console.error("Error processing data:", error);
    throw error;
  }
};
```

---

### **3. Store Processed Data in S3 (StoreLambda)**
Writes the processed data back to another S3 bucket.

```typescript
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({ region: "us-east-1" });

export const handler = async (event: { processedData: string; key: string }) => {
  try {
    const outputBucket = "my-processed-data-bucket";
    const outputKey = `processed/${event.key}`;

    await s3.send(
      new PutObjectCommand({
        Bucket: outputBucket,
        Key: outputKey,
        Body: event.processedData,
        ContentType: "text/plain"
      })
    );

    console.log(`Processed data stored in S3: s3://${outputBucket}/${outputKey}`);
    return { success: true };
  } catch (error) {
    console.error("Error storing data:", error);
    throw error;
  }
};
```

---

## **Deploying the State Machine via AWS CLI**
Save the state machine JSON as `state-machine.json` and run:

```sh
aws stepfunctions create-state-machine \
  --name DataProcessingStateMachine \
  --role-arn arn:aws:iam::123456789012:role/StepFunctionsRole \
  --definition file://state-machine.json
```

---

## **Triggering the Workflow**
1. **Upload a new file to S3 (Raw Data Bucket)**.
2. **S3 Event Triggers Step Functions**.
3. **Step Functions Calls Lambda Functions** to process the data.
4. **Processed Data is stored in S3 (Output Bucket)**.

---

## **Monitoring Execution**
Check the **AWS Step Functions Console** to:
- **View execution history**.
- **Track failures and retries**.
- **Analyze logs** via **CloudWatch**.

---

## **Final Thoughts**
✅ **Best Practices**
- Use **AWS Glue Crawlers** to catalog processed data.
- Use **Parquet format** for optimized queries with Athena.
- Implement **IAM policies** to restrict S3 & Lambda permissions.
- Use **DLQ (Dead Letter Queue)** for error handling.

🚀 **Would you like an example of integrating this workflow with AWS EventBridge for automation?**