# PROJECT NEXUS // Team Budget Controller & Automated Accountant

An ultra-sleek, engineering-focused financial single-page dashboard designed for a fixed **6-member graduation project team**. It is completely dedicated to **Budget Planning, Expenditure Tracking, Direct Peer Debt Reimbursements, and 6-Member Continuous Rolling Accounting** formatted in Egyptian Pounds (EGP).

Built with **pure, modern vanilla HTML5, CSS3, and JavaScript (ES6+)** with **zero build tools or dependencies required**. Deployed directly to **GitHub Pages for free**, with whole integer accounting and modular placeholder hooks ready for **Firebase Realtime Database or Cloud Firestore**.

---

## 🌟 Key Features

### 1. Pure Integer Financial Architecture
- **Zero Decimals:** All payments, fair shares, budget calculations, and rolling balances use pure, clean whole Egyptian Pounds (e.g. `1,000 EGP`, `400 EGP`, `50 EGP`).
- **Input Control:** Form inputs enforce `step="1"` integer values. Quick-increment pills add whole numbers (`+50`, `+100`, `+250`, `+500`, `+1k`).

---

### 2. Team Budget Allocation & Consumption Tracker
- **Budget Target Ceiling:** Set and adjust your team's total budget target (e.g., `12,000 EGP`) with the **Set Budget** modal.
- **Dynamic Consumption Progress Bar:** Real-time percentage indicator tracking total team expenditures against the target:
  $$\text{Budget Utilized \%} = \left(\frac{\text{Total Expenditures}}{\text{Budget Target}}\right) \times 100\%$$
- **Smart Color Alerts:** Neon Cyan/Emerald when safely under budget, Amber warning when $\ge 80\%$, and Crimson Danger if budget is exceeded.
- **Remaining Budget KPI:** Instantly shows remaining budget available in EGP.

---

### 3. Dual-Mode Activity Logging Engine
Log either shared hardware expenditures or direct peer debt reimbursements:
*   **🛒 Project Purchase (Shared by 6):** Used when someone buys components, PCBs, 3D filament, or tools for the team. Increases total project expenditures and splits the fair share equally among all 6 members.
*   **💸 Direct Debt Payment (1-to-1):** Used when a teammate in debt pays a teammate who is owed money (e.g., via InstaPay, Vodafone Cash, or cash).
    - Reduces the paying member's debt (e.g., $-500\text{ EGP} \rightarrow \mathbf{-450\text{ EGP}}$).
    - Reduces the recipient's credit (e.g., $+500\text{ EGP} \rightarrow \mathbf{+450\text{ EGP}}$).
    - **Total project expenditure and the other 4 teammates remain completely untouched!**

---

### 4. Continuous Rolling 6-Member Ledger & Settlement Matrix
*   **Continuous Rolling Math:**
    1.  $\text{Total Cost} = \sum \text{Hardware Expenses}$
    2.  $\text{Fair Share} = \text{round}\left(\frac{\text{Total Cost}}{6}\right)$
    3.  $\text{Net Contribution}_k = \text{Hardware Paid}_k + \text{Transfers Sent}_k - \text{Transfers Received}_k$
    4.  $\text{Balance}_k = \text{Net Contribution}_k - \text{Fair Share}$
*   **Visual Balance Dashboard:**
    - **Emerald Green:** Teammates who are **owed money** by the group.
    - **Crimson Red:** Teammates who are **in debt** to the group.
    - **Slate Gray:** Fully settled teammates ($0\text{ EGP}$).
*   **Optimal Settlement Matrix:** Implements a **Greedy Bipartite Debt Simplification Algorithm** that computes the minimal number of direct transfers needed to balance everyone back to $0\text{ EGP}$.
*   **One-Click `⚡ Pay` Button:** Each settlement card has a direct pay button that pre-fills the transfer form so you can log partial (e.g. $50\text{ EGP}$) or full settlements in seconds.

---

### 5. Admin Authentication & View-Only Protection
Prevents accidental edits when sharing the website with teammates or supervisors:
- **Default View-Only Mode (`🔒 VIEW ONLY`):** Anyone with the link can explore all real-time financial stats, member balances, optimal settlement recommendations, and the complete transaction history without risk of accidental edits or deletions.
- **Interactive Login Rectangle Modal:**
  - Clicking the **Admin Login** button at the top opens the glassmorphic login rectangle popup.
  - Attempting to log a purchase, submit a payment, click `⚡ Pay`, change the budget ceiling, rename teammates, delete transactions, or reset data automatically prompts the login modal.
  - Once authenticated, previous pending actions immediately resume!
- **Admin Credentials:** Configurable inside `script.js` under `ADMIN_CREDENTIALS`.
- **Session-Based Security:** Authenticated state persists for the session (`sessionStorage`), meaning teammates visiting on their own devices will always default safely to view-only mode unless they explicitly log in.

---

## 📁 File Structure

```text
Graduation projoct paying website/
├── index.html        # Single-page financial dashboard & modals
├── styles.css        # Obsidian dark theme, frosted glass cards & responsive grid
├── script.js         # Reactive state manager, integer math ledger & Firebase hooks
└── README.md         # Documentation & deployment guide
```

---

## 🌐 Live Web Application

*   🔗 **Live on GitHub Pages:**  
    [https://eng-ahmed-mahran.github.io/graduation-project-tracker/](https://eng-ahmed-mahran.github.io/graduation-project-tracker/)

*   📂 **GitHub Repository:**  
    [https://github.com/Eng-Ahmed-Mahran/graduation-project-tracker](https://github.com/Eng-Ahmed-Mahran/graduation-project-tracker)
