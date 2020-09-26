# ~/.profile: executed by the command interpreter for login shells.
# This file is not read by bash(1), if ~/.bash_profile or ~/.bash_login
# exists.
# see /usr/share/doc/bash/examples/startup-files for examples.
# the files are located in the bash-doc package.

# the default umask is set in /etc/profile; for setting the umask
# for ssh logins, install and configure the libpam-umask package.
#umask 022

# if running bash
if [ -n "$BASH_VERSION" ]; then
    # include .bashrc if it exists
    if [ -f "$HOME/.bashrc" ]; then
	. "$HOME/.bashrc"
    fi
fi

# set PATH so it includes user's private bin if it exists
if [ -d "$HOME/bin" ] ; then
    PATH="$HOME/bin:$PATH"
fi

# set PATH so it includes user's private bin if it exists
if [ -d "$HOME/.local/bin" ] ; then
    PATH="$HOME/.local/bin:$PATH"
fi

export PKG_CONFIG_PATH=/sbin/openssl
export GOROOT=/usr/lib/go
export GOPATH=/hdd/pgr/go
export PATH=$GOPATH/bin:$GOROOT/bin:$PATH:$PKG_CONFIG_PATH
export GO111MODULE=auto

export PATH="$HOME/.cargo/bin:$PATH"
export VAULT_ADDR="https://vault.cycloid.io"
export VAULT_AUTH_GITHUB_TOKEN="1789da4fdac11c50456e94e46e4a67ea45ed958c"
