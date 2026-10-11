#!/bin/bash
# Deploys the display over SSH. HOST is an ~/.ssh/config alias; DIR is the document root,
# relative to the remote home directory. Backs up the live page first.
# .htaccess is not uploaded: on cPanel it shares the file with cPanel's own PHP block, so edit it by hand.
set -euo pipefail
HOST=${HOST:-cedarwater}
DIR=${DIR:-hub.cedarwater.net}
URL=${URL:-https://hub.cedarwater.net/}
cd "$(dirname "$0")"

tests/run.sh >/dev/null || { echo "Tests failed; not deploying. Run tests/run.sh to see why."; exit 1; }
stamp=$(date +%F-%H%M)
ssh "$HOST" "mkdir -p ~/hub-backups && cp ~/$DIR/index.html ~/hub-backups/index-$stamp.html"
scp -q index.html fetch.php manifest.webmanifest icon-180.png icon-192.png icon-512.png "$HOST:$DIR/"
ssh "$HOST" "cd ~/$DIR && chmod 644 index.html fetch.php manifest.webmanifest icon-*.png"
curl -fsS -o /dev/null -w "Deployed $(git rev-parse --short HEAD): %{http_code} $URL\n" "$URL"
