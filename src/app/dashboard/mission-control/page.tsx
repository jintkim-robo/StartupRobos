export const dynamic = 'force-dynamic'

/** Co-op Lab 2.0 — one live revenue experiment (+ parked hypotheses). */
const LIVE_EXPERIMENT = {
  id: 1,
  name: 'Human QA',
  nameAr: 'مراجعة بشرية لمخرجات الذكاء الاصطناعي',
  template: 'human_qa',
  templateLabel: 'Human QA (Core)',
  color: '#10b981',
  bg: 'rgba(16, 185, 129, 0.1)',
  status: 'live',
  url: null as string | null,
  goals: {
    scout: 'اكتشاف مشترين لديهم عبء مراجعة/تحقق متكرر — إشارات طلب واردة',
    seller: 'مسودة العرض والتسعير؛ تواصل مع العملاء فقط بعد موافقة بشرية + دليل',
    builder: 'تسليم سير عمل QA المباع (قائمة تحقق، معايير، أدوات خفيفة)',
    operator: 'جدولة التسليم وحلقة الاحتفاظ؛ مرشحو الأتمتة بعد ~3 عمليات متطابقة',
  },
  experiments: [
    { id: 1, hypothesis: 'حجز اكتشاف مدفوع ($299) أو أول مهمة QA → قياس Time to First $1', status: 'pending' },
    { id: 2, hypothesis: 'تسليم 3 سير عمل QA متطابقة → كتابة SOP → قائمة أتمتة', status: 'pending' },
    { id: 3, hypothesis: 'عميل ثانٍ دافع (يفضّل خارجي) → دليل احتفاظ لمسار التخرج', status: 'pending' },
  ],
}

const PARKED = [
  { name: 'Vertical automation niche', nameAr: 'أتمتة عمودية متخصصة', note: 'فرضية موقوفة — بلا بناء/تشغيل موازٍ' },
  { name: 'Content Factory', nameAr: 'مصنع المحتوى', note: 'Experimental — ليست افتراض Day-1' },
]

const WEEKLY_SCHEDULE = [
  { day: 'الاثنين', focus: 'Scout: إشارات الطلب وقائمة مختصرة لل niches', agent: 'Scout' },
  { day: 'الثلاثاء', focus: 'Seller: مسودة العرض والتسعير وحزمة التواصل (بانتظار الموافقة)', agent: 'Seller' },
  { day: 'الأربعاء', focus: 'Builder: أصول التسليم لسير العمل المباع', agent: 'Builder' },
  { day: 'الخميس', focus: 'Operator: تشغيل التسليم + حزمة الأدلة', agent: 'Operator' },
  { day: 'الجمعة', focus: 'مراجعة الميزانية وتقييم التجربة (قتل/إيقاف/تخرّج)', agent: 'Seller + Revenue Coord.' },
  { day: 'السبت', focus: 'مرشحو الأتمتة وإصلاح التسليم', agent: 'Builder + Operator' },
  { day: 'الأحد', focus: 'تقرير أسبوعي وتخطيط الأسبوع القادم', agent: 'Revenue Coord.' },
]

const AGENT_COLORS: Record<string, string> = {
  Scout: '#ec4899',
  Seller: '#22c55e',
  Builder: '#3b82f6',
  Operator: '#f97316',
  'Revenue Coord.': '#f59e0b',
  'Seller + Revenue Coord.': '#84cc16',
  'Builder + Operator': '#06b6d4',
}

