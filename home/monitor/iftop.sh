#! /usr/bin/env bash
read -p "Enter interface: " interface

if [ -z "$interface" ]; then
	echo "No interface provided, using default"
	interface="wlp0s20f3"
fi

#read -s -p "Enter password for sudo: " pwd

# start iftop
which iftop
if [ "$?" -ne 0 ]; then
	echo "Iftop is not installed"
	exit 1
fi

sudo iftop -i ${interface}
