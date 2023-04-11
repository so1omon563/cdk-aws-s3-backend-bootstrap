# S3 Backend Bootstrap using CDKTF

Welcome to my CDKTF learning process. This repository is an EXTREME work in progress, and is intended to be a learning tool for myself and others.

I am not a developer, so there are probably(certainly) a lot of things that could be done better.

This code will bootstrap a remote backend for Terraform state management. It creates an S3 bucket and DynamoDB table for locking purposes in the `us-east-1` region.

Since this is a bootstrap of the remote backend, it has to create local state files. This is the limitation of using this code to create the remote backend. It is suggested that you back up the local state files, if you wish to use them in the future.

## Current limitations

- Currently creates the bucket and table with default names and tags that are hardcoded in the `main.ts`. They are not configurable at this time. The bucket name and table name will always be `cdktf-tfstate-us-east-1-<AWS_ACCOUNT_ID>`.

## Usage

Prior to working with this code, you will need to initialize your environment. This will install the required dependencies

```shell
npm run upgrade
npm run get
```

You will then be able to use the `cdktf` commands to deploy, destroy, or diff your code.

## Technical Requirements

This assumes you have appropriate versions of Terraform and CDKTF installed.

It is suggested that you ensure that you have your `awscli` environment set up, and that you use `aws-runas` to assist with AWS permissions.:

- [awscli](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)
- [aws-runas](https://mmmorris1975.github.io/aws-runas/)

### AWS authentication

It is HIGHLY suggested that you use the `aws-runas` utility to facilitate handling your AWS credentials.

If you wish to pass in your credentials to your CDKTF commands (without having to manually export them), you can do so by running the following command (assuming you have `aws-runas` installed locally):

```shell
    aws-runas -E <profile_name> cdktf deploy|destroy|diff|synth|plan
```

Another useful option is to use the [EC2 metatdata server](https://mmmorris1975.github.io/aws-runas/metadata_credentials.html) built in to `aws-runas`.

An example of using the metadata server using .zshrc aliases can be found [here](https://gist.github.com/so1omon563/4318631a1a903b3839f353df776f7d13).
