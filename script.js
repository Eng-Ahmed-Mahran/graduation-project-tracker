/**
 * ============================================================================
 * PROJECT NEXUS: Team Budget Controller & Automated Accountant
 * Pure Focus: Money, Budget Consumption, Transactions & 6-Member Rolling Ledger
 * Architecture: Vanilla JavaScript (ES6+), Modular & Pure Integer Accounting (EGP)
 * Ready for GitHub Pages deployment & Firebase Cloud Sync
 * ============================================================================
 */

/* ============================================================================
   1. DEFAULT DATA DEFINITIONS (Realistic Graduation Project Financial Data)
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
 * Initial Realistic Project Purchases (Pre-loaded with whole integer numbers)
 */
const DEFAULT_EXPENSES = [
  {
    id: 'tx_1',
    type: 'expense',
    payerId: 'm1', // Ahmed
    description: 'STM32 Nucleo boards & Debugger Probes',
    amount: 2400,
    date: '2026-11-02'
  },
  {
    id: 'tx_2',
    type: 'expense',
    payerId: 'm3', // Youssef
    description: '3D PETG Printing Filament Spools (x4)',
    amount: 1200,
    date: '2026-11-05'
  },
  {
    id: 'tx_3',
    type: 'expense',
    payerId: 'm4', // Mohamed
    description: '4-Layer Custom PCB Fabrication & Stencil',
    amount: 1800,
    date: '2026-11-08'
  },
  {
    id: 'tx_4',
    type: 'expense',
    payerId: 'm2', // Omar
    description: 'Ultrasonic Range Sensors & IMU 9-DOF',
    amount: 600,
    date: '2026-11-10'
  }
];

/* ============================================================================
   2. APPLICATION STATE MANAGEMENT
   ============================================================================ */

class ProjectState {
  constructor() {
    this.projectName = 'GRADUATION PROJECT BUDGET';
    this.budgetTarget = 12000; // Whole integer target in EGP
    this.members = [...DEFAULT_TEAM_MEMBERS];
    this.expenses = [...DEFAULT_EXPENSES];
    this.txSearchTerm = '';
  }

  load() {
    try {
      const savedName = localStorage.getItem('nexus_project_name');
      const savedBudget = localStorage.getItem('nexus_budget_target');
      const savedMembers = localStorage.getItem('nexus_members');
      const savedExpenses = localStorage.getItem('nexus_expenses');

      if (savedName) this.projectName = savedName;
      if (savedBudget) this.budgetTarget = Math.round(Number(savedBudget));
      if (savedMembers) this.members = JSON.parse(savedMembers);
      if (savedExpenses) this.expenses = JSON.parse(savedExpenses);
    } catch (e) {
      console.warn('Could not parse localStorage, falling back to defaults:', e);
    }
  }

  save() {
    try {
      localStorage.setItem('nexus_project_name', this.projectName);
      localStorage.setItem('nexus_budget_target', this.budgetTarget.toString());
      localStorage.setItem('nexus_members', JSON.stringify(this.members));
      localStorage.setItem('nexus_expenses', JSON.stringify(this.expenses));
    } catch (e) {
      console.error('LocalStorage save error:', e);
    }

    // Trigger Cloud Sync Hook if Firebase is integrated
    firebaseSyncHook(this);
  }

  resetToDefaults() {
    this.projectName = 'GRADUATION PROJECT BUDGET';
    this.budgetTarget = 12000;
    this.members = JSON.parse(JSON.stringify(DEFAULT_TEAM_MEMBERS));
    this.expenses = JSON.parse(JSON.stringify(DEFAULT_EXPENSES));
    this.save();
  }
}

// Global App State Instance
const appState = new ProjectState();

/* ============================================================================
   3. THE MATHEMATICAL LOGIC: CONTINUOUS ROLLING LEDGER & BUDGET ENGINE
   ============================================================================ */

