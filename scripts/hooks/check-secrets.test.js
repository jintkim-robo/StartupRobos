'use strict'
/**
 * check-secrets.js / check-secrets-write.js のユニットテスト
 *
 * 方針:
 * - 両 hook は stdin から JSON を読む単純な Node スクリプト。
 *   子プロセスで直接実行することで外部依存なしに統合的にテストする。
 * - mock 不使用。実物のスクリプトを child_process.spawnSync で動かす。
 * - exit code と stderr の JSON を検証する。
 *
 * テスト実行: node --test scripts/hooks/check-secrets.test.js
 * （Node 18+ の組み込みテストランナーを使用）
 */

const { describe, it } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')

const HOOKS_DIR = __dirname

// ダミーシークレット（GitHub Push Protection 回避のため動的に構築）
const STRIPE_LIVE = 'sk_' + 'live_' + 'A'.repeat(24)

// ── ヘルパー ─────────────────────────────────────────────────────────────────

/**
 * hook スクリプトを JSON ペイロードで実行し、結果を返す。
 * @param {string} script  'check-secrets.js' | 'check-secrets-write.js'
 * @param {object|undefined} payload tool_input オブジェクト
 */
function runHook(script, payload) {
  const scriptPath = path.join(HOOKS_DIR, script)
  const input = JSON.stringify({ tool_input: payload })
  const result = spawnSync(process.execPath, [scriptPath], {
    input,
    encoding: 'utf-8',
    timeout: 5000,
  })
  let decision = null
  let reason = null
  try {
    const parsed = JSON.parse(result.stderr)
    decision = parsed.decision
    reason = parsed.reason
  } catch (_) { /* no-op */ }
  return {
    exitCode: result.status,
    stderr: result.stderr,
    stdout: result.stdout,
    decision,
    reason,
  }
}

// ── check-secrets.js (Bash hook) ──────────────────────────────────────────────

