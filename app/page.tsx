'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  Activity,
  AlertCircle,
  ArrowDownToLine,
  ArrowUpRight,
  BarChart3,
  Bell,
  Bot,
  Box,
  Check,
  ChevronDown,
  CircleDot,
  Clock3,
  Code2,
  Command,
  Database,
  GitBranch,
  GitCommitHorizontal,
  GitPullRequest,
  LayoutDashboard,
  LineChart,
  ListFilter,
  MoreHorizontal,
  Moon,
  Package,
  Plus,
  RefreshCw,
  Rocket,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Sun,
  Terminal,
  TrendingUp,
  Users,
  X,
  Zap,
} from 'lucide-react'

type Section = 'Overview' | 'Issues' | 'Projects' | 'Pull Requests' | 'Deployments' | 'Analytics' | 'AI Insights' | 'Settings'

type Issue = { id: string; title: string; project: string; status: 'In progress' | 'Open' | 'Done'; priority: 'High' | 'Medium' | 'Low'; assignee: string; initials: string; tone: string; updated: string }

const navItems: { label: Section; icon: typeof LayoutDashboard; count?: number }[] = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Issues', icon: CircleDot, count: 12 },
  { label: 'Projects', icon: Box },
  { label: 'Pull Requests', icon: GitPullRequest, count: 4 },
  { label: 'Deployments', icon: Rocket },
  { label: 'Analytics', icon: LineChart },
  { label: 'AI Insights', icon: Sparkles },
]

const issues: Issue[] = [
  { id: 'ENG-142', title: 'Improve API response caching', project: 'Platform API', status: 'In progress', priority: 'High', assignee: 'Maya Chen', initials: 'MC', tone: 'bg-accent', updated: '18m ago' },
  { id: 'ENG-141', title: 'Update billing webhook retries', project: 'Payments', status: 'Open', priority: 'Medium', assignee: 'Noah Williams', initials: 'NW', tone: 'bg-primary', updated: '42m ago' },
  { id: 'ENG-139', title: 'Add keyboard navigation to command menu', project: 'Dashboard', status: 'Open', priority: 'Low', assignee: 'Ava Rodriguez', initials: 'AR', tone: 'bg-muted-foreground', updated: '2h ago' },
  { id: 'ENG-137', title: 'Migrate image processing worker', project: 'Media', status: 'Done', priority: 'Medium', assignee: 'Liam Johnson', initials: 'LJ', tone: 'bg-primary', updated: '4h ago' },
]

const projects = [
  { name: 'Platform API', key: 'PLAT', progress: 74, status: 'On track', issues: 18, color: 'bg-primary' },
  { name: 'Dashboard', key: 'DASH', progress: 62, status: 'At risk', issues: 9, color: 'bg-accent' },
  { name: 'Mobile app', key: 'MOB', progress: 38, status: 'On track', issues: 14, color: 'bg-muted-foreground' },
]

const activity = [
  { icon: GitPullRequest, title: 'Maya Chen merged PR #482', detail: 'Improve edge cache invalidation', time: '12 min ago', color: 'text-primary' },
  { icon: Rocket, title: 'Production deployment succeeded', detail: 'release/v2.18.0 · 32s build time', time: '28 min ago', color: 'text-primary' },
  { icon: CircleDot, title: 'Issue ENG-142 was assigned', detail: 'Improve API response caching', time: '41 min ago', color: 'text-accent-foreground' },
  { icon: GitCommitHorizontal, title: 'Noah Williams pushed 3 commits', detail: 'feature/payment-retry-policy', time: '1 hr ago', color: 'text-muted-foreground' },
]

function StatusBadge({ children, kind = 'neutral' }: { children: React.ReactNode; kind?: 'success' | 'warning' | 'danger' | 'neutral' | 'info' }) {
  return <span className={`status-badge status-${kind}`}><span className="status-dot" />{children}</span>
}

function MetricCard({ label, value, change, icon: Icon, tone }: { label: string; value: string; change: string; icon: typeof Activity; tone: string }) {
  return <div className="metric-card">
    <div className="metric-top"><span>{label}</span><span className={`metric-icon ${tone}`}><Icon size={15} /></span></div>
    <div className="metric-value">{value}</div>
    <div className="metric-change"><TrendingUp size={13} /> {change} <span className="muted">vs last week</span></div>
  </div>
}

