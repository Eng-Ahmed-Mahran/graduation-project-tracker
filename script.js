/**
 * ============================================================================
 * PROJECT NEXUS: Stage Tracker & Automated Team Accountant
 * Architecture: Vanilla JavaScript (ES6+), Modular & Reactive State
 * Ready for GitHub Pages deployment & Firebase Cloud Sync
 * ============================================================================
 */

/* ============================================================================
   1. DEFAULT DATA DEFINITIONS (Realistic Graduation Project Mock Data)
   ============================================================================ */

/**
 * 6 Fixed Team Member Profiles
 * Represents the 6 engineering teammates working on the graduation project.
 */
const DEFAULT_TEAM_MEMBERS = [
  { id: 'm1', name: 'Ahmed Mahran', role: 'Hardware & Systems Lead', color: '#38bdf8' },
  { id: 'm2', name: 'Omar Khaled', role: 'Embedded Firmware & IoT', color: '#818cf8' },
  { id: 'm3', name: 'Youssef Hassan', role: 'Mechanical & 3D Fabrication', color: '#34d399' },
  { id: 'm4', name: 'Mohamed Saeed', role: 'Power Electronics & PCB', color: '#fbbf24' },
  { id: 'm5', name: 'Nour El-Din', role: 'AI & Sensor Processing', color: '#f472b6' },
  { id: 'm6', name: 'Salma Adel', role: 'Testing & QA Validation', color: '#a78bfa' }
];

/**
 * Default Project Engineering Stages / Milestones
 */
const DEFAULT_PROJECT_STAGES = [
  {
    id: 'stage_1',
    order: 1,
    title: 'Problem Definition & Requirements Specification',
    desc: 'Functional & non-functional requirements, component selection matrix, and supervisor approval.',
    status: 'completed', // 'pending' | 'in-progress' | 'completed'
    targetDate: '2026-10-15',
    completedAt: '2026-10-14'
  },
  {
    id: 'stage_2',
    order: 2,
    title: 'System Architecture & Component Sourcing',
    desc: 'BOM preparation, datasheet analysis, pinout mapping, and vendor quotation comparison.',
    status: 'completed',
    targetDate: '2026-10-30',
    completedAt: '2026-10-29'
  },
  {
    id: 'stage_3',
    order: 3,
    title: 'Hardware Purchasing & Core Components',
    desc: 'Procurement of STM32 MCUs, LiDAR/Ultrasonic sensors, motor drivers, and battery packs.',
    status: 'in-progress',
    targetDate: '2026-11-20',
    completedAt: null
  },
  {
    id: 'stage_4',
    order: 4,
    title: 'PCB Schematic Design, Simulation & Layout',
    desc: 'Altium/KiCad schematic design, power dissipation simulation, and Gerber export for fabrication.',
    status: 'in-progress',
    targetDate: '2026-12-05',
    completedAt: null
  },
  {
    id: 'stage_5',
    order: 5,
    title: 'Microcontroller Firmware & Driver Integration',
    desc: 'FreeRTOS task setup, CAN bus / SPI communication drivers, and closed-loop control algorithms.',
    status: 'pending',
    targetDate: '2027-01-15',
    completedAt: null
  },
  {
    id: 'stage_6',
    order: 6,
    title: 'Chassis Fabrication & Mechanical Assembly',
    desc: 'SolidWorks CAD structural design, CNC aluminum milling, and PETG 3D printing of brackets.',
    status: 'pending',
    targetDate: '2027-02-10',
    completedAt: null
  },
  {
    id: 'stage_7',
    order: 7,
    title: 'Comprehensive System Testing & Calibration',
    desc: 'Full-loop sensor calibration, stress testing, fault diagnosis, and safety shutoff validation.',
    status: 'pending',
    targetDate: '2027-03-20',
    completedAt: null
  },
  {
    id: 'stage_8',
    order: 8,
    title: 'Final Engineering Thesis & Defense Presentation',
    desc: 'Academic paper authoring, technical documentation, slide deck design, and live committee demo.',
    status: 'pending',
    targetDate: '2027-05-01',
    completedAt: null
  }
];

/**
 * Initial Realistic Expenses Pre-Loaded
 * Demonstrates the rolling accountant math right out of the box!
 */
const DEFAULT_EXPENSES = [
  {
    id: 'tx_1',
    payerId: 'm1', // Ahmed
    description: 'STM32 Nucleo boards & Debugger Probes',
    category: 'Hardware & Microcontrollers',
    amount: 2400.00,
    date: '2026-11-02'
  },
  {
    id: 'tx_2',
    payerId: 'm3', // Youssef
    description: '3D PETG Printing Filament Spools (x4)',
    category: '3D Printing & Materials',
    amount: 1200.00,
    date: '2026-11-05'
  },
  {
    id: 'tx_3',
    payerId: 'm4', // Mohamed
    description: '4-Layer Custom PCB Fabrication & Stencil',
    category: 'PCB & Electronics',
    amount: 1800.00,
    date: '2026-11-08'
  },
  {
    id: 'tx_4',
    payerId: 'm2', // Omar
    description: 'Ultrasonic Range Sensors & IMU 9-DOF',
    category: 'Sensors & Actuators',
    amount: 600.00,
    date: '2026-11-10'
  }
];

/* ============================================================================
   2. APPLICATION STATE MANAGEMENT
   ============================================================================ */

class ProjectState {
  constructor() {
    this.projectName = 'ENGINEERING GRADUATION PROJECT';
    this.members = [...DEFAULT_TEAM_MEMBERS];
    this.stages = [...DEFAULT_PROJECT_STAGES];
    this.expenses = [...DEFAULT_EXPENSES];
    this.stageFilter = 'all'; // 'all' | 'in-progress' | 'completed'
    this.txSearchTerm = '';
  }

