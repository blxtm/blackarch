#!/usr/bin/env bash

#set -o noclobber -o noglob -o nounset -o pipefail
#IFS=$'\n'

## If the option `use_preview_script` is set to `true`,
## then this script will be called and its output will be displayed in ranger.
## ANSI color codes are supported.
## STDIN is disabled, so interactive scripts won't work properly

## This script is considered a configuration file and must be updated manually.
## It will be left untouched if you upgrade ranger.

## Because of some automated testing we do on the script #'s for comments need
## to be doubled up. Code that is commented out, because it's an alternative for
## example, gets only one #.

## Meanings of exit codes:
## code | meaning    | action of ranger
## -----+------------+-------------------------------------------
## 0    | success    | Display stdout as preview
## 1    | no preview | Display no preview at all
## 2    | plain text | Display the plain content of the file
## 3    | fix width  | Don't reload when width changes
## 4    | fix height | Don't reload when height changes
## 5    | fix both   | Don't ever reload
## 6    | image      | Display the image `$IMAGE_CACHE_PATH` points to as an image preview
## 7    | image      | Display the file directly as an image

## Script arguments
FILE_PATH="$1"         # Full path of the highlighted file
PV_WIDTH="$2"          # Width of the preview pane (number of fitting characters)
## shellcheck disable=SC2034 # PV_HEIGHT is provided for convenience and unused
PV_HEIGHT="$3"         # Height of the preview pane (number of fitting characters)
IMAGE_CACHE_PATH="$4"  # Full path that should be used to cache image preview
PV_IMAGE="$5"  # 'True' if image previews are enabled, 'False' otherwise.

# Stop after $maxln lines
maxln=500

highlight_format=ansi

mimetype=$(file --mime-type -Lb "${FILE_PATH}")
extension=$(/bin/echo "${FILE_PATH##*.}" | awk '{print tolower($0)}')

# run a command and saves its output into $output 
# useful if we need to return value AND want to use the output on a pipe
try() { output=$(eval '"$@"'); }

# writes the output of the previously used "try" command
dump() { /bin/echo "$output"; }

# a common post-processing function used after most commands
trim() { head -n "$maxln"; }

# wraps highlight to treat exit code 141 (killed by SIGPIPE) as success
safepipe() { "$@"; test $? = 0 -o $? = 141; }

# Image previews - if enabled in ranger
if [ "$PV_IMAGE" = "True" ]; then
	case "$mimetype" in
		image/svg+xml)
			convert "$FILE_PATH" "$IMAGE_CACHE_PATH" && exit 6 || exit 1;;
		image/*)
			exit 7;;
	esac
fi

case "$extension" in

	sh|bashrc|go|rs|c|cpp|txt|html|yaml|yml|js|py)
		try vim -p l "$FILE_PATH" && { dump | trim; exit 5; }
		
        ## Archive
        a|ace|alz|arc|arj|bz|bz2|cab|cpio|deb|gz|jar|lha|lz|lzh|lzma|lzo|\
        rpm|rz|t7z|tar|tbz|tbz2|tgz|tlz|txz|tZ|tzo|war|xpi|xz|Z|zip)
		try als "$FILE_PATH" && { dump | trim; exit 0; }
		try acat "$FILE_PATH" && { dump | trim; exit 3; }
		try bsdtar -lf "$FILE_PATH" && { dump | trim; exit 0; }
		exit 1;;

		
        rar)
            ## Avoid password prompt by providing empty password
		try unrar -p- lt "${FILE_PATH}" && { dump | trim; exit 0; } || exit 1;;
        7z)
            ## Avoid password prompt by providing empty password
		try 7z -p l "$FILE_PATH" && { dump | trim; exit 0; } || exit 1;;

        ## PDF
        pdf)
            ## Preview as text conversion
		try pdftoppm -jpeg -singlefile "$FILE_PATH" "${IMAGE_CACHE_PATH//.jpg}" && exit 6 || exit 1;;
		 
        ## BitTorrent
        torrent)
            try  transmission-show -- "${FILE_PATH}" && { dump | trim; exit 5; } || exit 1;

        ## OpenDocument
        odt|ods|odp|sxw)
		## Preview as text conversion
		try odt2txt "${FILE_PATH}" && { dump | trim; exit 5; } || exit 1;;

        ## XLSX
        xlsx)
            ## Preview as csv conversion
            ## Uses: https://github.com/dilshod/xlsx2csv
            try xlsx2csv -- "${FILE_PATH}" && { dump | trim; exit 5; } || exit 1;;

        ## HTML
        htm|html|xhtml)
            ## Preview as text conversion
            try w3m -dump "${FILE_PATH}" && { dump | trim | fmt -s -w $PV_WIDTH; exit 4; }
            try lynx -dump "${FILE_PATH}" && { dump | trim | fmt -s -y $PV_WIDTH; exit 4; }
            try elinks -dump "${FILE_PATH}" && { dump | trim | fmt -s -y $PV_WIDTH; exit 4; }

        ## JSON
        json)
            try jq --color-output . "${FILE_PATH}" && { dump | trim; exit 5; } || exit 1;;

        ## Direct Stream Digital/Transfer (DSDIFF) and wavpack aren't detected
        ## by file(1).
        dff|dsf|wv|wvc)
            mediainfo "${FILE_PATH}" && exit 5
            exiftool "${FILE_PATH}" && exit 5
            ;; # Continue with next handler on failure
esac

case "${mimetype}" in
        ## Image
        image/*)
            img2txt --width="${PV_WIDTH}" "${FILE_PATH}" && exit 4 || exit 1;;
		

        ## Video
        video/* | audio/*)
             # Thumbnail
             ffmpegthumbnailer -i "${FILE_PATH}" -o "${IMAGE_CACHE_PATH}" -s 0 && exit 6
             exit 1;;
esac

exit 1