describe('check-secrets.js — Bash hook', () => {

  // ── ハッピーパス: 通常コマンドはブロックしない ──────────────────────────

  it('通常の git status はブロックしない', () => {
    const r = runHook('check-secrets.js', { command: 'git status' })
    assert.equal(r.exitCode, 0)
  })

  it('echo コマンドはブロックしない（isGitCommit が false）', () => {
    const r = runHook('check-secrets.js', { command: 'echo sk-ant-api03-AAAAAAAAAAAAAAAAAAAA' })
    assert.equal(r.exitCode, 0, 'echo はシークレット検出対象外であるべき')
  })

  it('env コマンドはブロックしない', () => {
    const r = runHook('check-secrets.js', { command: 'env | grep ANTHROPIC' })
    assert.equal(r.exitCode, 0)
  })

  // ── git commit + シークレット ──────────────────────────────────────────────

  it('git commit メッセージに Anthropic API キーが含まれるとブロック', () => {
    const r = runHook('check-secrets.js', {
      command: 'git commit -m "add sk-ant-api03-AAAAAAAAAAAAAAAAAAAAAAAAAAAA key"',
    })
    assert.equal(r.exitCode, 2)
    assert.equal(r.decision, 'block')
  })

  it('git commit に Stripe live キーが含まれるとブロック', () => {
    const r = runHook('check-secrets.js', {
      command: `git commit -m "add ${STRIPE_LIVE}"`,
    })
    assert.equal(r.exitCode, 2)
    assert.equal(r.decision, 'block')
  })

  it('git commit に Stripe webhook シークレットが含まれるとブロック', () => {
    const r = runHook('check-secrets.js', {
      command: 'git commit -m "add whsec_AAAAAAAAAAAAAAAAAAAAAAAA"',
    })
    assert.equal(r.exitCode, 2)
    assert.equal(r.decision, 'block')
  })

  it('git commit に GitHub PAT (ghp_) が含まれるとブロック', () => {
    const r = runHook('check-secrets.js', {
      command: 'git commit -m "token ghp_AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA fix"',
    })
    assert.equal(r.exitCode, 2)
    assert.equal(r.decision, 'block')
  })

  it('git commit に GitHub OAuth token (gho_) が含まれるとブロック', () => {
    const r = runHook('check-secrets.js', {
      command: 'git commit -m "oauth gho_AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"',
    })
    assert.equal(r.exitCode, 2)
    assert.equal(r.decision, 'block')
  })

  it('git commit に JWT (eyJ...) が含まれるとブロック', () => {
    const jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIn0'
    const r = runHook('check-secrets.js', {
      command: `git commit -m "add ${jwt}"`,
    })
    assert.equal(r.exitCode, 2)
    assert.equal(r.decision, 'block')
  })

  it('git push に Anthropic キーが含まれるとブロック', () => {
    const r = runHook('check-secrets.js', {
      command: 'git push origin main --exec "echo sk-ant-api03-AAAAAAAAAAAAAAAAAAAAAAAAAAAA"',
    })
    assert.equal(r.exitCode, 2)
    assert.equal(r.decision, 'block')
  })

  it('git commit 内のシークレットなしは通過', () => {
    const r = runHook('check-secrets.js', {
      command: 'git commit -m "fix: update config without secrets"',
    })
    assert.equal(r.exitCode, 0)
  })

  // ── .env 書き込み検出 ─────────────────────────────────────────────────────

  it('.env への書き込みに Anthropic キーが含まれるとブロック', () => {
    const r = runHook('check-secrets.js', {
      command: 'echo "ANTHROPIC_API_KEY=sk-ant-api03-AAAAAAAAAAAAAAAAAAAAAAAAAAAA" > .env',
    })
    assert.equal(r.exitCode, 2)
    assert.equal(r.decision, 'block')
  })

  it('cat > .env にシークレットが含まれるとブロック', () => {
    const r = runHook('check-secrets.js', {
      command: 'cat > .env <<EOF\nANTHROPIC_API_KEY=sk-ant-api03-AAAAAAAAAAAAAAAAAAAAAAAAAAAA\nEOF',
    })
    assert.equal(r.exitCode, 2)
    assert.equal(r.decision, 'block')
  })

  it('.env.local への書き込みは許可（正当な用途）', () => {
    const r = runHook('check-secrets.js', {
      command: 'echo "ANTHROPIC_API_KEY=sk-ant-api03-AAAAAAAAAAAAAAAAAAAAAAAAAAAA" > .env.local',
    })
    assert.equal(r.exitCode, 0, '.env.local は許可されるべき')
  })

  it('.env.production への書き込みにシークレットがあるとブロック', () => {
    const r = runHook('check-secrets.js', {
      command: `echo "KEY=${STRIPE_LIVE}" > .env.production`,
    })
    assert.equal(r.exitCode, 2)
    assert.equal(r.decision, 'block')
  })

  // ── 境界値: regex の長さ下限 ──────────────────────────────────────────────

  it('sk-ant- 以降が 19 文字以下はブロックしない（短すぎる誤検知防止）', () => {
    // パターンは /sk-ant-[a-zA-Z0-9_-]{20,}/ なので sk-ant- 以降 19 文字はマッチしない
    const r = runHook('check-secrets.js', {
      command: 'git commit -m "sk-ant-AAAAAAAAAAAAAAAAAAA"', // 19 A's after "sk-ant-"
    })
    assert.equal(r.exitCode, 0)
  })

  it('sk-ant- 以降が正確に 20 文字はブロックする（下限境界）', () => {
    const r = runHook('check-secrets.js', {
      command: 'git commit -m "sk-ant-AAAAAAAAAAAAAAAAAAAA"', // exactly 20 chars after "sk-ant-"
    })
    assert.equal(r.exitCode, 2)
  })

  it('ghp_ 以降が 29 文字以下はブロックしない', () => {
    const r = runHook('check-secrets.js', {
      command: 'git commit -m "ghp_AAAAAAAAAAAAAAAAAAAAAAAAAAAAA"', // 29 chars after "ghp_"
    })
    assert.equal(r.exitCode, 0)
  })

  it('ghp_ 以降が正確に 30 文字はブロックする', () => {
    const r = runHook('check-secrets.js', {
      command: 'git commit -m "ghp_AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"', // 30 chars after "ghp_"
    })
    assert.equal(r.exitCode, 2)
  })

  // ── エラー系: 不正な入力 ─────────────────────────────────────────────────

  it('空の stdin でも crash しない（exit 0）', () => {
    const result = spawnSync(process.execPath, [path.join(HOOKS_DIR, 'check-secrets.js')], {
      input: '',
      encoding: 'utf-8',
      timeout: 5000,
    })
    assert.equal(result.status, 0)
  })

  it('JSON でない stdin でも crash しない（exit 0）', () => {
    const result = spawnSync(process.execPath, [path.join(HOOKS_DIR, 'check-secrets.js')], {
      input: 'not-json',
      encoding: 'utf-8',
      timeout: 5000,
    })
    assert.equal(result.status, 0)
  })

  it('tool_input なしの JSON でも crash しない（exit 0）', () => {
    const r = runHook('check-secrets.js', undefined)
    assert.equal(r.exitCode, 0)
  })

  it('command が null でも crash しない', () => {
    const r = runHook('check-secrets.js', { command: null })
    assert.equal(r.exitCode, 0)
  })

  // ── [P0] バグ再現: .env.local の allowlist が && チェーンでバイパスされる ──
  // isEnvWrite=true && allowLocal=true → 早期 exit(0)。.env へのシークレット書き込みが未スキャン。
  it('[P0-BUG] .env へのシークレット書き込み + && .env.local でバイパスされる（既知バグ）', () => {
    const r = runHook('check-secrets.js', {
      command: 'echo KEY=sk-ant-api03-AAAAAAAAAAAAAAAAAAAA > .env && echo k > .env.local',
    })
    // 現状 exit 0 になる（バグ）。修正後は exit 2 になること。
    // TODO: fix allowLocal check to only early-exit when .env.local is the ONLY env write target
    assert.equal(r.exitCode, 2, '[BUG] .env + && .env.local のチェーンでシークレットがバイパスされている')
  })

  // ── [P1] subdir 配下の .env はブロックされない（設計上の検出漏れ） ──────────
  it('[P1] サブディレクトリの .env への書き込みは現状ブロックされない（設計上の漏れ）', () => {
    // isEnvWrite は />\s*\.env/ なので subdir/.env にはマッチしない
    // セキュリティ改善まではこのテストで漏れを明示する
    const r = runHook('check-secrets.js', {
      command: `echo STRIPE=${STRIPE_LIVE} > subdir/.env`,
    })
    assert.equal(r.exitCode, 2, '[設計漏れ] subdir/.env がスキャン対象外になっている')
  })

  // ── [P2] whsec_ / sk_live_ の境界値テスト（check-secrets.js でも確認） ───────
  it('whsec_ 以降が 19 文字以下はブロックしない', () => {
    const r = runHook('check-secrets.js', {
      command: 'git commit -m "whsec_AAAAAAAAAAAAAAAAAAA"', // 19 chars
    })
    assert.equal(r.exitCode, 0)
  })

  it('whsec_ 以降が正確に 20 文字はブロックする', () => {
    const r = runHook('check-secrets.js', {
      command: 'git commit -m "whsec_AAAAAAAAAAAAAAAAAAAA"', // 20 chars
    })
    assert.equal(r.exitCode, 2)
  })

  it('sk_live_ 以降が 19 文字以下はブロックしない', () => {
    const r = runHook('check-secrets.js', {
      command: 'git commit -m "sk_live_AAAAAAAAAAAAAAAAAAA"', // 19 chars
    })
    assert.equal(r.exitCode, 0)
  })

  it('sk_live_ 以降が正確に 20 文字はブロックする', () => {
    const r = runHook('check-secrets.js', {
      command: `git commit -m "${STRIPE_LIVE}"`, // STRIPE_LIVE = sk_live_ + 24 chars
    })
    assert.equal(r.exitCode, 2)
  })

  // ── [P2] gho_ 境界値（check-secrets.js での確認）─────────────────────────────
  it('gho_ 以降が 29 文字以下はブロックしない', () => {
    const r = runHook('check-secrets.js', {
      command: 'git commit -m "gho_AAAAAAAAAAAAAAAAAAAAAAAAAAAAA"', // 29 chars
    })
    assert.equal(r.exitCode, 0)
  })

  it('gho_ 以降が正確に 30 文字はブロックする', () => {
    const r = runHook('check-secrets.js', {
      command: 'git commit -m "gho_AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"', // 30 chars
    })
    assert.equal(r.exitCode, 2)
  })

  // ── [P3] .env.local への append (>>) は許可される ────────────────────────────
  it('.env.local への >> (append) は .env.local 許可ロジックに含まれ通過する', () => {
    // >> も isEnvWrite にマッチ (/>\s*\.env/)、かつ allowLocal にもマッチ → exit 0
    const r = runHook('check-secrets.js', {
      command: 'echo "ANTHROPIC_API_KEY=sk-ant-api03-AAAAAAAAAAAAAAAAAAAAAAAAAAAA" >> .env.local',
    })
    assert.equal(r.exitCode, 0, '.env.local への append も許可すべき')
  })
})

