#!/bin/bash

# Try to build nodekit:
npm run build

# Only test if nodekit was built:
if [ $? -eq 0 ]; then
  # Copy dist/ into tests/ so that playwright's webserver can find them:
  cp dist/* tests/
  # Test local html files without exposing their absolute file paths:
  npx playwright test
fi

# Always cleanup:
rm tests/nodekit*
