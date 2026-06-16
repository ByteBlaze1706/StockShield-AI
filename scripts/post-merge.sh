#!/bin/bash
set -e
pnpm install --frozen-lockfile
pnpm --filter db push
# Production release cleanup and documentation refresh