// ── check-secrets-write.js (Write/Edit hook) ─────────────────────────────────

describe('check-secrets-write.js — Write/Edit hook', () => {

  // ── ハッピーパス ──────────────────────────────────────────────────────────

  it('シークレットなしのコンテンツはブロックしない', () => {
    const r = runHook('check-secrets-write.js', {
      file_path: 'src/config.ts',
      content: 'export const TIMEOUT = 5000',
    })
    assert.equal(r.exitCode, 0)
  })

  it('.env.local への書き込みは常に許可（content に key があっても）', () => {
    const r = runHook('check-secrets-write.js', {
      file_path: '.env.local',
      content: 'ANTHROPIC_API_KEY=sk-ant-api03-AAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    })
    assert.equal(r.exitCode, 0, '.env.local は gitignore 対象なので許可すべき')
  })

  it('/path/to/.env.local (絶対パス) への書き込みも許可', () => {
    const r = runHook('check-secrets-write.js', {
      file_path: '/home/user/project/.env.local',
      content: `STRIPE_KEY=${STRIPE_LIVE}`,
    })
    assert.equal(r.exitCode, 0)
  })

  // ── シークレット種別ごとのブロック検証 ───────────────────────────────────

  it('Anthropic API key を .ts ファイルに書くとブロック', () => {
    const r = runHook('check-secrets-write.js', {
      file_path: 'src/lib/client.ts',
      content: 'const key = "sk-ant-api03-AAAAAAAAAAAAAAAAAAAAAAAAAAAA"',
    })
    assert.equal(r.exitCode, 2)
    assert.equal(r.decision, 'block')
  })

  it('Stripe live key を .env に書くとブロック', () => {
    const r = runHook('check-secrets-write.js', {
      file_path: '.env',
      content: `STRIPE_SECRET=${STRIPE_LIVE}`,
    })
    assert.equal(r.exitCode, 2)
    assert.equal(r.decision, 'block')
  })

  it('Stripe webhook secret を .env.production に書くとブロック', () => {
    const r = runHook('check-secrets-write.js', {
      file_path: '.env.production',
      content: 'STRIPE_WEBHOOK=whsec_AAAAAAAAAAAAAAAAAAAAAAAA',
    })
    assert.equal(r.exitCode, 2)
    assert.equal(r.decision, 'block')
  })

  it('GitHub PAT を markdown に書くとブロック', () => {
    const r = runHook('check-secrets-write.js', {
      file_path: 'README.md',
      content: '## Token: ghp_AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\n',
    })
    assert.equal(r.exitCode, 2)
    assert.equal(r.decision, 'block')
  })

  it('GitHub OAuth token を JSON に書くとブロック', () => {
    const r = runHook('check-secrets-write.js', {
      file_path: 'config.json',
      content: '{"token": "gho_AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"}',
    })
    assert.equal(r.exitCode, 2)
    assert.equal(r.decision, 'block')
  })

  it('JWT を設定ファイルに書くとブロック', () => {
    const jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIn0'
    const r = runHook('check-secrets-write.js', {
      file_path: 'settings.json',
      content: `{"jwt": "${jwt}"}`,
    })
    assert.equal(r.exitCode, 2)
    assert.equal(r.decision, 'block')
  })

  // ── Edit hook 固有: new_string フィールド ─────────────────────────────────

  it('Edit ツールの new_string にシークレットがあるとブロック', () => {
    const r = runHook('check-secrets-write.js', {
      file_path: 'src/index.ts',
      new_string: 'const API_KEY = "sk-ant-api03-AAAAAAAAAAAAAAAAAAAAAAAAAAAA"',
    })
    assert.equal(r.exitCode, 2)
    assert.equal(r.decision, 'block')
  })

  it('new_string がシークレットなしなら通過', () => {
    const r = runHook('check-secrets-write.js', {
      file_path: 'src/index.ts',
      new_string: 'const TIMEOUT = 5000',
    })
    assert.equal(r.exitCode, 0)
  })

  // ── 代替パスフィールド (p) ─────────────────────────────────────────────

  it('file_path が未設定で p フィールドを使う場合もシークレットをブロック', () => {
    const r = runHook('check-secrets-write.js', {
      p: 'src/secret.ts',
      content: 'const k = "sk-ant-api03-AAAAAAAAAAAAAAAAAAAAAAAAAAAA"',
    })
    assert.equal(r.exitCode, 2)
  })

  // ── エラー系: 不正入力 ───────────────────────────────────────────────────

  it('空の stdin でも crash しない', () => {
    const result = spawnSync(process.execPath, [path.join(HOOKS_DIR, 'check-secrets-write.js')], {
      input: '',
      encoding: 'utf-8',
      timeout: 5000,
    })
    assert.equal(result.status, 0)
  })

  it('JSON でない stdin でも crash しない', () => {
    const result = spawnSync(process.execPath, [path.join(HOOKS_DIR, 'check-secrets-write.js')], {
      input: 'invalid-json',
      encoding: 'utf-8',
      timeout: 5000,
    })
    assert.equal(result.status, 0)
  })

  it('tool_input なしの JSON でも crash しない', () => {
    const r = runHook('check-secrets-write.js', undefined)
    assert.equal(r.exitCode, 0)
  })

  it('content と new_string が両方 null でも crash しない', () => {
    const r = runHook('check-secrets-write.js', {
      file_path: 'foo.ts',
      content: null,
      new_string: null,
    })
    assert.equal(r.exitCode, 0)
  })

  // ── ブロック時のレスポンス構造 ────────────────────────────────────────────

  it('ブロック時の stderr は valid JSON (decision + reason)', () => {
    const r = runHook('check-secrets-write.js', {
      file_path: 'src/config.ts',
      content: 'const k = "sk-ant-api03-AAAAAAAAAAAAAAAAAAAAAAAAAAAA"',
    })
    assert.equal(r.exitCode, 2)
    assert.equal(r.decision, 'block')
    assert.ok(typeof r.reason === 'string' && r.reason.length > 0, 'reason が存在すべき')
  })

  it('reason に対象ファイルパスが含まれる', () => {
    const r = runHook('check-secrets-write.js', {
      file_path: 'src/dangerous.ts',
      content: 'const k = "sk-ant-api03-AAAAAAAAAAAAAAAAAAAAAAAAAAAA"',
    })
    assert.ok(r.reason.includes('src/dangerous.ts'), `reason に file_path が含まれるべき: ${r.reason}`)
  })

  // ── パストラバーサル: ../../../.env.local は .env.local と同一 basename なので許可 ──
  it('../../../.env.local は basename が .env.local なので許可される', () => {
    const r = runHook('check-secrets-write.js', {
      file_path: '../../../.env.local',
      content: 'const k = "sk-ant-api03-AAAAAAAAAAAAAAAAAAAAAAAAAAAA"',
    })
    // path.basename('../../../.env.local') === '.env.local' なので許可は正しい
    assert.equal(r.exitCode, 0)
  })

  it('malicious.env.local は basename が .env.local ではないのでブロック', () => {
    const r = runHook('check-secrets-write.js', {
      file_path: 'malicious.env.local',
      content: 'const k = "sk-ant-api03-AAAAAAAAAAAAAAAAAAAAAAAAAAAA"',
    })
    assert.equal(r.exitCode, 2)
    assert.equal(r.decision, 'block')
  })

  it('.env.local/../.env へのシークレット書き込みはブロックする', () => {
    // このパスは endsWith('.env.local') = false なのでブロック経路に入る
    const r = runHook('check-secrets-write.js', {
      file_path: '.env.local/../.env',
      content: 'const k = "sk-ant-api03-AAAAAAAAAAAAAAAAAAAAAAAAAAAA"',
    })
    assert.equal(r.exitCode, 2)
    assert.equal(r.decision, 'block')
  })
})
