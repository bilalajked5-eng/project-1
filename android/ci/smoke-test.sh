#!/usr/bin/env bash
# Installs the APK on the emulator, opens it and checks the calculator rendered the spreadsheet's result.
set -euo pipefail
APK="$1"
OUT="${2:-smoke}"
mkdir -p "$OUT"

adb install -r "$APK"
adb shell dumpsys package com.papercalc.app | grep -iE "requested permissions|granted=" > "$OUT/permissions.txt" || true
adb logcat -c
adb shell am start -W -n com.papercalc.app/.MainActivity
sleep 15
adb exec-out screencap -p > "$OUT/screen.png"

# The first dump switches accessibility on; WebView fills in its page text a moment later.
adb shell uiautomator dump /sdcard/ui.xml >/dev/null || true
sleep 5
adb shell uiautomator dump /sdcard/ui.xml
adb pull /sdcard/ui.xml "$OUT/ui.xml"
adb logcat -d > "$OUT/logcat.txt" || true

echo "--- app log ---"
grep -iE "chromium|console|AndroidRuntime|papercalc|cr_" "$OUT/logcat.txt" | tail -40 || true
echo "--- visible text ---"
grep -o 'text="[^"]*"' "$OUT/ui.xml" | grep -v 'text=""' || true

# Pixel count is for the log only; the small emulator screen can push the result card out of view.
python3 - "$OUT/screen.png" <<'PY'
import sys, zlib, struct
data = open(sys.argv[1], 'rb').read()
pos, w, h, idat = 8, 0, 0, b''
while pos < len(data):
    n, typ = struct.unpack('>I4s', data[pos:pos + 8])
    body = data[pos + 8:pos + 8 + n]
    if typ == b'IHDR':
        w, h, depth, ctype = struct.unpack('>IIBB', body[:10])
        bpp = {6: 4, 2: 3}[ctype]
    elif typ == b'IDAT':
        idat += body
    pos += 12 + n
raw = zlib.decompress(idat)
stride = w * bpp
prev = bytearray(stride)
found = {'green-result': 0, 'blue-header': 0}
i = 0
for y in range(h):
    f = raw[i]; line = bytearray(raw[i + 1:i + 1 + stride]); i += 1 + stride
    for x in range(stride):
        a = line[x - bpp] if x >= bpp else 0
        b = prev[x]
        c = prev[x - bpp] if x >= bpp else 0
        if f == 1: line[x] = (line[x] + a) & 255
        elif f == 2: line[x] = (line[x] + b) & 255
        elif f == 3: line[x] = (line[x] + (a + b) // 2) & 255
        elif f == 4:
            p = a + b - c; pa, pb, pc = abs(p - a), abs(p - b), abs(p - c)
            line[x] = (line[x] + (a if pa <= pb and pa <= pc else b if pb <= pc else c)) & 255
    prev = line
    for x in range(0, stride, bpp):
        r, g, bl = line[x], line[x + 1], line[x + 2]
        if abs(r - 0xe4) < 6 and abs(g - 0xf4) < 6 and abs(bl - 0xea) < 6: found['green-result'] += 1
        if abs(r - 0x1f) < 6 and abs(g - 0x4e) < 6 and abs(bl - 0x79) < 6: found['blue-header'] += 1
print('pixel counts:', found, 'size:', w, 'x', h)
PY
grep -q 'text="TOTAL REAM"' "$OUT/ui.xml"
grep -q 'text="499"' "$OUT/ui.xml"
echo "Smoke test passed: the app opened on Android 13 and shows TOTAL REAM 499."
