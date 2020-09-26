#! /usr/bin/env bash

read -p "Enter interface: " interface

if [ -z "$interface" ]; then
	echo "No interface provided, using any"
	interface=any
fi

which netsniff-ng
if [ "$?" -ne 0 ]; then
	echo "Netsniff is not installed"
	exit 1
fi

# set up netsniff-ng
sudo netsniff-ng --in "${interface}"
