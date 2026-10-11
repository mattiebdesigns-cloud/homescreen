#!/bin/bash
# Runs the page's logic in headless Google Chrome. Each test file is appended to a copy of
# index.html (optionally after a setup script that seeds localStorage) and writes PASS/FAIL
# lines into <pre id="results">. No API key or network account is needed: the Claude API is faked.
set -uo pipefail
cd "$(dirname "$0")"
CHROME=${CHROME:-"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"}
TMP=$(mktemp -d); trap 'rm -rf "$TMP"' EXIT
# test file : setup file (blank for none)
SUITES="core.js: wake-word.js: ringing.js: claude-loop.js:setup-with-key.js music.js:setup-with-youtube.js radio.js:setup-with-youtube.js photo-screen.js:setup-with-key.js api-key.js:setup-with-key.js calendar-toggle.js:setup-with-calendar.js"
pass=0; fail=0
for pair in $SUITES; do
  t=${pair%%:*}; setup=${pair#*:}
  { [ -n "$setup" ] && cat "$setup"; sed 's#</body>##; s#</html>##' ../index.html; cat "$t"; echo '</body></html>'; } > "$TMP/$t.html"
  out=$("$CHROME" --headless=new --disable-gpu --virtual-time-budget=20000 --timeout=30000 --dump-dom "file://$TMP/$t.html" 2>/dev/null |
    python3 -c "import sys,re,html;m=re.search(r'<pre id=\"results\"[^>]*>(.*?)</pre>',sys.stdin.read(),re.S);print(html.unescape(m.group(1)) if m else 'FAIL no results (script error?)')")
  echo "== $t"; echo "$out"
  pass=$((pass + $(grep -c '^PASS' <<<"$out"))); fail=$((fail + $(grep -c '^FAIL' <<<"$out")))
done
echo; echo "$pass passed, $fail failed"
[ "$fail" -eq 0 ]