export default function Page() {
  const [section, setSection] = useState<Section>('Overview')
  const [query, setQuery] = useState('')
  const [issueFilter, setIssueFilter] = useState('All issues')
  const [showCreate, setShowCreate] = useState(false)
  const [notice, setNotice] = useState('')
  const [refreshing, setRefreshing] = useState(false)
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    document.documentElement.classList.toggle('light', !isDark)
  }, [isDark])

  const filteredIssues = useMemo(() => issues.filter((issue) => {
    const matchesQuery = `${issue.title} ${issue.id} ${issue.project}`.toLowerCase().includes(query.toLowerCase())
    const matchesFilter = issueFilter === 'All issues' || issue.status === issueFilter
    return matchesQuery && matchesFilter
  }), [query, issueFilter])

  function showNotice(message: string) {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 3200)
  }

  function refreshData() {
    setRefreshing(true)
    window.setTimeout(() => { setRefreshing(false); showNotice('Workspace data is up to date') }, 800)
  }

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark"><Zap size={16} /></div><span>Engineering Flow</span></div>
      <button className="workspace-switcher" onClick={() => showNotice('Workspace switcher opened')}><div className="workspace-avatar">A</div><div className="workspace-copy"><strong>Acme Technologies</strong><span>Engineering workspace</span></div><ChevronDown size={14} /></button>
      <div className="sidebar-label">Workspace</div>
      <nav className="side-nav" aria-label="Workspace navigation">{navItems.map(({ label, icon: Icon, count }) => <button key={label} className={section === label ? 'nav-item active' : 'nav-item'} onClick={() => setSection(label)}><Icon size={17} /><span>{label}</span>{count && <span className="nav-count">{count}</span>}</button>)}</nav>
      <div className="sidebar-label sidebar-label-bottom">Manage</div>
      <button className={section === 'Settings' ? 'nav-item active' : 'nav-item'} onClick={() => setSection('Settings')}><Settings size={17} /><span>Settings</span></button>
      <div className="sidebar-bottom"><div className="upgrade-card"><div className="upgrade-icon"><Sparkles size={15} /></div><strong>Ship with confidence</strong><p>Unlock advanced insights and automation.</p><button onClick={() => showNotice('Upgrade options opened')}>Explore plans <ArrowUpRight size={13} /></button></div><div className="user-row"><div className="user-avatar">JD</div><div><strong>Jordan Davis</strong><span>Admin</span></div><MoreHorizontal size={16} className="muted" /></div></div>
    </aside>

    <main className="main-content">
      <header className="topbar"><div className="breadcrumb"><span>Acme Technologies</span><span className="breadcrumb-sep">/</span><strong>{section}</strong></div><div className="top-actions"><label className="search-box"><Search size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search anything..." aria-label="Search workspace" /><kbd><Command size={11} /> K</kbd></label><button className="icon-button" aria-label="Notifications" onClick={() => showNotice('You are all caught up')}><Bell size={17} /><span className="notification-dot" /></button><button className="theme-toggle" aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'} onClick={() => setIsDark((value) => !value)}>{isDark ? <Moon size={16} /> : <Sun size={16} />}<span>{isDark ? 'Dark' : 'Light'}</span></button><button className="help-button" onClick={() => showNotice('Help center opened')}>?</button></div></header>
      <div className="content-wrap">
        {section === 'Overview' && <Overview onNavigate={setSection} onCreate={() => setShowCreate(true)} onRefresh={refreshData} refreshing={refreshing} filteredIssues={filteredIssues} />}
        {section === 'Issues' && <Issues issues={filteredIssues} filter={issueFilter} setFilter={setIssueFilter} onCreate={() => setShowCreate(true)} onNotice={showNotice} />}
        {section === 'Projects' && <Projects onNotice={showNotice} />}
        {section === 'Pull Requests' && <PullRequests onNotice={showNotice} />}
        {section === 'Deployments' && <Deployments onNotice={showNotice} />}
        {section === 'Analytics' && <AnalyticsSection />}
        {section === 'AI Insights' && <Insights onNotice={showNotice} />}
        {section === 'Settings' && <SettingsSection onNotice={showNotice} />}
      </div>
    </main>
    {notice && <div className="toast"><Check size={15} />{notice}</div>}
    {showCreate && <div className="modal-backdrop" onMouseDown={() => setShowCreate(false)}><div className="modal-card" onMouseDown={(e) => e.stopPropagation()}><div className="modal-header"><div><h2>Create issue</h2><p>Add a trackable task to the workspace.</p></div><button className="icon-button" onClick={() => setShowCreate(false)} aria-label="Close"><X size={17} /></button></div><label className="field"><span>Title</span><input autoFocus placeholder="What needs to be done?" /></label><label className="field"><span>Project</span><select defaultValue="Platform API"><option>Platform API</option><option>Dashboard</option><option>Mobile app</option></select></label><div className="modal-actions"><button className="button secondary" onClick={() => setShowCreate(false)}>Cancel</button><button className="button primary" onClick={() => { setShowCreate(false); showNotice('Issue created successfully') }}><Plus size={15} /> Create issue</button></div></div></div>}
  </div>
}

