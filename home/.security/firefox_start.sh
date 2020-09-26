#!/usr/bin/env bash

function startTorService() {
	read -s -p "Enter password for sudo: " pswd
	
	echo "Starting tor service ..."
	echo "$(echo ${pswd} | sudo -S systemctl start tor.service)"

	# check if tor service is running properly aftert the start and exit if not
	systemctl is-active --quiet tor.service && echo "tor service started" || exit 1	
}

function startFirefoxPrx() {
	# check if tor service is running
	systemctl is-active --quiet tor.service && echo "tor service running, starting firefox with proxychains" || startTorService

	# stop all running instances of firefox - it is set to reopen all tabs 
	killall firefox
	eval $(proxychains firefox --new-tab --detach www.duckduckgo.com)
}

startFirefoxPrx
