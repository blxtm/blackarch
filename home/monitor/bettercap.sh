#! /usr/bin/env bash

which bettercap
if [ "$?" -ne 0 ]; then
	echo "Bettercap is not installed"
	exit 1
fi

# run bettercap
sudo bettercap