export default function MissionControlPage() {
  const biz = LIVE_EXPERIMENT
  return (
    <div className="flex flex-col min-h-0 overflow-auto">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#1c1c22] flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-[15px] font-semibold tracking-tight">Mission Control</h1>
          <p className="text-[11px] text-zinc-600 mt-0.5">
            Revenue Operator — تجربة إيرادات واحدة مباشرة — آخر تحديث: 2026-09-13
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[11px] text-zinc-500">1 تجربة مباشرة</span>
        </div>
      </div>

      <div className="flex-1 px-6 py-5 space-y-6">
        {/* Live experiment */}
        <div className="card p-5 space-y-4" style={{ animation: 'fadeIn 0.3s ease-out both' }}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold shrink-0"
                style={{ backgroundColor: biz.bg, color: biz.color }}
              >
                {biz.id}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-[14px] font-semibold tracking-tight">{biz.name}</h2>
                  <span className="text-[11px] text-zinc-500">— {biz.nameAr}</span>
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <span
                    className="text-[9px] px-1.5 py-0.5 rounded font-medium"
                    style={{ backgroundColor: biz.bg, color: biz.color }}
                  >
                    {biz.templateLabel}
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded font-medium bg-green-500/10 text-green-400">
                    {biz.status}
                  </span>
                </div>
              </div>
            </div>
            {biz.url && (
              <a
                href={biz.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-zinc-600 hover:text-zinc-300 flex items-center gap-1 transition-colors shrink-0"
              >
                <span className="w-1 h-1 rounded-full bg-green-500/60" />
                live
                <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <GoalCard icon="🔎" label="Scout" text={biz.goals.scout} color={biz.color} />
            <GoalCard icon="💼" label="Seller" text={biz.goals.seller} color={biz.color} />
            <GoalCard icon="🛠️" label="Builder" text={biz.goals.builder} color={biz.color} />
            <GoalCard icon="⚙️" label="Operator" text={biz.goals.operator} color={biz.color} />
          </div>

          <div>
            <p className="text-[10px] text-zinc-600 font-semibold uppercase tracking-wider mb-2">Experiments</p>
            <div className="space-y-1.5">
              {biz.experiments.map((exp) => (
                <div key={exp.id} className="flex items-start gap-2.5 px-3 py-2 rounded-md bg-[#111113]">
                  <span className="text-[9px] font-mono text-zinc-600 mt-0.5 shrink-0">#{exp.id}</span>
                  <p className="text-[11px] text-zinc-400 flex-1">{exp.hypothesis}</p>
                  <StatusBadge status={exp.status} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Parked hypotheses */}
        <div className="card p-5">
          <p className="text-[10px] text-zinc-600 font-semibold uppercase tracking-wider mb-3">
            فرضيات موقوفة (ليست مباشرة)
          </p>
          <div className="space-y-1.5">
            {PARKED.map((p) => (
              <div key={p.name} className="flex items-start gap-2.5 px-3 py-2 rounded-md bg-[#111113]">
                <span className="text-[9px] px-1.5 py-0.5 rounded font-medium bg-zinc-800 text-zinc-500 shrink-0">
                  parked
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-zinc-300">
                    {p.name} <span className="text-zinc-600">— {p.nameAr}</span>
                  </p>
                  <p className="text-[10px] text-zinc-600 mt-0.5">{p.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Schedule */}
        <div className="card p-5">
          <p className="text-[10px] text-zinc-600 font-semibold uppercase tracking-wider mb-3">
            الجدول الأسبوعي — تجربة واحدة
          </p>
          <div className="space-y-1">
            {WEEKLY_SCHEDULE.map((row) => {
              const agentColor = AGENT_COLORS[row.agent] ?? '#6b7280'
              return (
                <div
                  key={row.day}
                  className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#111113] transition-colors"
                >
                  <span className="text-[11px] text-zinc-500 w-16 shrink-0">{row.day}</span>
                  <span className="text-[11px] text-zinc-300 flex-1">{row.focus}</span>
                  <span
                    className="text-[9px] px-2 py-0.5 rounded-full font-medium shrink-0"
                    style={{ backgroundColor: agentColor + '20', color: agentColor }}
                  >
                    {row.agent}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Budget */}
        <div className="card p-5">
          <p className="text-[10px] text-zinc-600 font-semibold uppercase tracking-wider mb-3">الميزانية الشهرية</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <BudgetItem label="الميزانية الكلية" value="$500" color="#a855f7" />
            <BudgetItem label="تم الإنفاق" value="$0" color="#22c55e" />
            <BudgetItem label="المتبقي" value="$500" color="#3b82f6" />
            <BudgetItem label="حد التنبيه" value="$400 (80%)" color="#f59e0b" />
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-[10px] text-zinc-600 mb-1">
              <span>0% مستخدم</span>
              <span>$0 / $500</span>
            </div>
            <div className="h-1.5 bg-[#1c1c22] rounded-full overflow-hidden">
              <div className="h-full w-0 bg-purple-500 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function GoalCard({ icon, label, text, color }: { icon: string; label: string; text: string; color: string }) {
  return (
    <div className="bg-[#111113] rounded-lg p-3 space-y-1.5">
      <p className="text-[10px] font-semibold" style={{ color }}>
        {icon} {label}
      </p>
      <p className="text-[11px] text-zinc-400 leading-relaxed">{text}</p>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string }> = {
    pending: { label: 'معلق', className: 'bg-zinc-800 text-zinc-500' },
    running: { label: 'جارٍ', className: 'bg-blue-500/10 text-blue-400' },
    success: { label: 'نجح', className: 'bg-green-500/10 text-green-400' },
    failed: { label: 'فشل', className: 'bg-red-500/10 text-red-400' },
  }
  const s = map[status] ?? map.pending
  return (
    <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium shrink-0 ${s.className}`}>{s.label}</span>
  )
}

function BudgetItem({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="bg-[#111113] rounded-lg p-3">
      <p className="text-[9px] text-zinc-600 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-[16px] font-semibold" style={{ color }}>{value}</p>
    </div>
  )
}
