# PROJECT NEXUS // Graduation Project Stage Tracker & Automated Team Accountant

An ultra-sleek, engineering-focused single-page dashboard designed for a fixed **6-member graduation project team**. It combines an interactive **Engineering Milestone & Stage Tracker** with a **Continuous Rolling Accountant & Expense Ledger** formatted in Egyptian Pounds (EGP).

Built with **pure, modern vanilla HTML5, CSS3, and JavaScript (ES6+)** with **zero build tools, node_modules, or external dependencies required**. Works immediately in any modern browser, hosts directly on **GitHub Pages for free**, and includes explicit, modular placeholder hooks ready for **Firebase Realtime Database or Cloud Firestore**.

---

## 🌟 Key Features

### 1. Modern Engineering Glassmorphism UI/UX
- **Deep Dark Aesthetic:** Engineered with an obsidian palette (`#07090e`, `#111827`) and radial ambient mesh glows.
- **Glassmorphic Cards:** Translucent frosted glass widgets (`backdrop-filter: blur(16px)`), crisp hairline borders, and layered elevation shadows.
- **Vibrant Accent Neon:**
  - **Neon Cyan (`#00f2fe`)**: Progress indicators, highlights, and controls.
  - **Emerald Green (`#10b981`)**: Positive balances (teammates who are **owed money**).
  - **Crimson / Rose (`#f43f5e`)**: Negative balances (teammates who are **in debt**).
  - **Electric Purple & Amber**: Stage milestones and status chips.
- **Micro-Interactions:** Smooth hover transforms, button ripple glows, animated SVG icons, and a real-time reactive progress bar.
- **100% Fully Responsive:** Adapts from mobile phone viewports (375px) up to 4K desktop displays.

---

### 2. Section A: The Project Stage Tracker
- **Pre-Loaded Engineering Stages:**
  1. Problem Definition & Requirements Specification *(Completed)*
  2. System Architecture & Component Sourcing *(Completed)*
  3. Hardware Purchasing & Core Components *(In Progress)*
  4. PCB Schematic Design, Simulation & Layout *(In Progress)*
  5. Microcontroller Firmware & Driver Integration *(Pending)*
  6. Chassis Fabrication & Mechanical Assembly *(Pending)*
  7. Comprehensive System Testing & Calibration *(Pending)*
  8. Final Engineering Thesis & Defense Presentation *(Pending)*
- **Interactive Controls:**
  - One-click toggling between **Pending**, **In Progress**, and **Completed**.
  - Add custom milestone stages with deadline dates and deliverable notes.
  - Filter by *All*, *In Progress*, or *Completed*.
- **Top Dynamic Progress Bar:** Continuously calculates:
  $$\text{Completion \%} = \left(\frac{\text{Completed Stages}}{\text{Total Stages}}\right) \times 100\%$$

---

### 3. Section B: The "Living" Rolling Ledger & Accountant

#### 🧮 Mathematical Logic (Strict Continuous Rolling Ledger)
This application implements continuous rolling debt tracking for the 6 team members:
1. **Total Project Cost:**
   $$\text{Total Project Cost} = \sum_{i=1}^{N} \text{Expense}_i$$
2. **Fair Share per Person:**
   $$\text{Fair Share} = \frac{\text{Total Project Cost}}{6}$$
3. **Current Rolling Net Balance:**
   $$\text{Current Balance}_k = \text{Total Paid}_k - \text{Fair Share}$$
   - **Positive ($> 0$):** Displayed in **Emerald Green** (the group owes this member).
   - **Negative ($< 0$):** Displayed in **Crimson Red** (this member owes the group).
   - **Zero ($0.00$):** Settled in slate gray.
4. **Continuous Dynamic Recalculation:**
   - When Person D pays 0 EGP and is in debt by $-416.66$ EGP, and later Person A purchases hardware for $600$ EGP:
     - New Total increases by $600$ EGP.
     - Fair share automatically recalculates for everyone ($+100$ EGP each).
     - Person D's debt automatically updates to $-516.66$ EGP without manual adjustments!