  /**
   * Loads state from localStorage or initializes with defaults
   */
  load() {
    try {
      const savedName = localStorage.getItem('nexus_project_name');
      const savedMembers = localStorage.getItem('nexus_members');
      const savedStages = localStorage.getItem('nexus_stages');
      const savedExpenses = localStorage.getItem('nexus_expenses');

      if (savedName) this.projectName = savedName;
      if (savedMembers) this.members = JSON.parse(savedMembers);
      if (savedStages) this.stages = JSON.parse(savedStages);
      if (savedExpenses) this.expenses = JSON.parse(savedExpenses);
    } catch (e) {
      console.warn('Could not parse localStorage, falling back to defaults:', e);
    }
  }

  /**
   * Persists state to localStorage
   * (In Firebase mode, this function triggers cloud sync!)
   */
  save() {
    try {
      localStorage.setItem('nexus_project_name', this.projectName);
      localStorage.setItem('nexus_members', JSON.stringify(this.members));
      localStorage.setItem('nexus_stages', JSON.stringify(this.stages));
      localStorage.setItem('nexus_expenses', JSON.stringify(this.expenses));
    } catch (e) {
      console.error('LocalStorage save error:', e);
    }

    // Trigger Cloud Sync Hook if Firebase is integrated
    firebaseSyncHook(this);
  }

  resetToDefaults() {
    this.projectName = 'ENGINEERING GRADUATION PROJECT';
    this.members = JSON.parse(JSON.stringify(DEFAULT_TEAM_MEMBERS));
    this.stages = JSON.parse(JSON.stringify(DEFAULT_PROJECT_STAGES));
    this.expenses = JSON.parse(JSON.stringify(DEFAULT_EXPENSES));
    this.save();
  }
}

// Global App State Instance
const appState = new ProjectState();

/* ============================================================================
   3. THE MATHEMATICAL LOGIC: CONTINUOUS ROLLING LEDGER (CRITICAL)
   ============================================================================ */

/**
 * Calculates complete project finances according to specifications:
 * 1. Total Project Cost = Sum of all hardware/project expenses ONLY (not internal peer transfers).
 * 2. Fair Share per Person = Total Project Cost / 6.
 * 3. Member Net Contribution = (Hardware Paid) + (Transfers Sent) - (Transfers Received).
 * 4. Member Current Balance = Net Contribution - Fair Share.
 *    - Example: You owe 500 EGP (balance -500). You pay 50 EGP to Mohamed:
 *      Your balance becomes -450 EGP. Mohamed's credit decreases by 50 EGP.
 *      Total Project Cost and other 4 teammates remain unaffected!
 * 5. Generates minimal bipartite debt settlements.
 *
 * @param {Array} records - Array of expense and transfer objects
 * @param {Array} members - Array of 6 member objects
 * @returns {Object} Complete financial ledger summary
 */
function calculateRollingLedger(records, members) {
  const TEAM_SIZE = 6;

  // Separate project hardware/service purchases from direct peer debt repayments
  const expenses = records.filter(item => item.type !== 'transfer');
  const transfers = records.filter(item => item.type === 'transfer');

  // 1. Calculate Total Project Cost (Hardware and shared purchases ONLY)
  const totalCost = expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  // 2. Calculate Exact Fair Share per Person (1/6th)
  const fairShare = totalCost > 0 ? totalCost / TEAM_SIZE : 0;

  // 3. Calculate per-member contributions and net rolling balances
  const memberSummaries = members.map(member => {
    // Hardware expenses paid directly for the project
    const hardwarePaid = expenses
      .filter(tx => tx.payerId === member.id)
      .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);

    // Direct peer debt repayments sent out (e.g. sent 50 EGP to Mohamed)
    const transfersSent = transfers
      .filter(tr => tr.fromId === member.id)
      .reduce((sum, tr) => sum + Number(tr.amount || 0), 0);

    // Direct peer debt repayments received from others (e.g. received 50 EGP)
    const transfersReceived = transfers
      .filter(tr => tr.toId === member.id)
      .reduce((sum, tr) => sum + Number(tr.amount || 0), 0);

    // Net contribution: direct hardware + money sent to reduce debt - money collected from teammates
    const netContributed = hardwarePaid + transfersSent - transfersReceived;

    // Continuous Rolling Balance: Net Contributed minus Fair Share
    const balance = netContributed - fairShare;

    // Contribution percentage relative to total project expenditures
    const contributionPercent = totalCost > 0 ? (hardwarePaid / totalCost) * 100 : 0;

    return {
      id: member.id,
      name: member.name,
      role: member.role,
      color: member.color,
      totalPaid: hardwarePaid,
      hardwarePaid: hardwarePaid,
      transfersSent: transfersSent,
      transfersReceived: transfersReceived,
      netContributed: netContributed,
      fairShare: fairShare,
      balance: balance,
      contributionPercent: contributionPercent,
      // Status determination
      isOwed: balance > 0.009,
      isInDebt: balance < -0.009,
      isSettled: Math.abs(balance) <= 0.009
    };
  });

  // Top Funder identification
  let topFunder = null;
  if (totalCost > 0) {
    topFunder = [...memberSummaries].sort((a, b) => b.totalPaid - a.totalPaid)[0];
  }

  // 4. Mathematical Equilibrium Sanity Check: Sum of all net balances must equal 0
  const netSum = memberSummaries.reduce((sum, m) => sum + m.balance, 0);

  // 5. Generate Minimal Cash Settlement Transactions
  const settlements = computeOptimalSettlements(memberSummaries);

  return {
    totalCost,
    fairShare,
    memberSummaries,
    topFunder,
    netSum,
    settlements
  };
}

/**
 * Greedy Bipartite Debt Simplification Algorithm
 * Solves the minimum number of direct transactions to bring all 6 members to 0.00 balance.
 *
 * @param {Array} memberSummaries - Array of member objects with their current net balances
 * @returns {Array} List of required settlement transfers: { from, to, amount }
 */
