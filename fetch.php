<?php
// Home Display helper: fetches a short list of Google pages for the display page
// that sits next to it, so the page does not need public relay services.
//
// It only answers the page on its own site, only fetches the hosts listed below,
// and stores nothing.

const ALLOWED_HOSTS = [
    'photos.app.goo.gl',
    'photos.google.com',
    'news.google.com',
    'calendar.google.com',
];
const MAX_BYTES = 12 * 1024 * 1024;
const MAX_REDIRECTS = 5;

header('Content-Type: text/plain; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');

function fail(int $code, string $msg): void {
    http_response_code($code);
    echo $msg;
    exit;
}

// Same-site requests only, so other websites cannot use this as their proxy.
$site = $_SERVER['HTTP_SEC_FETCH_SITE'] ?? '';
if ($site !== '' && $site !== 'same-origin') fail(403, 'forbidden');
if ($site === '') {
    $host = strtolower($_SERVER['HTTP_HOST'] ?? '');
    $from = $_SERVER['HTTP_ORIGIN'] ?? ($_SERVER['HTTP_REFERER'] ?? '');
    $fromHost = strtolower((string) parse_url($from, PHP_URL_HOST));
    $fromPort = parse_url($from, PHP_URL_PORT);
    if ($fromPort) $fromHost .= ':' . $fromPort;
    if ($fromHost === '' || $fromHost !== $host) fail(403, 'forbidden');
}
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'GET') fail(405, 'GET only');

if (isset($_GET['ping'])) { echo 'home-display-ok'; exit; }

function allowed(string $url): bool {
    $p = parse_url($url);
    if (!$p || ($p['scheme'] ?? '') !== 'https') return false;
    if (isset($p['user']) || isset($p['pass'])) return false;
    if (isset($p['port']) && (int) $p['port'] !== 443) return false;
    return in_array(strtolower($p['host'] ?? ''), ALLOWED_HOSTS, true);
}

$url = (string) ($_GET['url'] ?? '');
if (strlen($url) > 2000 || !allowed($url)) fail(400, 'That address is not on the allowed list.');
if (!function_exists('curl_init')) fail(500, 'This server does not have curl enabled for PHP.');

$body = '';
for ($hop = 0; $hop <= MAX_REDIRECTS; $hop++) {
    $body = '';
    $tooBig = false;
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_FOLLOWLOCATION => false,          // redirects are followed by hand so each hop is re-checked
        CURLOPT_PROTOCOLS      => CURLPROTO_HTTPS,
        CURLOPT_CONNECTTIMEOUT => 8,
        CURLOPT_TIMEOUT        => 25,
        CURLOPT_ENCODING       => '',
        CURLOPT_HEADER         => false,
        CURLOPT_USERAGENT      => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36',
        CURLOPT_HTTPHEADER     => ['Accept-Language: en-US,en;q=0.9'],
        CURLOPT_WRITEFUNCTION  => function ($ch, $chunk) use (&$body, &$tooBig) {
            $body .= $chunk;
            if (strlen($body) > MAX_BYTES) { $tooBig = true; return 0; }
            return strlen($chunk);
        },
    ]);
    $ok = curl_exec($ch);
    $status = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
    $next = (string) curl_getinfo($ch, CURLINFO_REDIRECT_URL);
    curl_close($ch);

    if ($tooBig) fail(502, 'That page is too large.');
    if ($ok === false && $status === 0) fail(502, 'Could not reach that address.');
    if ($status >= 300 && $status < 400 && $next !== '') {
        if (!allowed($next)) fail(502, 'That address redirected somewhere that is not allowed.');
        $url = $next;
        continue;
    }
    if ($status < 200 || $status >= 300) fail(502, 'That address answered with an error (' . $status . ').');
    echo $body;
    exit;
}
fail(502, 'Too many redirects.');