5. **Mathematical Equilibrium Verification:**
   The sum of all 6 net balances is continuously checked:
   $$\sum_{k=1}^{6} \text{Current Balance}_k = 0.00\text{ EGP}$$

#### 💡 Bonus: Optimal Settlement Matrix
The application runs a **Greedy Bipartite Debt Simplification Algorithm** that computes the minimal number of direct peer-to-peer transfers required to bring everyone back to a $0.00\text{ EGP}$ equilibrium (e.g., *"Mohamed pays Ahmed 350.00 EGP"*).

---

## 📁 File Structure

```text
Graduation projoct paying website/
├── index.html        # Semantic HTML5 single-page application structure & modals
├── styles.css        # Pure CSS3 glassmorphism styling, responsive grid & animations
├── script.js         # Reactive state manager, math ledger engine & Firebase hooks
└── README.md         # Deployment & Firebase integration documentation
```

---

## 🚀 How to Deploy on GitHub Pages (Free Hosting)

1. **Verify Git & GitHub CLI:**
   Git and GitHub CLI are now installed on your PC.
   Open PowerShell in this directory:
   ```powershell
   gh auth login
   ```
   *(Select `GitHub.com`, `HTTPS`, and authenticate in your browser with one click).*

2. **Create Remote Repository & Push:**
   ```powershell
   gh repo create "graduation-project-tracker" --public --source=. --remote=origin --push
   ```
   *(Or push to an existing repository):*
   ```powershell
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```

3. **Enable GitHub Pages:**
   - In your GitHub repository, click on **Settings** > **Pages** (in the left sidebar).
   - Under **Build and deployment** > **Source**, choose **Deploy from a branch**.
   - Select branch `main` and folder `/(root)`, then click **Save**.
   - In ~60 seconds, your project is live at:
     `https://<your-username>.github.io/<your-repo-name>/`

---

## ⚡ Firebase Realtime Database / Firestore Integration

The code in `script.js` has dedicated, modular placeholder functions ready for Cloud Firestore or Firebase Realtime Database.

### Step 1: Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/) and click **Add project**.
2. Enable **Cloud Firestore** (or **Realtime Database**) in test mode or with authenticated team rules.
3. In Project Settings, register a Web App (`</>`) to receive your `firebaseConfig` object.

### Step 2: Inject the Firebase SDK
In `index.html`, add the Firebase module script tag just before `script.js`:
```html
<script type="module">
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
  import { 
    getFirestore, 
    collection, 
    onSnapshot, 
    doc, 
    setDoc, 
    deleteDoc 
  } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

  const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "SENDER_ID",
    appId: "APP_ID"
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  window.firebaseDB = db;

  // Real-time synchronization
  onSnapshot(collection(db, "expenses"), (snapshot) => {
    const remoteExpenses = [];
    snapshot.forEach(docSnap => remoteExpenses.push({ id: docSnap.id, ...docSnap.data() }));
    if (remoteExpenses.length > 0) {
      window.appState.expenses = remoteExpenses;
      window.renderAll();
    }
  });

  onSnapshot(collection(db, "stages"), (snapshot) => {
    const remoteStages = [];
    snapshot.forEach(docSnap => remoteStages.push({ id: docSnap.id, ...docSnap.data() }));
    if (remoteStages.length > 0) {
      window.appState.stages = remoteStages;
      window.renderAll();
    }
  });
</script>
```

### Step 3: Local Fallback
When Firebase is not yet hooked up, the app automatically persists everything inside `localStorage`, so you can start tracking expenses and stages right now!

---

## 👥 Customizing Your Team
Click the **Team** button in the top navigation header to customize all 6 teammates' names and engineering disciplines. All previous transactions and future rolling calculations will automatically bind to their updated names.
