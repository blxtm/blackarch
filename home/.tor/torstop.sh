#!/usr/bin/env bash
read -s -p "Enter password for sudo: " pswd

echo "Stopping tor service ..."
echo "$(echo ${pswd} | sudo -S systemctl stop tor.service)"