function PageHeader({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description: string; action?: React.ReactNode }) { return <div className="page-header"><div><div className="eyebrow">{eyebrow || 'Workspace overview'}</div><h1>{title}</h1><p>{description}</p></div>{action}</div> }

function Overview({ onNavigate, onCreate, onRefresh, refreshing, filteredIssues }: { onNavigate: (s: Section) => void; onCreate: () => void; onRefresh: () => void; refreshing: boolean; filteredIssues: Issue[] }) {
  return <>
    <PageHeader title="Good morning, Jordan" description="Here’s what’s happening across your engineering workspace." action={<div className="header-actions"><button className="button secondary" onClick={onRefresh}><RefreshCw className={refreshing ? 'spin' : ''} size={15} /> Refresh</button><button className="button primary" onClick={onCreate}><Plus size={15} /> Create issue</button></div>} />
    <div className="metrics-grid"><MetricCard label="Open issues" value="42" change="12.5%" icon={CircleDot} tone="tone-blue" /><MetricCard label="Active projects" value="8" change="2 new" icon={Box} tone="tone-purple" /><MetricCard label="Deployments" value="126" change="18.4%" icon={Rocket} tone="tone-green" /><MetricCard label="Team members" value="24" change="4.2%" icon={Users} tone="tone-orange" /></div>
    <div className="dashboard-grid top-grid"><section className="panel activity-panel"><div className="panel-header"><div><h2>Recent activity</h2><p>Latest updates from your team</p></div><button className="text-button" onClick={() => onNavigate('Issues')}>View all <ArrowUpRight size={14} /></button></div><div className="activity-list">{activity.map(({ icon: Icon, title, detail, time, color }) => <div className="activity-item" key={title}><div className={`activity-icon ${color}`}><Icon size={16} /></div><div className="activity-copy"><strong>{title}</strong><span>{detail}</span></div><time>{time}</time></div>)}</div></section><section className="panel deploy-panel"><div className="panel-header"><div><h2>Deployment health</h2><p>Last 7 days</p></div><StatusBadge kind="success">Healthy</StatusBadge></div><div className="health-score"><div className="health-number">98.6<span>%</span></div><div className="health-copy"><strong>Excellent</strong><span>Successful deployment rate</span></div></div><div className="sparkline" aria-label="Deployment health trend">{[42, 58, 52, 68, 62, 79, 74, 86, 80, 92, 88, 96, 93, 98].map((height, i) => <span key={i} style={{ height: `${height}%` }} />)}</div><div className="deploy-meta"><span><i className="legend-dot success-dot" />Successful <strong>124</strong></span><span><i className="legend-dot fail-dot" />Failed <strong>2</strong></span></div></section></div>
    <div className="dashboard-grid bottom-grid"><section className="panel issues-panel"><div className="panel-header"><div><h2>Priority issues</h2><p>Issues that need your attention</p></div><button className="text-button" onClick={() => onNavigate('Issues')}>View all <ArrowUpRight size={14} /></button></div><div className="issue-table"><div className="table-head"><span>Issue</span><span>Status</span><span>Priority</span><span>Assignee</span></div>{filteredIssues.slice(0, 4).map((issue) => <div className="table-row" key={issue.id}><div className="issue-title"><span className="issue-id">{issue.id}</span><strong>{issue.title}</strong><small>{issue.project}</small></div><StatusBadge kind={issue.status === 'Done' ? 'success' : issue.status === 'In progress' ? 'info' : 'neutral'}>{issue.status}</StatusBadge><span className={`priority priority-${issue.priority.toLowerCase()}`}><span />{issue.priority}</span><div className="assignee"><span className={`mini-avatar ${issue.tone}`}>{issue.initials}</span><span>{issue.assignee.split(' ')[0]}</span></div></div>)}</div></section><section className="panel project-panel"><div className="panel-header"><div><h2>Projects</h2><p>Progress across active work</p></div><button className="text-button" onClick={() => onNavigate('Projects')}>View all <ArrowUpRight size={14} /></button></div><div className="project-list">{projects.map((project) => <div className="project-item" key={project.key}><div className="project-heading"><span className={`project-icon ${project.color}`}>{project.key.slice(0, 1)}</span><div><strong>{project.name}</strong><span>{project.issues} open issues</span></div><span className="project-progress">{project.progress}%</span></div><div className="progress-track"><span style={{ width: `${project.progress}%` }} /></div><div className="project-status"><StatusBadge kind={project.status === 'At risk' ? 'warning' : 'success'}>{project.status}</StatusBadge><span>Updated today</span></div></div>)}</div></section></div>
  </>
}

