// ============================================================
// WC2026 BET - Express-free Server (Pure Node.js)
// No external dependencies required!
// ============================================================
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'db.json');

// --- MIME TYPES ---
const MIME = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.ico': 'image/x-icon',
    '.svg': 'image/svg+xml'
};

// --- DATABASE HELPERS ---
function readDB() {
    try {
        if (!fs.existsSync(DB_FILE)) {
            const initial = { users: [], bets: [], customMatchOdds: {}, customChampOdds: {}, customSpecialOdds: {} };
            fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2));
            return initial;
        }
        return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    } catch (e) {
        console.error('DB read error:', e);
        return { users: [], bets: [], customMatchOdds: {}, customChampOdds: {}, customSpecialOdds: {} };
    }
}

function writeDB(data) {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    } catch (e) {
        console.error('DB write error:', e);
    }
}

// --- REQUEST HELPERS ---
function sendJSON(res, data, status = 200) {
    const body = JSON.stringify(data);
    res.writeHead(status, {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end(body);
}

function parseBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try { resolve(JSON.parse(body || '{}')); }
            catch (e) { resolve({}); }
        });
        req.on('error', reject);
    });
}

// --- STATIC FILE SERVER ---
function serveStatic(req, res) {
    let filePath = path.join(__dirname, req.url === '/' ? '/index.html' : req.url.split('?')[0]);
    const ext = path.extname(filePath);
    const mime = MIME[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end('Not Found');
            return;
        }
        res.writeHead(200, { 'Content-Type': mime });
        res.end(data);
    });
}