function computeOptimalSettlements(memberSummaries) {
  // Separate into debtors (owe money, balance < 0) and creditors (owed money, balance > 0)
  const debtors = [];
  const creditors = [];

  memberSummaries.forEach(m => {
    // Round to whole integers for pure integer accounting
    const bal = Math.round(m.balance);
    if (bal < 0) {
      debtors.push({ id: m.id, name: m.name, amount: -bal }); // positive amount they owe
    } else if (bal > 0) {
      creditors.push({ id: m.id, name: m.name, amount: bal }); // positive amount owed to them
    }
  });

  // Sort descending by amount
  debtors.sort((a, b) => b.amount - a.amount);
  creditors.sort((a, b) => b.amount - a.amount);

  const transactions = [];
  let dIdx = 0;
  let cIdx = 0;

  while (dIdx < debtors.length && cIdx < creditors.length) {
    const debtor = debtors[dIdx];
    const creditor = creditors[cIdx];

    const transferAmount = Math.min(debtor.amount, creditor.amount);

    if (transferAmount > 0) {
      transactions.push({
        fromId: debtor.id,
        fromName: debtor.name,
        toId: creditor.id,
        toName: creditor.name,
        amount: Math.round(transferAmount)
      });
    }

    debtor.amount -= transferAmount;
    creditor.amount -= transferAmount;

    if (debtor.amount <= 0) dIdx++;
    if (creditor.amount <= 0) cIdx++;
  }

  return transactions;
}

/* ============================================================================
   4. UI RENDERING & DOM UPDATES
   ============================================================================ */

/**
 * Formats a numeric value into Egyptian Pounds currency string as an INTEGER
 * (no decimals, rounded to nearest whole pound, e.g. 2500 -> "2,500")
 */
function formatEGP(num) {
  return Math.round(Number(num || 0)).toLocaleString('en-US');
}

/**
 * Generates member initials for their avatar (e.g. "Ahmed Mahran" -> "AM")
 */
