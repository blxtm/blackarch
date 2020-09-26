#! /usr/bin/env bash

echo "Enter filesystem to unmount: "
read fspath

fs="/ext"

# chec if provided fs exists
if [ ! -d "$fs/$fspath" ]; then
	echo
	echo "${fs}/${fspath} does not exist"
	exit 1
fi

#read -s -p "Enter password for sudo: " pwd


echo
echo "Unmounting ${fs}/${fspath} ..."

sudo umount  ${fs}/${fspath}
res=$?
if [ $res -ne 0 ]; then
	echo "ERROR: "
	echo $res
	exit 1
fi

echo "${fspath} has been unmounted. Do you want to delete it? [Yes/No]"
read del

case $del in
	Yes)
		echo "$(rm -rf /${fs}/${fspath})"
		echo "${fspath} has been deleted"
		;;
	No)
		echo "Exiting ..."
		;;	
esac

exit 0



