#!/bin/bash
cd /home/kavia/workspace/code-generation/syncstream-38656-87e03e06/syncstream_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