function getInitials(name) {
  if (!name) return '??';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Escapes HTML to prevent XSS vulnerabilities
 */
function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Main Render Pipeline: Updates the entire UI synchronously
 */
function renderAll() {
  renderHeaderAndProgress();
  renderFinancialKPIs();
  renderStages();
  renderBalancesGrid();
  renderSettlements();
  renderTransactionsFeed();
  populatePayerDropdown();
}

/**
 * Updates Header Project Title & Overall Stage Progress Bar
 */
function renderHeaderAndProgress() {
  // Project Title
  const titleDisplay = document.getElementById('projectTitleDisplay');
  if (titleDisplay) titleDisplay.textContent = appState.projectName;

  // Project Stage Progress Calculation
  const totalStages = appState.stages.length;
  const completedStages = appState.stages.filter(s => s.status === 'completed').length;
  const inProgressStages = appState.stages.filter(s => s.status === 'in-progress').length;

  const percentage = totalStages > 0 ? Math.round((completedStages / totalStages) * 100) : 0;

  // DOM Elements
  const percentText = document.getElementById('overallPercentText');
  const progressBar = document.getElementById('overallProgressBar');
  const progressCount = document.getElementById('stageProgressCount');
  const activePhaseName = document.getElementById('activePhaseName');

  if (percentText) percentText.textContent = percentage;
  if (progressBar) progressBar.style.width = `${percentage}%`;
  if (progressCount) {
    progressCount.textContent = `${completedStages} of ${totalStages} Milestones Completed`;
  }

  // Active Phase Display
  if (activePhaseName) {
    const activeStage = appState.stages.find(s => s.status === 'in-progress');
    if (activeStage) {
      activePhaseName.textContent = activeStage.title;
    } else if (completedStages === totalStages && totalStages > 0) {
      activePhaseName.textContent = 'All Milestones Complete!';
    } else {
      activePhaseName.textContent = 'None currently active';
    }
  }

  // Filter Counts
  const countAll = document.getElementById('countAllStages');
  const countActive = document.getElementById('countActiveStages');
  const countDone = document.getElementById('countDoneStages');
  if (countAll) countAll.textContent = totalStages;
  if (countActive) countActive.textContent = inProgressStages;
  if (countDone) countDone.textContent = completedStages;
}

/**
 * Updates the 4 Top KPI Financial Cards
 */
function renderFinancialKPIs() {
  const ledger = calculateRollingLedger(appState.expenses, appState.members);

  const kpiTotalCost = document.getElementById('kpiTotalCost');
  const kpiFairShare = document.getElementById('kpiFairShare');
  const kpiTopFunder = document.getElementById('kpiTopFunder');
  const kpiTopFunderAmount = document.getElementById('kpiTopFunderAmount');
  const kpiExpenseCount = document.getElementById('kpiExpenseCount');
  const kpiSettlementCount = document.getElementById('kpiSettlementCount');
  const ledgerEquilibrium = document.getElementById('ledgerEquilibrium');

  if (kpiTotalCost) {
    kpiTotalCost.innerHTML = `${formatEGP(ledger.totalCost)} <span class="currency">EGP</span>`;
  }

  if (kpiFairShare) {
    kpiFairShare.innerHTML = `${formatEGP(ledger.fairShare)} <span class="currency">EGP</span>`;
  }

  if (kpiExpenseCount) {
    kpiExpenseCount.textContent = `${appState.expenses.length} transactions recorded`;
  }

  if (kpiTopFunder && kpiTopFunderAmount) {
    if (ledger.topFunder && ledger.topFunder.totalPaid > 0) {
      kpiTopFunder.textContent = ledger.topFunder.name.split(' ')[0];
      kpiTopFunderAmount.textContent = `${formatEGP(ledger.topFunder.totalPaid)} EGP contributed`;
    } else {
      kpiTopFunder.textContent = 'None yet';
      kpiTopFunderAmount.textContent = '0 EGP contributed';
    }
  }

  if (kpiSettlementCount) {
    kpiSettlementCount.textContent = ledger.settlements.length;
  }

  // Equilibrium verification badge
  if (ledgerEquilibrium) {
    const isBalanced = Math.abs(ledger.netSum) < 1;
    ledgerEquilibrium.textContent = isBalanced
      ? 'Verified (Sum = 0 EGP)'
      : `Discrepancy: ${formatEGP(ledger.netSum)} EGP`;
    ledgerEquilibrium.style.color = isBalanced ? 'var(--emerald-light)' : 'var(--rose-light)';
  }
}

/**
 * SECTION A: Renders Project Stage Tracker Checklist
 */
function renderStages() {
  const container = document.getElementById('stagesListContainer');
  if (!container) return;

  // Filter stages based on current active tab
  let filteredStages = appState.stages;
  if (appState.stageFilter === 'in-progress') {
    filteredStages = appState.stages.filter(s => s.status === 'in-progress');
  } else if (appState.stageFilter === 'completed') {
    filteredStages = appState.stages.filter(s => s.status === 'completed');
  }

  if (filteredStages.length === 0) {
    container.innerHTML = `
      <div class="empty-feed-placeholder">
        No stages match the "${appState.stageFilter}" filter.
      </div>
    `;
    return;
  }

  container.innerHTML = filteredStages.map((stage, idx) => {
    const isCompleted = stage.status === 'completed';
    const isInProgress = stage.status === 'in-progress';
    const statusClass = isCompleted ? 'status-completed' : (isInProgress ? 'status-in-progress' : 'status-pending');

    return `
      <div class="stage-card ${statusClass}" data-stage-id="${stage.id}">
        <div class="stage-card-top">
          <div>
            <span class="stage-number">STAGE #${stage.order || (idx + 1)}</span>
            <h3 class="stage-title">${escapeHTML(stage.title)}</h3>
          </div>
          <button class="icon-btn-ghost delete-stage-btn" data-stage-id="${stage.id}" title="Delete Stage">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>

        <p class="stage-desc">${escapeHTML(stage.desc || 'No specific deliverables noted.')}</p>

        <div class="stage-card-bottom">
          <div class="stage-date-badge">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span>${stage.targetDate ? `Deadline: ${stage.targetDate}` : 'No date set'}</span>
          </div>

          <div class="stage-action-btns">
            <!-- Stage Status Toggle Buttons -->
            <button class="stage-toggle-btn ${isInProgress ? 'btn-is-in-progress' : ''}" 
                    data-action="set-in-progress" 
                    data-stage-id="${stage.id}" 
                    title="Mark In Progress">
              <span>● In Progress</span>
            </button>
            <button class="stage-toggle-btn ${isCompleted ? 'btn-is-completed' : ''}" 
                    data-action="toggle-complete" 
                    data-stage-id="${stage.id}" 
                    title="Toggle Completed">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>${isCompleted ? 'Completed' : 'Complete'}</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

/**
 * SECTION B: Renders The 6 Member Rolling Balances Cards
 */
function renderBalancesGrid() {
  const container = document.getElementById('balancesGrid');
  if (!container) return;

  const ledger = calculateRollingLedger(appState.expenses, appState.members);

  container.innerHTML = ledger.memberSummaries.map(member => {
    let cardStatusClass = 'is-settled';
    let badgeHtml = '<span class="balance-status-badge badge">Settled (0)</span>';
    let balanceFormatted = '0 EGP';

    if (member.isOwed) {
      cardStatusClass = 'is-owed';
      badgeHtml = '<span class="balance-status-badge badge badge-emerald">+ Owed Money</span>';
      balanceFormatted = `+ ${formatEGP(member.balance)} EGP`;
    } else if (member.isInDebt) {
      cardStatusClass = 'is-in-debt';
      badgeHtml = '<span class="balance-status-badge badge badge-rose">- Owes Team</span>';
      // Display absolute value with explicit minus for clarity
      balanceFormatted = `- ${formatEGP(Math.abs(member.balance))} EGP`;
    }

    return `
      <div class="member-card ${cardStatusClass}" data-member-id="${member.id}">
        <div class="member-card-header">
          <div class="member-avatar" style="background-color: ${member.color};">
            ${getInitials(member.name)}
          </div>
          <div class="member-info">
            <span class="member-name" title="${escapeHTML(member.name)}">${escapeHTML(member.name)}</span>
            <span class="member-role" title="${escapeHTML(member.role)}">${escapeHTML(member.role)}</span>
          </div>
        </div>

        <div class="member-stats-row">
          <div class="stat-item">
            <span class="stat-label">Total Paid</span>
            <span class="stat-val font-mono">${formatEGP(member.totalPaid)}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Fair Share</span>
            <span class="stat-val font-mono">${formatEGP(member.fairShare)}</span>
          </div>
        </div>

        <div class="member-balance-block">
          ${badgeHtml}
          <div class="balance-amount">${balanceFormatted}</div>
        </div>

        <!-- Relative Contribution Bar -->
        <div class="contribution-bar-wrap" title="${Math.round(member.contributionPercent)}% of total expenses">
          <div class="contribution-bar-fill" style="width: ${Math.round(member.contributionPercent)}%; background-color: ${member.color};"></div>
        </div>
      </div>
    `;
  }).join('');
}

/**
 * SECTION B: Renders Optimal Settlement Recommendations
 */
function renderSettlements() {
  const container = document.getElementById('settlementsContainer');
  if (!container) return;

  const ledger = calculateRollingLedger(appState.expenses, appState.members);

  if (ledger.settlements.length === 0) {
    container.innerHTML = `
      <div class="all-settled-notice">
        ✓ All 6 team members are in exact financial balance! No settlements required.
      </div>
    `;
    return;
  }

  container.innerHTML = ledger.settlements.map((st, idx) => `
    <div class="settlement-card">
      <div class="settlement-flow">
        <span class="settlement-debtor">${escapeHTML(st.fromName.split(' ')[0])}</span>
        <span class="settlement-arrow">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </span>
        <span class="settlement-creditor">${escapeHTML(st.toName.split(' ')[0])}</span>
      </div>
      <div class="settlement-right">
        <div class="settlement-amount font-mono">
          ${formatEGP(st.amount)} EGP
        </div>
        <button class="btn-pay-settlement" 
                data-from="${st.fromId}" 
                data-to="${st.toId}" 
                data-amount="${st.amount}" 
                title="Log payment to ${escapeHTML(st.toName.split(' ')[0])}">
          ⚡ Pay
        </button>
      </div>
    </div>
  `).join('');
}

/**
 * SECTION B: Renders Transaction History Feed
 */
function renderTransactionsFeed() {
  const container = document.getElementById('transactionsFeed');
  if (!container) return;

  let list = [...appState.expenses];

  // Apply search filter if user entered query
  if (appState.txSearchTerm.trim()) {
    const term = appState.txSearchTerm.toLowerCase();
    list = list.filter(tx => {
      if (tx.type === 'transfer') {
        const from = appState.members.find(m => m.id === tx.fromId);
        const to = appState.members.find(m => m.id === tx.toId);
        const fromName = from ? from.name.toLowerCase() : '';
        const toName = to ? to.name.toLowerCase() : '';
        const note = (tx.note || '').toLowerCase();
        return fromName.includes(term) || toName.includes(term) || note.includes(term);
      } else {
        const payer = appState.members.find(m => m.id === tx.payerId);
        const payerName = payer ? payer.name.toLowerCase() : '';
        return (
          (tx.description || '').toLowerCase().includes(term) ||
          (tx.category || '').toLowerCase().includes(term) ||
          payerName.includes(term)
        );
      }
    });
  }

  // Sort newest first
  list.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

  if (list.length === 0) {
    container.innerHTML = `
      <div class="empty-feed-placeholder">
        ${appState.txSearchTerm ? 'No activity matches your search.' : 'No purchases or payments logged yet.'}
      </div>
    `;
    return;
  }

  container.innerHTML = list.map(tx => {
    // If it's a direct peer-to-peer debt reimbursement
    if (tx.type === 'transfer') {
      const sender = appState.members.find(m => m.id === tx.fromId) || {
        name: 'Teammate',
        color: '#64748b'
      };
      const receiver = appState.members.find(m => m.id === tx.toId) || {
        name: 'Teammate',
        color: '#10b981'
      };

      return `
        <div class="transaction-card tx-transfer-card" data-tx-id="${tx.id}">
          <div class="tx-left">
            <div class="tx-avatar" style="background-color: ${sender.color};">
              ${getInitials(sender.name)}
            </div>
            <div class="tx-details">
              <span class="tx-title">
                <strong>${escapeHTML(sender.name.split(' ')[0])}</strong> paid <strong>${escapeHTML(receiver.name.split(' ')[0])}</strong> directly
              </span>
              <div class="tx-meta">
                <span class="badge badge-emerald" style="font-size:0.6rem; padding: 0.15rem 0.4rem;">💸 Direct Reimbursement</span>
                <span>&bull;</span>
                <span>${escapeHTML(tx.note || 'Direct payment')}</span>
                <span>&bull;</span>
                <span>${tx.date || 'Recent'}</span>
              </div>
            </div>
          </div>

          <div class="tx-right">
            <span class="tx-amount text-emerald">+ ${formatEGP(tx.amount)} EGP</span>
            <button class="icon-btn-ghost delete-tx-btn" data-tx-id="${tx.id}" title="Delete Transfer Record">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </div>
      `;
    }

    // Default: Hardware / Shared Project Expense
    const payer = appState.members.find(m => m.id === tx.payerId) || {
      name: 'Unknown Member',
      color: '#64748b'
    };

    return `
      <div class="transaction-card" data-tx-id="${tx.id}">
        <div class="tx-left">
          <div class="tx-avatar" style="background-color: ${payer.color};">
            ${getInitials(payer.name)}
          </div>
          <div class="tx-details">
            <span class="tx-title">${escapeHTML(tx.description)}</span>
            <div class="tx-meta">
              <span>Paid by <strong>${escapeHTML(payer.name.split(' ')[0])}</strong></span>
              <span>&bull;</span>
              <span class="tx-category-badge">${escapeHTML(tx.category || 'General')}</span>
              <span>&bull;</span>
              <span>${tx.date || 'Recent'}</span>
            </div>
          </div>
        </div>

        <div class="tx-right">
          <span class="tx-amount">${formatEGP(tx.amount)} EGP</span>
          <button class="icon-btn-ghost delete-tx-btn" data-tx-id="${tx.id}" title="Delete Expense">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Populates all select dropdowns with the 6 members
 */
function populatePayerDropdown() {
  const payerSelect = document.getElementById('payerSelect');
  const transferFromSelect = document.getElementById('transferFromSelect');
  const transferToSelect = document.getElementById('transferToSelect');

  const optionsHtml = appState.members.map(m => `
    <option value="${m.id}">
      ${escapeHTML(m.name)} (${escapeHTML(m.role)})
    </option>
  `).join('');

  if (payerSelect) {
    const curr = payerSelect.value;
    payerSelect.innerHTML = `<option value="" disabled ${!curr ? 'selected' : ''}>Select Team Member</option>` + optionsHtml;
    if (curr) payerSelect.value = curr;
  }

  if (transferFromSelect) {
    const curr = transferFromSelect.value;
    transferFromSelect.innerHTML = `<option value="" disabled ${!curr ? 'selected' : ''}>Select Sender (Debtor)</option>` + optionsHtml;
    if (curr) transferFromSelect.value = curr;
  }

  if (transferToSelect) {
    const curr = transferToSelect.value;
    transferToSelect.innerHTML = `<option value="" disabled ${!curr ? 'selected' : ''}>Select Recipient (Creditor)</option>` + optionsHtml;
    if (curr) transferToSelect.value = curr;
  }
}

/* ============================================================================
   5. USER INTERACTION HANDLERS & MODALS
   ============================================================================ */

/**
 * Shows interactive toast notification
 */
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(40px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

/**
 * Initializes all event listeners on page load
 */
function attachEventListeners() {
  // 0. Transaction Mode Tabs Toggle (Project Purchase vs Direct Debt Payment)
  const modeExpenseBtn = document.getElementById('modeExpenseBtn');
  const modeTransferBtn = document.getElementById('modeTransferBtn');
  const expenseForm = document.getElementById('expenseForm');
  const transferForm = document.getElementById('transferForm');
  const ledgerFormTitle = document.getElementById('ledgerFormTitle');
  const ledgerFormSubtitle = document.getElementById('ledgerFormSubtitle');

  function setActivityMode(mode) {
    if (mode === 'transfer') {
      if (modeTransferBtn) modeTransferBtn.classList.add('active');
      if (modeExpenseBtn) modeExpenseBtn.classList.remove('active');
      if (expenseForm) expenseForm.style.display = 'none';
      if (transferForm) transferForm.style.display = 'flex';
      if (ledgerFormTitle) ledgerFormTitle.textContent = 'Direct Member Reimbursement';
      if (ledgerFormSubtitle) ledgerFormSubtitle.textContent = 'Pay a teammate directly (partial or full) to reduce debt';
    } else {
      if (modeExpenseBtn) modeExpenseBtn.classList.add('active');
      if (modeTransferBtn) modeTransferBtn.classList.remove('active');
      if (transferForm) transferForm.style.display = 'none';
      if (expenseForm) expenseForm.style.display = 'flex';
      if (ledgerFormTitle) ledgerFormTitle.textContent = 'Log Project Purchase';
      if (ledgerFormSubtitle) ledgerFormSubtitle.textContent = 'Record hardware, components, or services shared by 6';
    }
  }

  if (modeExpenseBtn && modeTransferBtn) {
    modeExpenseBtn.addEventListener('click', () => setActivityMode('expense'));
    modeTransferBtn.addEventListener('click', () => setActivityMode('transfer'));
  }

  // 1. Submit New Project Hardware Expense
  if (expenseForm) {
    expenseForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const payerId = document.getElementById('payerSelect').value;
      const amount = Math.round(parseFloat(document.getElementById('expenseAmount').value));
      const description = document.getElementById('expenseDescription').value.trim();
      const category = document.getElementById('expenseCategory').value;
      const date = document.getElementById('expenseDate').value || new Date().toISOString().split('T')[0];

      if (!payerId) {
        showToast('Please select who paid for this expense.', 'error');
        return;
      }

      if (isNaN(amount) || amount <= 0) {
        showToast('Please enter a valid integer amount greater than 0 EGP.', 'error');
        return;
      }

      const newExpense = {
        id: 'tx_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        type: 'expense',
        payerId,
        amount,
        description,
        category,
        date
      };

      // Add to state and save
      appState.expenses.push(newExpense);
      appState.save();

      // Reset form
      expenseForm.reset();
      document.getElementById('expenseDate').value = new Date().toISOString().split('T')[0];

      // Re-render
      renderAll();

      const payerObj = appState.members.find(m => m.id === payerId);
      showToast(`Logged ${formatEGP(amount)} EGP paid by ${payerObj ? payerObj.name.split(' ')[0] : 'member'}. Rolling balances updated!`, 'success');
    });
  }

  // 1b. Submit Direct Member Debt Reimbursement / Partial Payment
  if (transferForm) {
    transferForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const fromId = document.getElementById('transferFromSelect').value;
      const toId = document.getElementById('transferToSelect').value;
      const amount = Math.round(parseFloat(document.getElementById('transferAmount').value));
      const note = document.getElementById('transferNote').value.trim();
      const date = document.getElementById('transferDate').value || new Date().toISOString().split('T')[0];

      if (!fromId || !toId) {
        showToast('Please select both the paying teammate and recipient.', 'error');
        return;
      }

      if (fromId === toId) {
        showToast('Sender and recipient cannot be the same teammate.', 'error');
        return;
      }

      if (isNaN(amount) || amount <= 0) {
        showToast('Please enter a valid integer payment amount greater than 0 EGP.', 'error');
        return;
      }

      const newTransfer = {
        id: 'tr_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        type: 'transfer',
        fromId,
        toId,
        amount,
        note: note || 'Direct peer reimbursement',
        date
      };

      // Add to state and save
      appState.expenses.push(newTransfer);
      appState.save();

      // Reset form
      transferForm.reset();
      document.getElementById('transferDate').value = new Date().toISOString().split('T')[0];

      // Re-render
      renderAll();

      const fromObj = appState.members.find(m => m.id === fromId);
      const toObj = appState.members.find(m => m.id === toId);
      showToast(`Recorded: ${fromObj ? fromObj.name.split(' ')[0] : 'Teammate'} paid ${toObj ? toObj.name.split(' ')[0] : 'Teammate'} ${formatEGP(amount)} EGP directly!`, 'success');
    });
  }

  // 2. Quick Amount Increment Buttons (+50, +100, +250, +500, +1000)
  document.querySelectorAll('.quick-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target') || 'expenseAmount';
      const addVal = Math.round(parseFloat(btn.getAttribute('data-add') || '0'));
      const amountInput = document.getElementById(targetId);
      if (amountInput) {
        const current = Math.round(parseFloat(amountInput.value || '0'));
        amountInput.value = current + addVal;
      }
    });
  });

  // 2b. Direct Settlement Card "⚡ Settle / Pay" Button Delegation
  const settlementsContainer = document.getElementById('settlementsContainer');
  if (settlementsContainer) {
    settlementsContainer.addEventListener('click', (e) => {
      const payBtn = e.target.closest('.btn-pay-settlement');
      if (!payBtn) return;

      const fromId = payBtn.getAttribute('data-from');
      const toId = payBtn.getAttribute('data-to');
      const amount = Math.round(parseFloat(payBtn.getAttribute('data-amount') || '0'));

      // Switch to direct transfer mode
      setActivityMode('transfer');

      const transferFromSelect = document.getElementById('transferFromSelect');
      const transferToSelect = document.getElementById('transferToSelect');
      const transferAmount = document.getElementById('transferAmount');
      const transferNote = document.getElementById('transferNote');

      if (transferFromSelect) transferFromSelect.value = fromId;
      if (transferToSelect) transferToSelect.value = toId;
      if (transferAmount) {
        transferAmount.value = amount > 0 ? amount : 50;
        transferAmount.focus();
        transferAmount.select();
      }
      if (transferNote) {
        const toObj = appState.members.find(m => m.id === toId);
        transferNote.value = `Payment to ${toObj ? toObj.name.split(' ')[0] : 'teammate'}`;
      }

      const formCard = document.getElementById('ledgerFormSection');
      if (formCard) formCard.scrollIntoView({ behavior: 'smooth' });

      showToast('Payment form prefilled. You can edit the amount (e.g. pay 50 EGP now).', 'info');
    });
  }

  // 3. Delete Expense Delegation
  const transactionsFeed = document.getElementById('transactionsFeed');
  if (transactionsFeed) {
    transactionsFeed.addEventListener('click', (e) => {
      const deleteBtn = e.target.closest('.delete-tx-btn');
      if (!deleteBtn) return;

      const txId = deleteBtn.getAttribute('data-tx-id');
      const targetTx = appState.expenses.find(t => t.id === txId);

      if (confirm(`Are you sure you want to delete "${targetTx ? targetTx.description : 'this expense'}"? All 6 rolling balances will recalculate.`)) {
        appState.expenses = appState.expenses.filter(t => t.id !== txId);
        appState.save();
        renderAll();
        showToast('Expense removed & ledger balances recalculated.', 'info');
      }
    });
  }

  // 4. Transaction Search Input
  const txSearchInput = document.getElementById('txSearchInput');
  if (txSearchInput) {
    txSearchInput.addEventListener('input', (e) => {
      appState.txSearchTerm = e.target.value;
      renderTransactionsFeed();
    });
  }

  // 5. Stage Tracker Actions Delegation (Toggle status & Delete stage)
  const stagesListContainer = document.getElementById('stagesListContainer');
  if (stagesListContainer) {
    stagesListContainer.addEventListener('click', (e) => {
      // Toggle / Set status button
      const actionBtn = e.target.closest('.stage-toggle-btn');
      if (actionBtn) {
        const stageId = actionBtn.getAttribute('data-stage-id');
        const action = actionBtn.getAttribute('data-action');
        const stage = appState.stages.find(s => s.id === stageId);

        if (stage) {
          if (action === 'toggle-complete') {
            stage.status = stage.status === 'completed' ? 'in-progress' : 'completed';
            stage.completedAt = stage.status === 'completed' ? new Date().toISOString().split('T')[0] : null;
          } else if (action === 'set-in-progress') {
            stage.status = stage.status === 'in-progress' ? 'pending' : 'in-progress';
          }
          appState.save();
          renderHeaderAndProgress();
          renderStages();
          showToast(`Stage "${stage.title.substring(0, 26)}..." status updated.`, 'info');
        }
        return;
      }

      // Delete stage button
      const deleteStageBtn = e.target.closest('.delete-stage-btn');
      if (deleteStageBtn) {
        const stageId = deleteStageBtn.getAttribute('data-stage-id');
        if (confirm('Delete this milestone stage from your graduation project timeline?')) {
          appState.stages = appState.stages.filter(s => s.id !== stageId);
          appState.save();
          renderHeaderAndProgress();
          renderStages();
          showToast('Stage deleted.', 'info');
        }
      }
    });
  }

  // 6. Stage Filter Tabs
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      appState.stageFilter = tab.getAttribute('data-filter');
      renderStages();
    });
  });

  // 7. Add Custom Stage Modal
  const openAddStageBtn = document.getElementById('openAddStageModalBtn');
  const addStageModal = document.getElementById('addStageModal');
  const addStageForm = document.getElementById('addStageForm');

  if (openAddStageBtn && addStageModal) {
    openAddStageBtn.addEventListener('click', () => {
      addStageModal.classList.add('open');
    });
  }

  if (addStageForm) {
    addStageForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('newStageTitle').value.trim();
      const desc = document.getElementById('newStageDesc').value.trim();
      const deadline = document.getElementById('newStageDeadline').value;

      if (!title) return;

      const newStage = {
        id: 'stage_' + Date.now(),
        order: appState.stages.length + 1,
        title,
        desc,
        status: 'pending',
        targetDate: deadline || null,
        completedAt: null
      };

      appState.stages.push(newStage);
      appState.save();

      addStageForm.reset();
      addStageModal.classList.remove('open');
      renderHeaderAndProgress();
      renderStages();
      showToast(`Added milestone: "${title}"`, 'success');
    });
  }

  // 8. Edit Project Title Button
  const editProjectNameBtn = document.getElementById('editProjectNameBtn');
  if (editProjectNameBtn) {
    editProjectNameBtn.addEventListener('click', () => {
      const current = appState.projectName;
      const updated = prompt('Enter your Graduation Project Title:', current);
      if (updated && updated.trim() && updated.trim() !== current) {
        appState.projectName = updated.trim();
        appState.save();
        renderHeaderAndProgress();
        showToast('Project title updated.', 'success');
      }
    });
  }

  // 9. Customize Team Members Modal
  const manageTeamBtn = document.getElementById('manageTeamBtn');
  const teamModal = document.getElementById('teamModal');
  const editTeamForm = document.getElementById('editTeamForm');
  const teamEditList = document.getElementById('teamEditList');

  if (manageTeamBtn && teamModal) {
    manageTeamBtn.addEventListener('click', () => {
      if (teamEditList) {
        teamEditList.innerHTML = appState.members.map((m, idx) => `
          <div class="team-edit-row">
            <input type="text" id="member_name_${m.id}" value="${escapeHTML(m.name)}" placeholder="Member #${idx+1} Name" required>
            <input type="text" id="member_role_${m.id}" value="${escapeHTML(m.role)}" placeholder="Role / Discipline">
          </div>
        `).join('');
      }
      teamModal.classList.add('open');
    });
  }

  if (editTeamForm) {
    editTeamForm.addEventListener('submit', (e) => {
      e.preventDefault();
      appState.members.forEach(m => {
        const nameInput = document.getElementById(`member_name_${m.id}`);
        const roleInput = document.getElementById(`member_role_${m.id}`);
        if (nameInput && nameInput.value.trim()) m.name = nameInput.value.trim();
        if (roleInput && roleInput.value.trim()) m.role = roleInput.value.trim();
      });

      appState.save();
      teamModal.classList.remove('open');
      renderAll();
      showToast('Team member profiles updated successfully.', 'success');
    });
  }

  // 10. Close Modal Buttons & Backdrop Click
  document.querySelectorAll('.close-modal-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-close');
      const targetModal = document.getElementById(modalId);
      if (targetModal) targetModal.classList.remove('open');
    });
  });

  document.querySelectorAll('.modal-backdrop').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('open');
    });
  });

  // 11. Reset to Defaults Demo Button
  const resetBtn = document.getElementById('resetDataBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('Reset all stages, members, and expenses back to initial demo data?')) {
        appState.resetToDefaults();
        renderAll();
        showToast('App reset to clean demo state.', 'info');
      }
    });
  }

  // 12. Export JSON Backup Button
  const exportBtn = document.getElementById('exportDataBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const dataBackup = {
        exportedAt: new Date().toISOString(),
        projectName: appState.projectName,
        members: appState.members,
        stages: appState.stages,
        expenses: appState.expenses,
        financialSummary: calculateRollingLedger(appState.expenses, appState.members)
      };

      const jsonStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataBackup, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", jsonStr);
      downloadAnchor.setAttribute("download", `graduation_project_ledger_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      showToast('Financial ledger JSON backup downloaded.', 'success');
    });
  }
}

/* ============================================================================
   6. FIREBASE CLOUD DATABASE HOOKS & PLACEHOLDER FUNCTIONS
   ============================================================================
   To integrate your Firebase Realtime Database or Cloud Firestore,
   follow the instructions below. The application is completely structured
   to switch from LocalStorage to real-time Cloud sync without altering UI code.
   ============================================================================ */

/**
 * Hook triggered whenever state modifications occur.
 * If Firebase is initialized, push updates to your cloud collection.
 */
function firebaseSyncHook(state) {
  // Placeholder: When you connect Firebase, uncomment below:
  /*
  if (window.firebaseDB) {
    saveExpensesToFirebase(state.expenses);
    saveStagesToFirebase(state.stages);
  }
  */
}

/**
 * PLACEHOLDER 1: Initialize Firebase Configuration
 * Copy this into your script once you register your project on firebase.google.com
 *
 * Example using Firebase v9/v10 Modular SDK:
 * 
 * import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
 * import { getFirestore, collection, doc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
 *
 * const firebaseConfig = {
 *   apiKey: "YOUR_API_KEY",
 *   authDomain: "YOUR_PROJECT.firebaseapp.com",
 *   projectId: "YOUR_PROJECT_ID",
 *   storageBucket: "YOUR_PROJECT.appspot.com",
 *   messagingSenderId: "SENDER_ID",
 *   appId: "APP_ID"
 * };
 *
 * const app = initializeApp(firebaseConfig);
 * const db = getFirestore(app);
 * window.firebaseDB = db;
 */
function initFirebaseApp() {
  console.log('[Firebase Hook] Placeholder: Ready for Firebase credentials injection.');
}

/**
 * PLACEHOLDER 2: Realtime Listener for Expenses
 * Subscribes to live purchases made by any teammate on their phone or laptop.
 */
function listenToFirebaseExpenses(onDataChanged) {
  /*
  import { collection, onSnapshot } from "firebase/firestore";
  onSnapshot(collection(window.firebaseDB, "expenses"), (snapshot) => {
    const cloudExpenses = [];
    snapshot.forEach((doc) => cloudExpenses.push({ id: doc.id, ...doc.data() }));
    onDataChanged(cloudExpenses);
  });
  */
  console.log('[Firebase Hook] Placeholder: Ready for onSnapshot(expenses).');
}

/**
 * PLACEHOLDER 3: Realtime Listener for Stages
 * Subscribes to live completion status updates made by team leads.
 */
function listenToFirebaseStages(onDataChanged) {
  /*
  import { collection, onSnapshot } from "firebase/firestore";
  onSnapshot(collection(window.firebaseDB, "stages"), (snapshot) => {
    const cloudStages = [];
    snapshot.forEach((doc) => cloudStages.push({ id: doc.id, ...doc.data() }));
    onDataChanged(cloudStages);
  });
  */
  console.log('[Firebase Hook] Placeholder: Ready for onSnapshot(stages).');
}

/**
 * PLACEHOLDER 4: Push New Expense to Firebase
 */
function saveExpenseToFirebase(expenseObject) {
  /*
  import { doc, setDoc } from "firebase/firestore";
  return setDoc(doc(window.firebaseDB, "expenses", expenseObject.id), expenseObject);
  */
  console.log('[Firebase Hook] Placeholder: Saving expense to Cloud Firestore:', expenseObject);
}

/**
 * PLACEHOLDER 5: Update Stage Status in Firebase
 */
function updateStageInFirebase(stageId, updatedFields) {
  /*
  import { doc, updateDoc } from "firebase/firestore";
  return updateDoc(doc(window.firebaseDB, "stages", stageId), updatedFields);
  */
  console.log('[Firebase Hook] Placeholder: Updating stage in Cloud Firestore:', stageId, updatedFields);
}

/* ============================================================================
   7. APPLICATION BOOTSTRAPPER
   ============================================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Set default date input to today
  const dateInput = document.getElementById('expenseDate');
  if (dateInput) {
    dateInput.value = new Date().toISOString().split('T')[0];
  }
  const transferDateInput = document.getElementById('transferDate');
  if (transferDateInput) {
    transferDateInput.value = new Date().toISOString().split('T')[0];
  }

  // Load state from storage
  appState.load();

  // Attach event handlers
  attachEventListeners();

  // Initial Full Render
  renderAll();

  // Initialize Firebase Hook placeholder
  initFirebaseApp();
});
