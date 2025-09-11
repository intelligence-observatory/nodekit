#!/bin/bash

# Build nodekit, test it, and remove dist/
# This is a bash script, rather than a chain && of && commands in package.json, because
# we always want to remove dist/
# In package.json, a sequence of commands ends as soon as one of them errors.
# If playwright tests return errors, then the last command (`rm -r dist/`) won't execute.
# Here, we are essentially doing a try-finally.

# Try to build nodekit:
npm run build
# Only test if nodekit was built:
if [ $? -eq 0 ]; then
  # Test local html files without exposing their absolute file paths:
  NODEKIT_INDEX_HTML=$(pwd)/index.html npx playwright test
fi
# Always cleanup:
rm -r dist/
