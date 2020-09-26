#!/usr/bin/env bash
read -s -p "Enter password for sudo: " pswd

echo "Starting tor service ..."
echo "$(echo ${pswd} | sudo -S systemctl start tor.service)"
