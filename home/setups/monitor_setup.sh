#! /usr/bin/env bash
#xrandr --output HDMI-1 --mode 3840x2160 --rate 30 --right-of eDP-1
#xrandr --output DP-1 --auto --scale 2x2 --mode 1920x1080 --rate 60 --right-of eDP-1 --output HDMI-1 --auto --mode 3840x2160 --rate 30 --right-of DP-1
#xrandr --output eDP-1 --auto --pos 0x0 --output DP-1 --mode 1920x1080 --auto --pos 1920x0 --output HDMI-1 --mode 3840x2160 --rate 60 --auto --pos 3840x0

xrandr --output HDMI-1 --mode 3840x2160 --rate 60
#wp="/hdd/pictures/wallpapers/forest-fever-0192-darker.png"
wp="/home/exsomnis/setups/small-memory-8k.jpg"
feh --bg-scale $wp
