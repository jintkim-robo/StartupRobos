#!/usr/bin/env node
// PreToolUse hook (Write|Edit): .env.local 以外のファイルへのシークレット書き込みをブロック
const fs = require('fs')
const path = require('path')

let raw = ''
try { raw = fs.readFileSync(0, 'utf-8') } catch { process.exit(0) }

let parsed
try { parsed = JSON.parse(raw) } catch { process.exit(0) }

const filePath = parsed.tool_input?.file_path || parsed.tool_input?.p || ''
const content = parsed.tool_input?.content || parsed.tool_input?.new_string || ''

// .env.local への書き込みは許可（正当な用途）— basename 一致で判定し path traversal を防止
if (path.basename(filePath) === '.env.local') {
  process.exit(0)
}

const SECRET_PATTERNS = require('./secret-patterns')

for (const pattern of SECRET_PATTERNS) {
  if (pattern.test(content)) {
    console.error(JSON.stringify({
      decision: 'block',
      reason: `Secret pattern detected in write to ${filePath}. Secrets should only go in .env.local (gitignored).`,
    }))
    process.exit(2)
  }
}

process.exit(0)
