#!/bin/sh

cmd=`expr match "$0" '.*cmd_\(.*\).sh'`
curl -s http://localhost:8076/${cmd} > /dev/null
