#! /usr/bin/env bash

which airgeddon
if [ "$?" -ne 0 ]; then
	echo "Airgeddon is not installed"
	exit
fi

# run airgeddon
sudo airgeddon