/**
 * Calculates complete project finances with pure whole integers:
 * 1. Total Project Cost = Sum of hardware/shared purchases ONLY (no peer transfers).
 * 2. Fair Share per Person = Math.round(Total Project Cost / 6).
 * 3. Member Net Contribution = (Hardware Paid) + (Transfers Sent) - (Transfers Received).
 * 4. Member Current Balance = Net Contribution - Fair Share.
 *    - Example: You owe 500 EGP. You pay Mohamed 50 EGP:
 *      Your debt becomes -450 EGP. Mohamed's credit decreases by 50 EGP.
 *      Project Total and the other 4 teammates remain unaffected!
 * 5. Generates an optimal minimal debt settlement schedule.
 *
 * @param {Array} records - Array of expense and transfer objects
 * @param {Array} members - Array of 6 member objects
 * @returns {Object} Complete financial ledger summary
 */
function calculateRollingLedger(records, members) {
  const TEAM_SIZE = 6;

  // Separate project hardware purchases from direct peer debt repayments
  const expenses = records.filter(item => item.type !== 'transfer');
  const transfers = records.filter(item => item.type === 'transfer');

  // 1. Calculate Total Project Cost (Hardware and shared purchases ONLY)
  const totalCost = Math.round(
    expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0)
  );

  // 2. Calculate Fair Share per Person (1/6th) rounded to whole integer
  const fairShare = totalCost > 0 ? Math.round(totalCost / TEAM_SIZE) : 0;

  // 3. Calculate per-member contributions and net rolling balances
  const memberSummaries = members.map(member => {
    // Hardware expenses paid directly for the project
    const hardwarePaid = Math.round(
      expenses
        .filter(tx => tx.payerId === member.id)
        .reduce((sum, tx) => sum + Number(tx.amount || 0), 0)
    );

    // Direct peer debt repayments sent out (e.g. sent 50 EGP to Mohamed)
    const transfersSent = Math.round(
      transfers
        .filter(tr => tr.fromId === member.id)
        .reduce((sum, tr) => sum + Number(tr.amount || 0), 0)
    );

    // Direct peer debt repayments received from others (e.g. received 50 EGP)
    const transfersReceived = Math.round(
      transfers
        .filter(tr => tr.toId === member.id)
        .reduce((sum, tr) => sum + Number(tr.amount || 0), 0)
    );

    // Net contribution to the team pool
    const netContributed = hardwarePaid + transfersSent - transfersReceived;

    // Continuous Rolling Balance: Net Contributed minus Fair Share
    const balance = netContributed - fairShare;

    // Contribution percentage relative to total project expenditures
    const contributionPercent = totalCost > 0 ? Math.round((hardwarePaid / totalCost) * 100) : 0;

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
      isOwed: balance > 0,
      isInDebt: balance < 0,
      isSettled: balance === 0
    };
  });

  // Top Funder identification
  let topFunder = null;
  if (totalCost > 0) {
    topFunder = [...memberSummaries].sort((a, b) => b.totalPaid - a.totalPaid)[0];
  }

  // Equilibrium Sanity Check: Sum of all net balances must equal 0
  const netSum = memberSummaries.reduce((sum, m) => sum + m.balance, 0);

  // Generate Minimal Cash Settlement Transactions
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
 * Solves the minimum number of direct transactions to bring all 6 members to 0 balance.
 *
 * @param {Array} memberSummaries - Array of member objects with their current net balances
 * @returns {Array} List of required settlement transfers: { from, to, amount }
 */
