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

