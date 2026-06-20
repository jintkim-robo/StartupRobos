# StartupRobos Setup Guide

> Complete guide to get your AI startup platform running from scratch.
> Time needed: ~90 minutes for full deployment.

## What You Need Before Starting

- A computer with internet access
- An email address
- A credit/debit card (for Claude Pro subscription)
- About 90 minutes of uninterrupted time

**Total cost to start:** ~$25/month (Claude Pro $20 + Anthropic API credits $5)

---

## Step 1: Claude Desktop (10 min)

Claude Desktop is the AI assistant that runs your entire startup operation.

1. Go to [claude.ai/download](https://claude.ai/download)
2. Download and install Claude Desktop for your operating system (Windows, Mac, or Linux)
3. Create an Anthropic account if you don't have one
4. Subscribe to **Claude Pro** ($20/month) — this gives you access to Claude Code, which powers StartupRobos

> **Why Claude Pro?** The free tier has limited usage. Pro gives you enough capacity to run 3 businesses with daily AI operations.

---

## Step 2: GitHub Account (10 min)

GitHub stores your startup code and makes deployment possible.

1. Go to [github.com](https://github.com) and click **Sign up**
2. Create your account (free)
3. Go to the StartupRobos template: [github.com/Robo-Co-op/StartupRobos](https://github.com/Robo-Co-op/StartupRobos)
4. Click the green **"Use this template"** button → **"Create a new repository"**
5. Name your repository (e.g., `my-startup` or your name)
6. Keep it **Public** (free) or **Private** (also free for personal repos)
7. Click **Create repository**

> **Important:** Do NOT fork — use the template button. This gives you a clean copy that you own.

---

## Step 3: Open in Claude Desktop (2 min)

1. Copy your new repository's URL (e.g., `https://github.com/your-username/my-startup`)
2. Open Claude Desktop
3. Paste the GitHub URL into the chat
4. Claude Desktop will clone the repository and open it automatically
5. You're now inside your StartupRobos instance!

---

## Step 4: Supabase — Your Free Database (15 min)

Supabase stores your business data, experiments, and agent activity.

### Create a project

1. Go to [supabase.com](https://supabase.com) and click **Start your project**
2. Sign up with GitHub (easiest) or email
3. Click **New project**
4. Choose a name (e.g., "my-startup")
5. Set a database password — **save this somewhere safe**
6. Select a region close to you
7. Click **Create new project** and wait ~2 minutes

### Set up the database schema

1. In your Supabase dashboard, click **SQL Editor** (left sidebar)
2. Click **New query**
3. Open `supabase/schema.sql` from your StartupRobos repo and copy its entire contents
4. Paste into the SQL Editor and click **Run**
5. You should see "Success. No rows returned" — this is correct
6. Click **New query** again
7. Open `supabase/migrations/001_spend_budget_rpc.sql` and copy its contents
8. Paste and click **Run**

### Get your API keys

1. Go to **Settings** → **API** (in the left sidebar under Configuration)
2. Copy these 3 values (you'll need them in Step 6):
   - **Project URL** — looks like `https://abcdefgh.supabase.co`
   - **anon public key** — a long string starting with `eyJ...`
   - **service_role secret key** — another long string starting with `eyJ...`

> **Keep the service_role key secret.** It has full access to your database.

---

## Step 5: Anthropic API Key (5 min)

This key lets your AI agents (CEO, CTO, CMO, etc.) work autonomously.

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign in with the same account you use for Claude Desktop
3. Go to **API Keys** and click **Create Key**
4. Name it something like "startuprobos"
5. Copy the key — it starts with `sk-ant-...`
6. Go to **Billing** and add **$5–10** in API credits to start

> **$5 is enough for about 2 weeks** of normal operation with the default budget settings.

---

## Step 6: Set Up Your Environment (5 min)

Now connect everything by adding your keys to `.env.local`.

### Option A: Run the setup script (Recommended)

In your Claude Desktop session, ask Claude to run:

```
bash scripts/init-operator.sh
```

The script prompts for your keys with hidden input (keys don't appear on screen or in chat logs) and generates `.env.local` automatically.

### Option B: Edit manually

1. Open your project folder on your computer
2. Create a file called `.env.local` in the project root
3. Paste the following, replacing the placeholder values with your actual keys:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ANTHROPIC_API_KEY=your-api-key
CRON_SECRET=generate-a-random-string
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Save the file

> **Security note:** Do NOT paste your API keys into the Claude Desktop chat — they would persist in conversation logs. Edit `.env.local` directly or use the setup script. StartupRobos has built-in hooks that prevent keys from being accidentally committed to GitHub.

---

## Step 7: Vercel Deploy (15 min)

Vercel hosts your dashboard and runs your AI agents on a schedule.

### Create account and connect

1. Go to [vercel.com](https://vercel.com) and click **Sign Up**
2. Sign up with your **GitHub account** (this connects them automatically)
3. Click **Add New...** → **Project**
4. Find your StartupRobos repo in the list and click **Import**
5. Leave the default settings (Framework: Next.js) and click **Deploy**
6. Wait 1–2 minutes for the first build

### Add environment variables

1. In your Vercel project, go to **Settings** → **Environment Variables**
2. Add each variable from your `.env.local`:

| Key | Value | Environment |
|-----|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase URL | All |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your anon key | All |
| `SUPABASE_SERVICE_ROLE_KEY` | Your service role key | All |
| `ANTHROPIC_API_KEY` | Your API key | All |
| `CRON_SECRET` | (copy from .env.local) | All |
| `NEXT_PUBLIC_APP_URL` | Your Vercel URL (e.g., `https://my-startup.vercel.app`) | All |

3. Click **Save** for each one
4. Go to **Deployments** → click the latest → **Redeploy** (so it picks up the new variables)

### Verify it works

1. Open your Vercel URL (e.g., `https://my-startup.vercel.app`)
2. You should see the StartupRobos dashboard
3. The CEO heartbeat cron runs daily — check back tomorrow to see your first report

---

## Step 8: Business Accounts (Week 1–2)

After the AI picks your 3 businesses, you'll need accounts for specific platforms. The AI will guide you through these, but here's a preview:

### For all businesses

- **Wise** ([wise.com](https://wise.com)) — Receive payments internationally. Most accessible for refugees without traditional bank accounts. Free to create, low fees.

### Depending on your businesses

| If your business involves... | You'll need... |
|-----|-----|
| Tutoring | [italki](https://italki.com) or [Preply](https://preply.com) teacher profile |
| Digital products | [Gumroad](https://gumroad.com) store (free to start, they take a small fee per sale) |
| AI annotation / RLHF | [DataAnnotation.tech](https://dataannotation.tech) or [Outlier AI](https://outlier.ai) account |
| Translation / localization | Portfolio on [Upwork](https://upwork.com) or direct client outreach |
| Video editing | [Descript](https://descript.com) free tier, [CapCut](https://capcut.com) |

### For marketing (Week 2+)

- **X / Twitter** ([x.com](https://x.com)) — Organic marketing and audience building
- Social media automation tools — can be added later when you have content to post

> **You do NOT need Stripe on Day 1.** Robo Co-op can receive payments on your behalf initially. Set up your own Stripe or Wise when you're ready.

> **You do NOT need a custom domain.** Use your free Vercel URL (e.g., `my-startup.vercel.app`) for Month 1. Custom domains via Cloudflare can wait.

---

## Managing Your Keys Safely

### Option A: Manual File Editing (Free — Recommended for Day 1)

The simplest approach: edit `.env.local` directly in a text editor.

1. Open your project folder on your computer
2. Find `.env.local` (it may be hidden — enable "show hidden files" in your file explorer)
3. Open it with any text editor (Notepad, TextEdit, VS Code, etc.)
4. Paste your keys directly
5. Save the file

**Advantage:** Keys never pass through the AI conversation at all.

### Option B: 1Password CLI ($3.99/month)

For ongoing key management, 1Password CLI lets you store and reference secrets securely.

#### Setup

1. Subscribe to [1Password](https://1password.com) Individual plan ($3.99/month)
2. Install the 1Password desktop app
3. Install the CLI:
   - **Windows:** `winget install AgileBits.1Password.CLI`
   - **Mac:** `brew install 1password-cli`
   - **Linux:** See [1password.com/downloads/command-line](https://1password.com/downloads/command-line)
4. Sign in: `op signin`

#### Store your keys

```bash
# Create a vault item for StartupRobos
op item create --category=API_Credential \
  --title="StartupRobos" \
  --vault="Private" \
  'Supabase URL=https://abcdefgh.supabase.co' \
  'Supabase Anon Key=eyJ...' \
  'Supabase Service Role Key=eyJ...' \
  'Anthropic API Key=sk-ant-...'
```

#### Use your keys

```bash
# Read a single key
op read "op://Private/StartupRobos/Anthropic API Key"

# Generate .env.local from 1Password (uses op read — never put raw keys here)
cat > .env.local << EOF
NEXT_PUBLIC_SUPABASE_URL=$(op read "op://Private/StartupRobos/Supabase URL")
NEXT_PUBLIC_SUPABASE_ANON_KEY=$(op read "op://Private/StartupRobos/Supabase Anon Key")
SUPABASE_SERVICE_ROLE_KEY=$(op read "op://Private/StartupRobos/Supabase Service Role Key")
ANTHROPIC_API_KEY=$(op read "op://Private/StartupRobos/Anthropic API Key")
CRON_SECRET=$(openssl rand -hex 32)
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOF
```

#### Rotate keys

When you need to update a key (recommended every 90 days):

1. Generate a new key in the service's dashboard
2. Update 1Password: `op item edit "StartupRobos" 'Anthropic API Key=sk-ant-NEW...'`
3. Regenerate `.env.local` using the script above
4. Update Vercel: go to Settings → Environment Variables → update the changed key
5. Redeploy on Vercel

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Unauthorized" error | Check that `.env.local` exists and all keys are correct |
| Dashboard is blank | Make sure you ran both SQL files in Supabase (schema.sql + migration) |
| Heartbeat not running | Check Vercel dashboard → Settings → Cron Jobs. Should show 3 jobs |
| "Module not found" error | Run `npm install` in your project directory |
| Claude Desktop can't find repo | Make sure you pasted the full GitHub URL including `https://` |
| Supabase "permission denied" | Check that your service_role key (not anon key) is in `SUPABASE_SERVICE_ROLE_KEY` |
| Vercel build fails | Check that all environment variables are set. Most common: missing `NEXT_PUBLIC_SUPABASE_URL` |

---

## What Happens Next

Once everything is deployed:

1. **Claude Desktop greets you** and asks your name, languages, and country
2. **The CEO Agent (AI) picks 3 businesses** optimized for your language and location
3. **You approve the plan** — this is the last decision you need to make
4. **CXO agents build and run everything** — code, content, deployment, marketing
5. **You receive daily reports** — check your dashboard or email
6. **Experiments run automatically** — the AI tests hypotheses and adapts

Your only job: read the reports and redirect when you want to.

---

*This guide is part of [StartupRobos](https://github.com/Robo-Co-op/StartupRobos) — AI CXO Startup Platform for refugees. MIT License.*
