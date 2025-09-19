#!/usr/bin/env bash
npx oss-attribution-generator generate --input ./package.json && \
mv ./oss-attribution/attribution.txt ./THIRD_PARTY_LICENSES.txt && \
rm -r ./oss-attribution