function Issues({ issues, filter, setFilter, onCreate, onNotice }: { issues: Issue[]; filter: string; setFilter: (f: string) => void; onCreate: () => void; onNotice: (s: string) => void }) { return <><PageHeader eyebrow="Workspace / Issues" title="Issues" description="Track work, prioritize blockers, and keep your team moving." action={<button className="button primary" onClick={onCreate}><Plus size={15} /> Create issue</button>} /><div className="toolbar"><div className="filter-tabs">{['All issues', 'Open', 'In progress', 'Done'].map((item) => <button className={filter === item ? 'filter-tab selected' : 'filter-tab'} onClick={() => setFilter(item)} key={item}>{item}</button>)}</div><button className="button secondary" onClick={() => onNotice('Advanced filters opened')}><ListFilter size={15} /> Filter</button></div><section className="panel full-panel"><div className="issue-table large"><div className="table-head"><span>Issue</span><span>Status</span><span>Priority</span><span>Assignee</span></div>{issues.map((issue) => <div className="table-row" key={issue.id}><div className="issue-title"><span className="issue-id">{issue.id}</span><strong>{issue.title}</strong><small>{issue.project} · Updated {issue.updated}</small></div><StatusBadge kind={issue.status === 'Done' ? 'success' : issue.status === 'In progress' ? 'info' : 'neutral'}>{issue.status}</StatusBadge><span className={`priority priority-${issue.priority.toLowerCase()}`}><span />{issue.priority}</span><div className="assignee"><span className={`mini-avatar ${issue.tone}`}>{issue.initials}</span><span>{issue.assignee}</span><MoreHorizontal size={16} className="muted" /></div></div>)}</div></section></> }

function Projects({ onNotice }: { onNotice: (s: string) => void }) { return <><PageHeader eyebrow="Workspace / Projects" title="Projects" description="A shared view of delivery progress across every team." action={<button className="button primary" onClick={() => onNotice('Project creation started')}><Plus size={15} /> New project</button>} /><div className="project-cards">{projects.concat({ name: 'Design system', key: 'DS', progress: 86, status: 'On track', issues: 5, color: 'bg-muted-foreground' }).map((project) => <div className="project-card panel" key={project.key}><div className="project-card-top"><span className={`project-icon large ${project.color}`}>{project.key.slice(0, 1)}</span><button className="icon-button"><MoreHorizontal size={16} /></button></div><h2>{project.name}</h2><p>Shared workspace for {project.name.toLowerCase()} planning and delivery.</p><div className="project-card-progress"><span><strong>{project.progress}%</strong> complete</span><span>{project.issues} open issues</span></div><div className="progress-track"><span style={{ width: `${project.progress}%` }} /></div><div className="project-status"><StatusBadge kind={project.status === 'At risk' ? 'warning' : 'success'}>{project.status}</StatusBadge><span>24 contributors</span></div></div>)}</div></> }

