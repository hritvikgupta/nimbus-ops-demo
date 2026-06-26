# nimbus-ops-demo

A tiny Node service + background worker, deployed to EC2 and shipping logs to CloudWatch.
It contains an **intentional bug** in `computeStats()` (assumes `job.payload.values` always
exists) so the Nimbus ops agent can find the error in CloudWatch, trace it to the code, and
open a fix PR.
