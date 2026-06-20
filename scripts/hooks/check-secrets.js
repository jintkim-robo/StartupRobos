#!/usr/bin/env node
// PreToolUse hook (Bash): コマンド内のシークレットパターンを検出してブロック
const fs = require('fs')

let raw = ''
try { raw = fs.readFileSync(0, 'utf-8') } catch { process.exit(0) }

let parsed
try { parsed = JSON.parse(raw) } catch { process.exit(0) }

const command = parsed.tool_input?.command || ''

// git commit 内のシークレットのみ検出（通常の echo/env 表示はブロックしない）
const isGitCommit = /\bgit\s+(commit|add|push)\b/.test(command)
const isEnvWrite = />\s*\.env/.test(command) || /cat\s*>\s*\.env/.test(command)

// .env.local への書き込みは許可（正当な用途）— .env.local.bak 等は除外
if (isEnvWrite && />\s*(\S+\/)?\.env\.local(\s|$)/.test(command)) {
  process.exit(0)
}

const SECRET_PATTERNS = require('./secret-patterns')

if (isGitCommit || isEnvWrite) {
  for (const pattern of SECRET_PATTERNS) {
    if (pattern.test(command)) {
      console.error(JSON.stringify({
        decision: 'block',
        reason: 'Secret pattern detected in command. Store secrets in .env.local (gitignored) or use 1Password CLI.',
      }))
      process.exit(2)
    }
  }
}

process.exit(0)