function PullRequests({ onNotice }: { onNotice: (s: string) => void }) { const prs = [['#482', 'Improve edge cache invalidation', 'Maya Chen', '2 checks passed', '12m ago'], ['#481', 'Add retry policy to billing webhooks', 'Noah Williams', '3 checks passed', '42m ago'], ['#478', 'Refactor dashboard query hooks', 'Ava Rodriguez', 'Review requested', '2h ago'], ['#476', 'Update mobile navigation patterns', 'Liam Johnson', '2 checks passed', '4h ago']]; return <><PageHeader eyebrow="Workspace / Pull requests" title="Pull requests" description="Review, collaborate, and ship changes with confidence." action={<button className="button primary" onClick={() => onNotice('Pull request flow opened')}><Plus size={15} /> New pull request</button>} /><section className="panel full-panel"><div className="panel-header"><div><h2>Open pull requests <span className="count-pill">4</span></h2><p>Changes waiting for review or merge</p></div><button className="button secondary" onClick={() => onNotice('Pull request filters opened')}><ListFilter size={15} /> Filter</button></div><div className="pr-list">{prs.map(([id, title, author, checks, time]) => <div className="pr-row" key={id}><div className="pr-icon"><GitPullRequest size={17} /></div><div className="pr-copy"><strong>{title}</strong><span>{id} · opened by {author} · {time}</span></div><StatusBadge kind={checks.includes('passed') ? 'success' : 'warning'}>{checks}</StatusBadge><button className="button secondary compact" onClick={() => onNotice(`${id} opened`)}>Review</button></div>)}</div></section></> }

function Deployments({ onNotice }: { onNotice: (s: string) => void }) { return <><PageHeader eyebrow="Workspace / Deployments" title="Deployments" description="Monitor releases and keep production healthy." action={<button className="button primary" onClick={() => onNotice('Deployment started')}><Rocket size={15} /> Deploy</button>} /><div className="deploy-overview"><div className="panel deploy-stat"><span className="metric-icon tone-green"><ShieldCheck size={16} /></span><strong>98.6%</strong><span>Success rate</span></div><div className="panel deploy-stat"><span className="metric-icon tone-blue"><Clock3 size={16} /></span><strong>4m 12s</strong><span>Average build time</span></div><div className="panel deploy-stat"><span className="metric-icon tone-purple"><GitBranch size={16} /></span><strong>18</strong><span>Active branches</span></div></div><section className="panel full-panel"><div className="panel-header"><div><h2>Recent deployments</h2><p>Production and preview environments</p></div><button className="button secondary" onClick={() => onNotice('Deployment list refreshed')}><RefreshCw size={15} /> Refresh</button></div><div className="deployment-list">{[['v2.18.0', 'release/v2.18.0', 'Production', 'Succeeded', 'Maya Chen', '28m ago'], ['v2.17.4', 'fix/payment-retry', 'Preview', 'Succeeded', 'Noah Williams', '2h ago'], ['v2.17.3', 'main', 'Production', 'Succeeded', 'Ava Rodriguez', '5h ago'], ['v2.17.2', 'fix/mobile-nav', 'Preview', 'Failed', 'Liam Johnson', '8h ago']].map(([version, branch, env, status, author, time]) => <div className="deployment-row" key={version}><div className="deploy-icon"><Rocket size={16} /></div><div className="deploy-copy"><strong>{version}</strong><span>{branch} · {env}</span></div><StatusBadge kind={status === 'Succeeded' ? 'success' : 'danger'}>{status}</StatusBadge><div className="deploy-author"><span className="mini-avatar tone-blue">{author.split(' ').map((n) => n[0]).join('')}</span>{author}</div><span className="muted">{time}</span><button className="icon-button"><MoreHorizontal size={16} /></button></div>)}</div></section></> }

function AnalyticsSection() { return <><PageHeader eyebrow="Workspace / Analytics" title="Engineering analytics" description="Understand how your team delivers and where to improve." action={<button className="button secondary"><ArrowDownToLine size={15} /> Export report</button>} /><div className="analytics-grid"><section className="panel chart-panel"><div className="panel-header"><div><h2>Cycle time</h2><p>Average time from first commit to deployment</p></div><StatusBadge kind="success">-18.4%</StatusBadge></div><div className="big-stat">2.4 <span>days</span></div><div className="chart"><div className="chart-y"><span>4d</span><span>3d</span><span>2d</span><span>1d</span><span>0</span></div><div className="chart-area"><div className="chart-grid" /> <svg viewBox="0 0 600 180" preserveAspectRatio="none" aria-label="Cycle time trend"><path d="M0,120 C45,105 65,130 100,92 S160,112 200,82 S260,98 300,70 S360,89 400,60 S460,78 500,45 S555,58 600,28" fill="none" stroke="currentColor" strokeWidth="3" /><path d="M0,120 C45,105 65,130 100,92 S160,112 200,82 S260,98 300,70 S360,89 400,60 S460,78 500,45 S555,58 600,28 L600,180 L0,180Z" fill="currentColor" opacity=".08" /></svg><div className="chart-x"><span>May 12</span><span>May 19</span><span>May 26</span><span>Jun 2</span><span>Jun 9</span></div></div></div></section><section className="panel insight-stat-panel"><div className="panel-header"><div><h2>Delivery health</h2><p>Across your engineering team</p></div><BarChart3 size={17} className="muted" /></div><div className="health-row"><span>Deployment frequency</span><strong>4.8 / week</strong><div className="health-bar"><i style={{ width: '82%' }} /></div></div><div className="health-row"><span>Lead time for changes</span><strong>2.4 days</strong><div className="health-bar"><i style={{ width: '68%' }} /></div></div><div className="health-row"><span>Change failure rate</span><strong>1.6%</strong><div className="health-bar"><i style={{ width: '94%' }} /></div></div><div className="health-row"><span>Time to restore</span><strong>38 min</strong><div className="health-bar"><i style={{ width: '76%' }} /></div></div></section></div></> }

