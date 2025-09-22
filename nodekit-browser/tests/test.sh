#!/bin/bash

rm -r test-results/

npm run build

if [ $? -eq 0 ]; then
  # Run the tests:
  npx playwright test
  # Always clean up test results:
  rm -rf test-results/
fi