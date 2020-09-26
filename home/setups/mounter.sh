#! /usr/bin/env bash

echo "Enter block to mount: "
read p
block="/dev/${p}"

echo "Enter filesystem: "
read fspath
fs="/ext"


# check if provided folder name exists - if it does not - create it before use
if [ ! -d "$fs/$fspath" ]; then
	echo
	echo "${fspath} does not exist. Do you want to create it? [Yes/No]"
	read cr
	
	case $cr in
		Yes )
			echo "Creating ..."
			echo "$(mkdir ${fs}/${fspath})"
			
			read -s -p "Enter password for $USER: " pwd
			
			echo "${fs}/${fspath} has been created"
			;;
		No )
			echo "Exiting..."
			exit 0
	esac
fi

echo

if [ -z "$pwd" ]; then
	read -s -p "Enter password for $USER: " pwd
fi

echo "Mounting ${block} on ${fs}/${fspath} ..."
res=$?
echo "$(echo ${pwd} | sudo mount ${block} ${fs}/${fspath})"
if [ $res -ne 0 ]; then
	echo $res
	exit 1
fi

echo "$block has been mounted on ${fs}/${fspath}"

echo
echo "Setting up permissions"
echo $(sudo chown $USER:$USER -R ${fs}/${fspath})

exit 0

