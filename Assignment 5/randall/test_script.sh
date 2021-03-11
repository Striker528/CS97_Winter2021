#!/bin/bash

testLength=$(./randall 5 | wc -c); if [ $testLength -eq 5 ]; then echo "success"; else echo "fail"; fi
#bash is nasty with spaces
#no $ is needed at the beginning testLength