#!/bin/zsh
S="/private/tmp/claude-501/-Users-hh-Documents-Codex-2026-10-05-weo-outputs-centroreflexion/4773bd4c-79b9-4488-8298-28fb3a273bdb/scratchpad"; P="/Users/hh/Documents/Codex/2026-10-05/weo/outputs/centroreflexion/redes/reels/2026-10-28-rauld-pauta/musica"; cd "$S/work"
n=$1
"$S/venv/bin/python" -I render.py "$S/src/entrevista.mp4" edl$n.json "$S/out/v$n.mp4" || exit 1
"$S/venv/bin/python" -I mix.py "$S/src/entrevista.mp4" edl$n.json "$S/music/m$n.wav" "$P/golpe.mp3" "$S/out/mez$n.wav" "$S/out/voz$n.wav" || exit 1
ffmpeg -v error -y -i "$S/out/v$n.mp4" -i "$S/out/mez$n.wav" -c:v copy -c:a aac -b:a 256k -shortest -movflags +faststart "$S/out/reel$n.mp4"
ffmpeg -v error -y -i "$S/out/v$n.mp4" -i "$S/out/voz$n.wav" -c:v copy -c:a aac -b:a 256k -shortest -movflags +faststart "$S/out/reel$n-voz.mp4"
echo listo $n
