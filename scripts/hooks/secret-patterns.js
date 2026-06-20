#!/usr/bin/env node
'use strict'
// StartupRobos スタック (Anthropic, Supabase/JWT, Stripe, GitHub) のシークレットパターン
// 意図的に除外: AWS (AKIA...), GCP (AIza...), Azure キー — スタック外のため
// 新しいサービスを追加する場合はここにパターンを追加すること
module.exports = [
  /sk-ant-[a-zA-Z0-9_-]{20,}/,
  /eyJ[a-zA-Z0-9_-]{30,}\.[a-zA-Z0-9_-]{30,}/,
  /sk_live_[a-zA-Z0-9]{20,}/,
  /whsec_[a-zA-Z0-9]{20,}/,
  /ghp_[a-zA-Z0-9]{30,}/,
  /gho_[a-zA-Z0-9]{30,}/,
]
