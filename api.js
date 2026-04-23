// ============================================================
// WC2026 BET - Frontend API Helper
// Shared between app.js and admin.js
// ============================================================
const API = {
    BASE: '',  // Same origin, no need for full URL

    // --- USERS ---
    async login(name, team) {
        const res = await fetch(`${this.BASE}/api/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, team })
        });
        return res.json();
    },

    async getUser(name) {
        const res = await fetch(`${this.BASE}/api/users/${encodeURIComponent(name)}`);
        if (!res.ok) return null;
        return res.json();
    },

    async getAllUsers() {
        const res = await fetch(`${this.BASE}/api/users`);
        return res.json();
    },

    // --- BETS ---
    async getAllBets() {
        const res = await fetch(`${this.BASE}/api/bets`);
        return res.json();
    },

    async getUserBets(userName) {
        const res = await fetch(`${this.BASE}/api/bets?user=${encodeURIComponent(userName)}`);
        return res.json();
    },

    async placeBet(betData) {
        const res = await fetch(`${this.BASE}/api/bets`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(betData)
        });
        return res.json();
    },

    async updateBet(id, data) {
        const res = await fetch(`${this.BASE}/api/bets/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return res.json();
    },

    async deleteBet(id) {
        const res = await fetch(`${this.BASE}/api/bets/${id}`, { method: 'DELETE' });
        return res.json();
    },

    async clearAllBets() {
        const res = await fetch(`${this.BASE}/api/bets`, { method: 'DELETE' });
        return res.json();
    },

    // --- ODDS ---
    async getOdds() {
        const res = await fetch(`${this.BASE}/api/odds`);
        return res.json();
    },

    async saveMatchOdds(data) {
        const res = await fetch(`${this.BASE}/api/odds/match`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return res.json();
    },

    async saveChampOdds(data) {
        const res = await fetch(`${this.BASE}/api/odds/champ`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return res.json();
    },

    async saveSpecialOdds(data) {
        const res = await fetch(`${this.BASE}/api/odds/special`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return res.json();
    },

    async resetMatchOdds() {
        const res = await fetch(`${this.BASE}/api/odds/match`, { method: 'DELETE' });
        return res.json();
    },

    async resetChampOdds() {
        const res = await fetch(`${this.BASE}/api/odds/champ`, { method: 'DELETE' });
        return res.json();
    },

    async resetSpecialOdds() {
        const res = await fetch(`${this.BASE}/api/odds/special`, { method: 'DELETE' });
        return res.json();
    },

    // --- LEADERBOARD ---
    async getLeaderboard() {
        const res = await fetch(`${this.BASE}/api/leaderboard`);
        return res.json();
    }
};