function Insights({ onNotice }: { onNotice: (s: string) => void }) { return <><PageHeader eyebrow="Workspace / AI insights" title="AI insights" description="Signals and recommendations generated from your delivery data." action={<button className="button primary" onClick={() => onNotice('Insight report generated')}><Sparkles size={15} /> Generate report</button>} /><div className="insight-hero panel"><div className="ai-orb"><Sparkles size={22} /></div><div><span className="eyebrow">Weekly engineering brief</span><h2>Your team is shipping faster than last week.</h2><p>Cycle time is down 18.4% and deployment frequency is up. The biggest opportunity is reducing review wait time on the Dashboard project.</p></div><button className="button secondary" onClick={() => onNotice('Brief marked as read')}>Mark as read</button></div><div className="insight-grid">{[['Review wait time is rising', 'PRs on Dashboard are waiting 1.4 days longer than average.', 'Medium', Clock3], ['API cache work is high impact', 'ENG-142 could reduce p95 latency by an estimated 22%.', 'High', Zap], ['Deployment health is excellent', 'Production has had 124 successful releases this week.', 'Positive', ShieldCheck]].map(([title, copy, level, Icon]) => <div className="panel insight-card" key={title as string}><div className="insight-card-top"><span className="metric-icon tone-purple"><Icon size={16} /></span><StatusBadge kind={level === 'High' ? 'danger' : level === 'Positive' ? 'success' : 'warning'}>{level as string}</StatusBadge></div><h3>{title as string}</h3><p>{copy as string}</p><button className="text-button" onClick={() => onNotice('Insight details opened')}>View recommendation <ArrowUpRight size={14} /></button></div>)}</div></> }

function SettingsSection({ onNotice }: { onNotice: (s: string) => void }) { return <><PageHeader eyebrow="Workspace / Settings" title="Settings" description="Manage workspace preferences, members, and integrations." /><div className="settings-layout"><div className="settings-nav">{['General', 'Members', 'Integrations', 'Notifications', 'Security'].map((item, i) => <button className={i === 0 ? 'settings-tab active' : 'settings-tab'} key={item}>{item}</button>)}</div><section className="panel settings-panel"><div className="panel-header"><div><h2>General settings</h2><p>Configure the basics for your workspace.</p></div><button className="button primary" onClick={() => onNotice('Settings saved')}>Save changes</button></div><div className="settings-fields"><label className="field"><span>Workspace name</span><input defaultValue="Acme Technologies" /></label><label className="field"><span>Workspace URL</span><div className="input-with-prefix"><span>engineering.flow/</span><input defaultValue="acme" /></div></label><label className="field"><span>Default timezone</span><select defaultValue="Pacific Time"><option>Pacific Time</option><option>Eastern Time</option><option>UTC</option></select></label></div><div className="settings-divider" /><div className="settings-row"><div><strong>Weekly engineering brief</strong><p>Receive an AI-generated summary every Monday morning.</p></div><button className="toggle on" onClick={(e) => e.currentTarget.classList.toggle('on')}><span /></button></div><div className="settings-row"><div><strong>Deployment notifications</strong><p>Get notified when a production deployment succeeds or fails.</p></div><button className="toggle on" onClick={(e) => e.currentTarget.classList.toggle('on')}><span /></button></div></section></div></> }
