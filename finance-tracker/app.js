// DOM
const txForm = document.querySelector("#txForm");
const typeEl = document.querySelector("#type");
const categoryEl = document.querySelector("#category");
const amountEl = document.querySelector("#amount");
const dateEl = document.querySelector("#date");
const noteEl = document.querySelector("#note");

const incomeTotalEl = document.querySelector("#incomeTotal");
const expenseTotalEl = document.querySelector("#expenseTotal");
const balanceTotalEl = document.querySelector("#balanceTotal");

const txListEl = document.querySelector("#txList");
const emptyStateEl = document.querySelector("#emptyState");
const errorEl = document.querySelector("#error");
const clearAllBtn = document.querySelector("#clearAll");

//STATE

let transactions =[];

//HELPERS

function generateID() {
    return "t_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 8);
};

function formatLKR(n) {
    //simple currency formatting
    const num = Number(n) || 0;
    return "Rs " + num.toLocaleString("en-LK")
};

function setError(msg) {
    errorEl.textContent = msg || "";
};

function saveToStorage() {
    localStorage.setItem("spendwise_transactions", JSON.stringify(transactions));
}

function loadFromStorage() {
    const raw = localStorage.getItem("spendwise_transactions");
    if (!raw) return [];

    try {
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];
        return parsed;
    } catch {
        return [];
    }
}

// RENDER
function render() {
    renderTransactions();
    renderSummary();
    saveToStorage();
}

function renderTransactions() {
    txListEl.innerHTML = "";

    if (transactions.length === 0) {
        emptyStateEl.style.display = "block";
        return;
    }

    emptyStateEl.style.display = "none";

    //show latest first
    const sorted = [...transactions].sort((a,b) => (b.date || "").localCompare(a.date || ""));

    for (const tx of sorted) {
        const item = document.createElement("div");
        item.className = "tx";

        const badgeClass = tx.type === "income" ? "income" : "expense";
        const sign = tx.type === "income" ? "+" : "-";

        item.innerHTML = `
        <div>
            <div class="top">
                <span class="badge ${badgeClass}">${tx.type.toUpperCase()}/</span>
                <strong>${tx.category}</strong>
                <span class="meta>${tx.date || ""}</span>
            </div>
            <div class="meta">${tx.note ? tx.note : ""}</div>
        </div>

        <div style="display:flex; align-items:center; justify-content:flex-end;">
            <div class="amount>${sign} ${formatLKR(tx.amount)}</div>
            <button class="smallBtn" data-id="${tx.id}" title="delete">Delete</button>
        </div>
        `;

        txListEl.appendChild(item);
    }

    //one event listner for all delete buttons
    if (!txListEl.dataset.bound) {
        txListEl.addEventListener("click", (e) => {
            const btn = e.target.closet("button[data-id]");
            if (!btn) return;
            const id = btn.dataset.id;
            deleteTransaction(id);
        });

        txListEl.dataset.bound = true;
    }
}


function renderSummary() {
    let income = 0;
    let expense = 0;

    for (const tx of transactions) {
        const amt = Number(tx.amount) || 0;
        if (tx.type == "income") income += amt;
        else expense += amt;
    }

    const balance = income - expense;

    incomeTotalEl.textContent = formatLKR(income);
    emptyStateEl.textContent = formatLKR(expense);
    balanceTotalEl.textContent = formatLKR(balance);
}

