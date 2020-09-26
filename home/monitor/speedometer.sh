#! /usr/bin/env bash

read -p "Enter interface: " interface

if [ -z "$interface" ]; then
	echo "No interface provided, using default"
	interface="wlan0"
fi

which speedometer
if [ "$?" -ne 0 ]; then
	echo "Speedometer is not installed"
	exit 1
fi

speedometer -r ${interface}
