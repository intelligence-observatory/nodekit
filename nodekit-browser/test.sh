#!/bin/bash


# This shell script builds nodekit, tests it, and then removes dist/
# It solves a problem that can't be handled from a chain && of && commands in package.json:
# If `npx playwright test` fails, the subsequent command to remove dist/ won't be called.
# This script is essentially a try-finally expression to ensure that dist/ is always removed.

# Try to build nodekit:
npm run build

# Only test if nodekit was built:
if [ $? -eq 0 ]; then
  # Test local html files without exposing their absolute file paths:
  NODEKIT_INDEX_HTML=$(pwd)/tests/index.html npx playwright test
fi

# Always cleanup:
rm -r dist/
