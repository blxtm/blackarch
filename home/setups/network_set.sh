#! /usr/bin/env bash

read -s -p "Enter password for sudo: " pwd

interface0="wlp0s20f3"
#profile0="twn"

# stop interface
echo
echo "Stopping ${interface0} interface ..."
echo "$(echo ${pwd} | sudo -S ip link set ${interface0} down)"
sleep 5

# set up random mac address
echo
echo "Setting up random MAC address ... "
echo "$(echo ${pwd} | sudo -S macchanger -r ${interface0})"

# set up netctl profile 
#echo
#echo "Starting ${profile0} profile ... "
#echo "$(echo ${pwd} | sudo -S netctl start ${profile0})"
#sleep 4

# start interface
echo
echo "Starting interface ${interface0} after finishing settings ... "
echo "$(echo ${pwd} | sudo -S ip link set ${interface0} up)"
sleep 4

echo "Networking setup finished"
