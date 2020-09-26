#! /usr/bin/env bash
read -p "Enter interface: " interface

if [ -z "$interface" ]; then
	echo "No interface provided, using default"
	interface="wlp0s20f3"
fi

which tcpdump
if [ "$?" -ne 0 ]; then
	echo "TCPDump is not installed"
	exit 1
fi

sudo tcpdump -i ${interface}

