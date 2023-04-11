import { Construct } from "constructs";
import { App, TerraformStack, TerraformOutput } from "cdktf";
import { AwsProvider } from "@cdktf/provider-aws/lib/provider";
import { DataAwsCallerIdentity } from "@cdktf/provider-aws/lib/data-aws-caller-identity";
import { DataAwsRegion } from "@cdktf/provider-aws/lib/data-aws-region";
import { DynamodbTable } from "@cdktf/provider-aws/lib/dynamodb-table";
// Uses S3 module defined in cdktf.json
import { S3 } from "./.gen/modules/s3";

class ModuleStack extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new AwsProvider(this, "aws", {
      region: "us-east-1",
      defaultTags: [
        {
          tags: {
            state_bucket: "true",
            terraform: "true",
            cdk: "true",
          },
        },
      ],
    });

    const region = new DataAwsRegion(this, "region");
    const callerIdentity = new DataAwsCallerIdentity(this, "callerIdentity");

    const s3 = new S3(this, "bucket", {
      bucketNameOverride: `cdktf-tfstate-${region.id}-${callerIdentity.accountId}`,
    });

    new TerraformOutput(this, "bucketIdOutput", {
      value: s3.bucketIdOutput
    });

    new DynamodbTable(this, "dynamodb", {
      name: `cdktf-tfstate-${region.id}-${callerIdentity.accountId}`,
      hashKey: "LockID",
      attribute: [{ name: "LockID", type: "S" }],
      billingMode: "PAY_PER_REQUEST",
    });
  }
}

const app = new App();
new ModuleStack(app, "s3-backend");
app.synth();
