#!/usr/bin/env bash
# Installs the APK on the emulator, opens it and checks the calculator shows the spreadsheet's result.
set -euo pipefail
APK="$1"
OUT="${2:-smoke}"
mkdir -p "$OUT"

adb install -r "$APK"
adb shell dumpsys package com.papercalc.app | grep -iE "requested permissions|granted=" > "$OUT/permissions.txt" || true
adb shell am start -W -n com.papercalc.app/.MainActivity
sleep 15
adb exec-out screencap -p > "$OUT/screen.png"
adb shell uiautomator dump /sdcard/ui.xml
adb pull /sdcard/ui.xml "$OUT/ui.xml"
adb logcat -d | grep -iE "chromium|AndroidRuntime|papercalc" > "$OUT/logcat.txt" || true

echo "--- visible text ---"
grep -o 'text="[^"]*"' "$OUT/ui.xml" | grep -v 'text=""' || true

grep -q 'TOTAL REAM' "$OUT/ui.xml"
grep -q 'text="499"' "$OUT/ui.xml"
echo "Smoke test passed: app opened and shows TOTAL REAM 499."
