#!/bin/bash
set -euo pipefail

mkdir -p ../pottery-cli/scripts/modules

terraform -chdir=../terraform output -raw elb_public_dns \
  | awk '{print "const ELB_PUBLIC_DNS = \"http://" $0 "\"; export default ELB_PUBLIC_DNS;"}' \
  > ../pottery-cli/scripts/modules/config.js

echo "✅ Config file written to ../pottery-cli/scripts/modules/config.js"
