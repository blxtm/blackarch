#! /usr/bin/env bash
read -p "Enter port or ip: " access
if [ -z "$access" ]; then
	echo "Port/Address not provided, using default"
	access=80
fi

which issniff
if [ "$?" -ne 0 ]; then
	echo "Issniff is not installed"
	exit 1
fi

# set up is sniff
sudo issniff $access
