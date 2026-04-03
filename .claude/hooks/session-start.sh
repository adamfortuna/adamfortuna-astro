#!/bin/bash
set -euo pipefail

# Only run in remote (Claude Code on the web) environments
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR"

# Install dependencies
# Note: NPMRC_FONTAWESOME_PACKAGE_TOKEN must be set as a Claude Code secret
# for the FontAwesome private registry to work. Other env vars (WP_* tokens, etc.)
# should also be configured as secrets in your Claude Code project settings.
npm install