function computeOptimalSettlements(memberSummaries) {
  const debtors = [];
  const creditors = [];

  memberSummaries.forEach(m => {
    const bal = Math.round(m.balance);
    if (bal < 0) {
      debtors.push({ id: m.id, name: m.name, amount: -bal }); // positive amount owed
    } else if (bal > 0) {
      creditors.push({ id: m.id, name: m.name, amount: bal }); // positive amount to receive
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
 * (no decimals, e.g. 2500 -> "2,500")
 */
function formatEGP(num) {
  return Math.round(Number(num || 0)).toLocaleString('en-US');
}

/**
 * Generates member initials for avatar (e.g. "Ahmed Mahran" -> "AM")
 */
function getInitials(name) {
  if (!name) return '??';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Escapes HTML to prevent XSS
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
 * Master Render Pipeline
 */
function renderAll() {
  const ledger = calculateRollingLedger(appState.expenses, appState.members);

  renderHeaderAndBudget(ledger);
  renderFinancialKPIs(ledger);
  renderBalancesGrid(ledger);
  renderSettlements(ledger);
  renderTransactionsFeed();
  populatePayerDropdown();
}

/**
 * Top Progress Banner: Budget Utilization & Spending Tracker
 */
function renderHeaderAndBudget(ledger) {
  // Project Title
  const titleDisplay = document.getElementById('projectTitleDisplay');
  if (titleDisplay) titleDisplay.textContent = appState.projectName;

  const totalSpent = ledger.totalCost;
  const budgetTarget = appState.budgetTarget;
  const percent = budgetTarget > 0 ? Math.round((totalSpent / budgetTarget) * 100) : 0;
  const remaining = budgetTarget - totalSpent;

  // DOM Elements
  const budgetUsageText = document.getElementById('budgetUsageText');
  const budgetPercentText = document.getElementById('budgetPercentText');
  const budgetProgressBar = document.getElementById('budgetProgressBar');
  const budgetRemainingText = document.getElementById('budgetRemainingText');

  if (budgetUsageText) {
    budgetUsageText.textContent = `Spent: ${formatEGP(totalSpent)} EGP of ${formatEGP(budgetTarget)} EGP Target`;
  }

  if (budgetPercentText) {
    budgetPercentText.textContent = percent;
  }

  if (budgetProgressBar) {
    budgetProgressBar.style.width = `${Math.min(percent, 100)}%`;
    budgetProgressBar.classList.remove('budget-warning', 'budget-danger');
    if (percent > 100) {
      budgetProgressBar.classList.add('budget-danger');
    } else if (percent >= 80) {
      budgetProgressBar.classList.add('budget-warning');
    }
  }

  if (budgetRemainingText) {
    if (remaining >= 0) {
      budgetRemainingText.textContent = `${formatEGP(remaining)} EGP available`;
      budgetRemainingText.style.color = 'var(--text-main)';
    } else {
      budgetRemainingText.textContent = `Over Budget by ${formatEGP(Math.abs(remaining))} EGP!`;
      budgetRemainingText.style.color = 'var(--rose-light)';
    }
  }
}

/**
 * Top KPI Financial Overview Cards
 */
function renderFinancialKPIs(ledger) {
  const kpiTotalCost = document.getElementById('kpiTotalCost');
  const kpiFairShare = document.getElementById('kpiFairShare');
  const kpiRemainingBudget = document.getElementById('kpiRemainingBudget');
  const kpiBudgetTargetSubtext = document.getElementById('kpiBudgetTargetSubtext');
  const kpiExpenseCount = document.getElementById('kpiExpenseCount');
  const kpiSettlementCount = document.getElementById('kpiSettlementCount');
  const ledgerEquilibrium = document.getElementById('ledgerEquilibrium');

  if (kpiTotalCost) {
    kpiTotalCost.innerHTML = `${formatEGP(ledger.totalCost)} <span class="currency">EGP</span>`;
  }

  if (kpiFairShare) {
    kpiFairShare.innerHTML = `${formatEGP(ledger.fairShare)} <span class="currency">EGP</span>`;
  }

  const remaining = appState.budgetTarget - ledger.totalCost;
  if (kpiRemainingBudget) {
    kpiRemainingBudget.innerHTML = `${formatEGP(remaining)} <span class="currency">EGP</span>`;
    kpiRemainingBudget.style.color = remaining >= 0 ? 'var(--emerald-light)' : 'var(--rose-light)';
  }

  if (kpiBudgetTargetSubtext) {
    const rawExpenses = appState.expenses.filter(e => e.type !== 'transfer');
    kpiBudgetTargetSubtext.textContent = `Target: ${formatEGP(appState.budgetTarget)} EGP`;
  }

  if (kpiExpenseCount) {
    const rawExpenses = appState.expenses.filter(e => e.type !== 'transfer');
    const transfers = appState.expenses.filter(e => e.type === 'transfer');
    kpiExpenseCount.textContent = `${rawExpenses.length} purchases • ${transfers.length} peer payments`;
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
 * SECTION B: Renders The 6 Member Rolling Balances Cards
 */
function renderBalancesGrid(ledger) {
  const container = document.getElementById('balancesGrid');
  if (!container) return;

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
            <span class="stat-label">Hardware Paid</span>
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
        <div class="contribution-bar-wrap" title="${member.contributionPercent}% of total expenses">
          <div class="contribution-bar-fill" style="width: ${member.contributionPercent}%; background-color: ${member.color};"></div>
        </div>
      </div>
    `;
  }).join('');
}

/**
 * SECTION B: Renders Optimal Settlement Recommendations
 */
function renderSettlements(ledger) {
  const container = document.getElementById('settlementsContainer');
  if (!container) return;

  if (ledger.settlements.length === 0) {
    container.innerHTML = `
      <div class="all-settled-notice">
        ✓ All 6 team members are in exact financial equilibrium! No settlements required.
      </div>
    `;
    return;
  }

  container.innerHTML = ledger.settlements.map((st) => `
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

/* ============================================================================
   5b. ADMIN AUTHENTICATION & ACCESS CONTROL (Credentials: admin / 123)
   ============================================================================ */

const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: '123'
};

let pendingAdminAction = null;

/**
 * Checks whether user currently possesses authenticated admin session
 */
function isAdmin() {
  return sessionStorage.getItem('nexus_is_admin') === 'true';
}

/**
 * Sets or clears admin authentication in session storage
 */
function setAdminAuth(status) {
  if (status) {
    sessionStorage.setItem('nexus_is_admin', 'true');
  } else {
    sessionStorage.removeItem('nexus_is_admin');
  }
  updateAuthUI();
}

/**
 * Dynamically updates header badges, buttons, and form state according to auth level
 */
function updateAuthUI() {
  const authed = isAdmin();
  const authBtn = document.getElementById('authBtn');
  const authBtnText = document.getElementById('authBtnText');
  const authBtnIcon = document.getElementById('authBtnIcon');
  const authStatusBadge = document.getElementById('authStatusBadge');
  const formAuthPill = document.getElementById('formAuthPill');
  const authPillDot = document.getElementById('authPillDot');
  const formAuthPillText = document.getElementById('formAuthPillText');

  if (authed) {
    if (authBtn) {
      authBtn.className = 'btn btn-secondary btn-sm';
      authBtn.title = 'Click to Log Out (Admin Mode Active)';
    }
    if (authBtnText) authBtnText.textContent = 'Logout (Admin)';
    if (authBtnIcon) {
      authBtnIcon.innerHTML = `
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 9.9-1"></path>
      `;
    }
    if (authStatusBadge) {
      authStatusBadge.className = 'badge badge-emerald';
      authStatusBadge.textContent = '🔓 ADMIN MODE';
    }
    if (formAuthPill) {
      formAuthPill.classList.add('is-admin');
    }
    if (authPillDot) {
      authPillDot.className = 'auth-pill-dot dot-emerald';
    }
    if (formAuthPillText) {
      formAuthPillText.textContent = 'Admin Mode • Full Access';
    }
  } else {
    if (authBtn) {
      authBtn.className = 'btn btn-primary btn-sm btn-glow';
      authBtn.title = 'Click to Log In as Admin';
    }
    if (authBtnText) authBtnText.textContent = 'Admin Login';
    if (authBtnIcon) {
      authBtnIcon.innerHTML = `
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
      `;
    }
    if (authStatusBadge) {
      authStatusBadge.className = 'badge badge-rose';
      authStatusBadge.textContent = '🔒 VIEW ONLY';
    }
    if (formAuthPill) {
      formAuthPill.classList.remove('is-admin');
    }
    if (authPillDot) {
      authPillDot.className = 'auth-pill-dot dot-rose';
    }
    if (formAuthPillText) {
      formAuthPillText.textContent = 'View Only • Log In to Edit';
    }
  }
}

/**
 * Opens the login modal popup rectangle
 */
function openLoginModal(message) {
  const modal = document.getElementById('loginModal');
  const subtitle = document.getElementById('loginModalSubtitle');
  const errorAlert = document.getElementById('loginErrorAlert');
  const userInp = document.getElementById('loginUsername');
  const passInp = document.getElementById('loginPassword');

  if (subtitle && message) subtitle.textContent = message;
  if (errorAlert) errorAlert.style.display = 'none';
  if (userInp) userInp.value = '';
  if (passInp) passInp.value = '';

  if (modal) {
    modal.classList.add('open');
    setTimeout(() => {
      if (userInp) userInp.focus();
    }, 150);
  }
}

/**
 * Closes the login modal popup
 */
function closeLoginModal() {
  const modal = document.getElementById('loginModal');
  if (modal) modal.classList.remove('open');
  const errorAlert = document.getElementById('loginErrorAlert');
  if (errorAlert) errorAlert.style.display = 'none';
}

/**
 * Guards any action with Admin Authentication.
 * If authenticated, executes callback immediately and returns true.
 * If not authenticated, saves callback, opens the login popup rectangle, and returns false.
 */
function requireAdmin(actionCallback, contextMessage) {
  if (isAdmin()) {
    if (typeof actionCallback === 'function') actionCallback();
    return true;
  }

  pendingAdminAction = actionCallback;
  openLoginModal(contextMessage || 'Please authenticate as administrator to record payments, modify expenses, or change project settings.');
  showToast('🔒 Admin Login Required: Please log in as administrator to proceed.', 'info');
  return false;
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

  // 0b. Admin Authentication UI Listeners
  const authBtn = document.getElementById('authBtn');
  if (authBtn) {
    authBtn.addEventListener('click', () => {
      if (isAdmin()) {
        if (confirm('Log out from Admin Mode? The app will return to view-only mode for safety.')) {
          setAdminAuth(false);
          showToast('Logged out. Switched to View-Only mode.', 'info');
        }
      } else {
        openLoginModal('Enter admin credentials to unlock full editing and payment access.');
      }
    });
  }

  const formAuthPill = document.getElementById('formAuthPill');
  if (formAuthPill) {
    formAuthPill.addEventListener('click', () => {
      if (isAdmin()) {
        showToast('✓ Admin Mode Active: You have full permissions.', 'success');
      } else {
        openLoginModal('Enter admin credentials to unlock full editing and payment access.');
      }
    });
  }

  // 0c. Password Visibility Toggle
  const togglePasswordBtn = document.getElementById('togglePasswordBtn');
  const loginPassword = document.getElementById('loginPassword');
  const pwdEyeIcon = document.getElementById('pwdEyeIcon');
  if (togglePasswordBtn && loginPassword) {
    togglePasswordBtn.addEventListener('click', () => {
      const isPwd = loginPassword.type === 'password';
      loginPassword.type = isPwd ? 'text' : 'password';
      if (pwdEyeIcon) {
        pwdEyeIcon.innerHTML = isPwd
          ? `<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>`
          : `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>`;
      }
    });
  }

  // 0d. Login Form Submission Handler (Validates username: admin, password: 123)
  const loginForm = document.getElementById('loginForm');
  const loginErrorAlert = document.getElementById('loginErrorAlert');
  const loginErrorMsg = document.getElementById('loginErrorMsg');

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const u = (document.getElementById('loginUsername').value || '').trim();
      const p = (document.getElementById('loginPassword').value || '').trim();

      if (u === ADMIN_CREDENTIALS.username && p === ADMIN_CREDENTIALS.password) {
        setAdminAuth(true);
        closeLoginModal();
        showToast('🔓 Welcome Admin! Editing and payment permissions unlocked.', 'success');

        // Resume pending action if user clicked something while in view-only mode
        if (typeof pendingAdminAction === 'function') {
          const action = pendingAdminAction;
          pendingAdminAction = null;
          setTimeout(() => {
            action();
          }, 120);
        }
      } else {
        if (loginErrorAlert) {
          loginErrorAlert.style.display = 'flex';
        }
        if (loginErrorMsg) {
          loginErrorMsg.textContent = 'Incorrect username or password. Please try again.';
        }
        const passInput = document.getElementById('loginPassword');
        if (passInput) {
          passInput.value = '';
          passInput.focus();
        }
      }
    });
  }

  // 1. Submit New Project Hardware Expense (Admin Guarded)
  if (expenseForm) {
    expenseForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!isAdmin()) {
        requireAdmin(() => {
          if (expenseForm.requestSubmit) {
            expenseForm.requestSubmit();
          } else {
            expenseForm.dispatchEvent(new Event('submit'));
          }
        }, 'Admin login required to record project purchases.');
        return;
      }

      const payerId = document.getElementById('payerSelect').value;
      const amount = Math.round(parseFloat(document.getElementById('expenseAmount').value));
      const description = document.getElementById('expenseDescription').value.trim();
      const date = document.getElementById('expenseDate').value || new Date().toISOString().split('T')[0];

      if (!payerId) {
        showToast('Please select who paid for this expense.', 'error');
        return;
      }

      if (isNaN(amount) || amount <= 0) {
        showToast('Please enter a valid whole number greater than 0 EGP.', 'error');
        return;
      }

      const newExpense = {
        id: 'tx_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        type: 'expense',
        payerId,
        amount,
        description,
        date
      };

      appState.expenses.push(newExpense);
      appState.save();

      expenseForm.reset();
      document.getElementById('expenseDate').value = new Date().toISOString().split('T')[0];

      renderAll();

      const payerObj = appState.members.find(m => m.id === payerId);
      showToast(`Logged ${formatEGP(amount)} EGP paid by ${payerObj ? payerObj.name.split(' ')[0] : 'member'}. Rolling balances updated!`, 'success');
    });
  }

  // 1b. Submit Direct Member Debt Reimbursement / Partial Payment (Admin Guarded)
  if (transferForm) {
    transferForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!isAdmin()) {
        requireAdmin(() => {
          if (transferForm.requestSubmit) {
            transferForm.requestSubmit();
          } else {
            transferForm.dispatchEvent(new Event('submit'));
          }
        }, 'Admin login required to record direct peer payments.');
        return;
      }

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
        showToast('Please enter a valid whole payment amount greater than 0 EGP.', 'error');
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

      appState.expenses.push(newTransfer);
      appState.save();

      transferForm.reset();
      document.getElementById('transferDate').value = new Date().toISOString().split('T')[0];

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

  // 2b. Direct Settlement Card "⚡ Pay" Button Delegation (Admin Guarded)
  const settlementsContainer = document.getElementById('settlementsContainer');
  if (settlementsContainer) {
    settlementsContainer.addEventListener('click', (e) => {
      const payBtn = e.target.closest('.btn-pay-settlement');
      if (!payBtn) return;

      const fromId = payBtn.getAttribute('data-from');
      const toId = payBtn.getAttribute('data-to');
      const amount = Math.round(parseFloat(payBtn.getAttribute('data-amount') || '0'));

      requireAdmin(() => {
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
      }, 'Admin login required to process direct peer settlements.');
    });
  }

  // 3. Delete Expense Delegation (Admin Guarded)
  const transactionsFeed = document.getElementById('transactionsFeed');
  if (transactionsFeed) {
    transactionsFeed.addEventListener('click', (e) => {
      const deleteBtn = e.target.closest('.delete-tx-btn');
      if (!deleteBtn) return;

      const txId = deleteBtn.getAttribute('data-tx-id');
      const targetTx = appState.expenses.find(t => t.id === txId);
      if (!targetTx) return;

      requireAdmin(() => {
        const desc = targetTx.type === 'transfer' ? 'this payment transfer' : `"${targetTx.description}"`;
        if (confirm(`Are you sure you want to delete ${desc}? All 6 rolling balances will recalculate.`)) {
          appState.expenses = appState.expenses.filter(t => t.id !== txId);
          appState.save();
          renderAll();
          showToast('Record removed & ledger balances recalculated.', 'info');
        }
      }, 'Admin login required to delete transactions.');
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

  // 5. Budget Modal Setup (Admin Guarded)
  const openBudgetBtn = document.getElementById('openBudgetModalBtn');
  const budgetModal = document.getElementById('budgetModal');
  const editBudgetForm = document.getElementById('editBudgetForm');
  const budgetTargetInput = document.getElementById('budgetTargetInput');

  if (openBudgetBtn && budgetModal) {
    openBudgetBtn.addEventListener('click', () => {
      requireAdmin(() => {
        if (budgetTargetInput) budgetTargetInput.value = appState.budgetTarget;
        budgetModal.classList.add('open');
      }, 'Admin login required to change project budget target.');
    });
  }

  if (editBudgetForm) {
    editBudgetForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = Math.round(parseFloat(budgetTargetInput.value));
      if (val > 0) {
        appState.budgetTarget = val;
        appState.save();
        budgetModal.classList.remove('open');
        renderAll();
        showToast(`Budget target updated to ${formatEGP(val)} EGP.`, 'success');
      }
    });
  }

  // 6. Edit Project Title Button (Admin Guarded)
  const editProjectNameBtn = document.getElementById('editProjectNameBtn');
  if (editProjectNameBtn) {
    editProjectNameBtn.addEventListener('click', () => {
      requireAdmin(() => {
        const current = appState.projectName;
        const updated = prompt('Enter your Graduation Project Title:', current);
        if (updated && updated.trim() && updated.trim() !== current) {
          appState.projectName = updated.trim();
          appState.save();
          renderAll();
          showToast('Project title updated.', 'success');
        }
      }, 'Admin login required to change project title.');
    });
  }

  // 7. Customize Team Members Modal (Admin Guarded)
  const manageTeamBtn = document.getElementById('manageTeamBtn');
  const teamModal = document.getElementById('teamModal');
  const editTeamForm = document.getElementById('editTeamForm');
  const teamEditList = document.getElementById('teamEditList');

  if (manageTeamBtn && teamModal) {
    manageTeamBtn.addEventListener('click', () => {
      requireAdmin(() => {
        if (teamEditList) {
          teamEditList.innerHTML = appState.members.map((m, idx) => `
            <div class="team-edit-row">
              <input type="text" id="member_name_${m.id}" value="${escapeHTML(m.name)}" placeholder="Member #${idx+1} Name" required>
              <input type="text" id="member_role_${m.id}" value="${escapeHTML(m.role)}" placeholder="Role / Discipline">
            </div>
          `).join('');
        }
        teamModal.classList.add('open');
      }, 'Admin login required to edit team member names.');
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

  // 8. Close Modal Buttons & Backdrop Click
  document.querySelectorAll('.close-modal-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-close');
      const targetModal = document.getElementById(modalId);
      if (targetModal) targetModal.classList.remove('open');
      if (modalId === 'loginModal') {
        const loginErrorAlert = document.getElementById('loginErrorAlert');
        if (loginErrorAlert) loginErrorAlert.style.display = 'none';
      }
    });
  });

  document.querySelectorAll('.modal-backdrop').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('open');
        const loginErrorAlert = document.getElementById('loginErrorAlert');
        if (loginErrorAlert) loginErrorAlert.style.display = 'none';
      }
    });
  });

  // 9. Reset to Defaults Demo Button (Admin Guarded)
  const resetBtn = document.getElementById('resetDataBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      requireAdmin(() => {
        if (confirm('Reset budget, members, and transactions back to initial demo data?')) {
          appState.resetToDefaults();
          renderAll();
          showToast('App reset to clean demo state.', 'info');
        }
      }, 'Admin login required to reset project ledger.');
    });
  }

  // 10. Export JSON Backup Button
  const exportBtn = document.getElementById('exportDataBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const dataBackup = {
        exportedAt: new Date().toISOString(),
        projectName: appState.projectName,
        budgetTarget: appState.budgetTarget,
        members: appState.members,
        expenses: appState.expenses,
        financialSummary: calculateRollingLedger(appState.expenses, appState.members)
      };

      const jsonStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataBackup, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", jsonStr);
      downloadAnchor.setAttribute("download", `graduation_project_budget_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      showToast('Financial ledger JSON backup downloaded.', 'success');
    });
  }
}

/* ============================================================================
   6. FIREBASE CLOUD DATABASE HOOKS & PLACEHOLDER FUNCTIONS
   ============================================================================ */

function firebaseSyncHook(state) {
  /*
  if (window.firebaseDB) {
    saveExpensesToFirebase(state.expenses);
  }
  */
}

function initFirebaseApp() {
  console.log('[Firebase Hook] Placeholder: Ready for Firebase credentials injection.');
}

function listenToFirebaseExpenses(onDataChanged) {
  console.log('[Firebase Hook] Placeholder: Ready for onSnapshot(expenses).');
}

function saveExpenseToFirebase(expenseObject) {
  console.log('[Firebase Hook] Placeholder: Saving expense to Cloud Firestore:', expenseObject);
}

/* ============================================================================
   7. APPLICATION BOOTSTRAPPER
   ============================================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Set default dates
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

  // Initialize Admin Authentication UI State
  updateAuthUI();

  // Initialize Firebase Hook placeholder
  initFirebaseApp();
});