// ============================================================
// API ROUTES
// ============================================================
async function handleAPI(req, res) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;
    const method = req.method;

    // CORS preflight
    if (method === 'OPTIONS') {
        res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        });
        res.end();
        return;
    }

    // --- USERS ---
    if (pathname === '/api/users/login' && method === 'POST') {
        const { name, team } = await parseBody(req);
        if (!name) return sendJSON(res, { error: 'Tên không được trống' }, 400);
        const db = readDB();
        let user = db.users.find(u => u.name.toLowerCase() === name.toLowerCase());
        if (!user) {
            user = { name, team: team || '', balance: 1000000, createdAt: Date.now() };
            db.users.push(user);
            writeDB(db);
        }
        return sendJSON(res, user);
    }

    if (pathname === '/api/users' && method === 'GET') {
        return sendJSON(res, readDB().users);
    }

    if (pathname.startsWith('/api/users/') && method === 'GET') {
        const userName = decodeURIComponent(pathname.replace('/api/users/', ''));
        const user = readDB().users.find(u => u.name.toLowerCase() === userName.toLowerCase());
        if (!user) return sendJSON(res, { error: 'Không tìm thấy' }, 404);
        return sendJSON(res, user);
    }

    // --- BETS ---
    if (pathname === '/api/bets' && method === 'GET') {
        const db = readDB();
        const userFilter = url.searchParams.get('user');
        if (userFilter) {
            return sendJSON(res, db.bets.filter(b => b.userName && b.userName.toLowerCase() === userFilter.toLowerCase()));
        }
        return sendJSON(res, db.bets);
    }

    if (pathname === '/api/bets' && method === 'POST') {
        const { userName, label, pick, odds, amount, matchId, type } = await parseBody(req);
        if (!userName || !pick || !odds || !amount) return sendJSON(res, { error: 'Thiếu thông tin' }, 400);
        const db = readDB();
        const user = db.users.find(u => u.name.toLowerCase() === userName.toLowerCase());
        if (!user) return sendJSON(res, { error: 'Không tìm thấy người dùng' }, 404);
        if (user.balance < amount) return sendJSON(res, { error: 'Không đủ số dư' }, 400);
        user.balance -= amount;
        const bet = { id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5), userName: user.name, label, pick, odds, amount, matchId, type, timestamp: Date.now(), status: 'pending' };
        db.bets.push(bet);
        writeDB(db);
        return sendJSON(res, { bet, balance: user.balance });
    }

    if (pathname === '/api/bets' && method === 'DELETE') {
        const db = readDB();
        db.bets.forEach(b => {
            if (b.status === 'pending') {
                const user = db.users.find(u => u.name.toLowerCase() === b.userName.toLowerCase());
                if (user) user.balance += b.amount;
            }
        });
        db.bets = [];
        writeDB(db);
        return sendJSON(res, { success: true });
    }

    if (pathname.startsWith('/api/bets/') && method === 'PUT') {
        const betId = pathname.replace('/api/bets/', '');
        const { amount, status } = await parseBody(req);
        const db = readDB();
        const bet = db.bets.find(b => b.id == betId);
        if (!bet) return sendJSON(res, { error: 'Không tìm thấy cược' }, 404);
        const user = db.users.find(u => u.name.toLowerCase() === bet.userName.toLowerCase());
        if (amount !== undefined && amount !== bet.amount) {
            const diff = bet.amount - amount;
            if (user) user.balance += diff;
            bet.amount = amount;
        }
        if (status && status !== bet.status) {
            const oldStatus = bet.status;
            bet.status = status;
            if (user) {
                if (oldStatus === 'pending' && status === 'won') user.balance += bet.amount * bet.odds;
                else if (oldStatus === 'won' && status !== 'won') user.balance -= bet.amount * bet.odds;
                else if (oldStatus !== 'won' && status === 'won') user.balance += bet.amount * bet.odds;
            }
        }
        writeDB(db);
        return sendJSON(res, { bet, user });
    }

    if (pathname.startsWith('/api/bets/') && method === 'DELETE') {
        const betId = pathname.replace('/api/bets/', '');
        const db = readDB();
        const idx = db.bets.findIndex(b => b.id == betId);
        if (idx === -1) return sendJSON(res, { error: 'Không tìm thấy' }, 404);
        const bet = db.bets[idx];
        if (bet.status === 'pending') {
            const user = db.users.find(u => u.name.toLowerCase() === bet.userName.toLowerCase());
            if (user) user.balance += bet.amount;
        }
        db.bets.splice(idx, 1);
        writeDB(db);
        return sendJSON(res, { success: true });
    }

    // --- ODDS ---
    if (pathname === '/api/odds' && method === 'GET') {
        const db = readDB();
        return sendJSON(res, { match: db.customMatchOdds || {}, champ: db.customChampOdds || {}, special: db.customSpecialOdds || {} });
    }

    if (pathname === '/api/odds/match' && method === 'PUT') {
        const db = readDB();
        db.customMatchOdds = await parseBody(req);
        writeDB(db);
        return sendJSON(res, { success: true });
    }

    if (pathname === '/api/odds/champ' && method === 'PUT') {
        const db = readDB();
        db.customChampOdds = await parseBody(req);
        writeDB(db);
        return sendJSON(res, { success: true });
    }

    if (pathname === '/api/odds/special' && method === 'PUT') {
        const db = readDB();
        db.customSpecialOdds = await parseBody(req);
        writeDB(db);
        return sendJSON(res, { success: true });
    }

    if (pathname === '/api/odds/match' && method === 'DELETE') {
        const db = readDB();
        db.customMatchOdds = {};
        writeDB(db);
        return sendJSON(res, { success: true });
    }

    if (pathname === '/api/odds/champ' && method === 'DELETE') {
        const db = readDB();
        db.customChampOdds = {};
        writeDB(db);
        return sendJSON(res, { success: true });
    }

    if (pathname === '/api/odds/special' && method === 'DELETE') {
        const db = readDB();
        db.customSpecialOdds = {};
        writeDB(db);
        return sendJSON(res, { success: true });
    }

    // --- LEADERBOARD ---
    if (pathname === '/api/leaderboard' && method === 'GET') {
        const db = readDB();
        const board = db.users.map(u => {
            const myBets = db.bets.filter(b => b.userName.toLowerCase() === u.name.toLowerCase());
            const totalBets = myBets.length;
            const won = myBets.filter(b => b.status === 'won').length;
            const lost = myBets.filter(b => b.status === 'lost').length;
            const profit = myBets.filter(b => b.status === 'won').reduce((s, b) => s + b.amount * b.odds - b.amount, 0)
                         - myBets.filter(b => b.status === 'lost').reduce((s, b) => s + b.amount, 0);
            return { name: u.name, team: u.team, balance: u.balance, totalBets, won, lost, profit };
        });
        board.sort((a, b) => b.profit - a.profit);
        return sendJSON(res, board);
    }

    // 404 for unknown API routes
    return sendJSON(res, { error: 'Not found' }, 404);
}

// ============================================================
// HTTP SERVER
// ============================================================
const server = http.createServer((req, res) => {
    if (req.url.startsWith('/api/')) {
        handleAPI(req, res).catch(err => {
            console.error('API Error:', err);
            sendJSON(res, { error: 'Server error' }, 500);
        });
    } else {
        serveStatic(req, res);
    }
});

server.listen(PORT, '127.0.0.1', () => {
    console.log('');
    console.log('⚽ ========================================');
    console.log('   WC2026 BET - Server đang chạy!');
    console.log(`   🌐 Trang người dùng: http://localhost:${PORT}`);
    console.log(`   ⚙️  Trang admin:      http://localhost:${PORT}/admin.html`);
    console.log('   ========================================');
    console.log('');
});
