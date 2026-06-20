#!/usr/bin/env node
// PreToolUse hook (Bash): コマンド内のシークレットパターンを検出してブロック
const fs = require('fs')
const path = require('path')

let raw = ''
try { raw = fs.readFileSync(0, 'utf-8') } catch { process.exit(0) }

let parsed
try { parsed = JSON.parse(raw) } catch { process.exit(0) }

const command = parsed.tool_input?.command || ''

// git commit 内のシークレットのみ検出（通常の echo/env 表示はブロックしない）
const isGitCommit = /\bgit\s+(commit|add|push)\b/.test(command)
const isEnvWrite = />\s*\S*\.env/.test(command)

// .env.local への書き込みは許可（正当な用途）
// 全リダイレクト先が .env.local の場合のみ許可（.env + .env.local のチェーン回避を防止）
if (isEnvWrite && !isGitCommit) {
  const targets = [...command.matchAll(/>\s*(\S*\.env\S*)/g)].map(m => m[1])
  if (targets.length > 0 && targets.every(t => path.basename(t) === '.env.local')) {
    process.exit(0)
  }
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
