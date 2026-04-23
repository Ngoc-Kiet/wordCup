// ============================================================
// World Cup 2026 - Complete Data
// ============================================================

const WC2026 = {
    // Tournament Info
    tournament: {
        name: "FIFA World Cup 2026™",
        hosts: ["USA", "Mexico", "Canada"],
        startDate: "2026-06-11",
        endDate: "2026-07-19",
        totalTeams: 48,
        totalMatches: 104,
        totalVenues: 16,
        finalVenue: "MetLife Stadium, New York/New Jersey",
        openingMatch: "Estadio Azteca, Mexico City"
    },

    // Team flags (emoji)
    flags: {
        "Mexico": "🇲🇽", "South Africa": "🇿🇦", "South Korea": "🇰🇷", "Czech Republic": "🇨🇿",
        "Canada": "🇨🇦", "Bosnia": "🇧🇦", "Qatar": "🇶🇦", "Switzerland": "🇨🇭",
        "Brazil": "🇧🇷", "Morocco": "🇲🇦", "Haiti": "🇭🇹", "Scotland": "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
        "USA": "🇺🇸", "Paraguay": "🇵🇾", "Australia": "🇦🇺", "Turkey": "🇹🇷",
        "Germany": "🇩🇪", "Curaçao": "🇨🇼", "Ivory Coast": "🇨🇮", "Ecuador": "🇪🇨",
        "Netherlands": "🇳🇱", "Japan": "🇯🇵", "Poland": "🇵🇱", "Tunisia": "🇹🇳",
        "Belgium": "🇧🇪", "Egypt": "🇪🇬", "Iran": "🇮🇷", "New Zealand": "🇳🇿",
        "Spain": "🇪🇸", "Cape Verde": "🇨🇻", "Saudi Arabia": "🇸🇦", "Uruguay": "🇺🇾",
        "France": "🇫🇷", "Senegal": "🇸🇳", "Indonesia": "🇮🇩", "Norway": "🇳🇴",
        "Argentina": "🇦🇷", "Algeria": "🇩🇿", "Austria": "🇦🇹", "Jordan": "🇯🇴",
        "Portugal": "🇵🇹", "Trinidad": "🇹🇹", "Uzbekistan": "🇺🇿", "Colombia": "🇨🇴",
        "England": "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "Croatia": "🇭🇷", "Ghana": "🇬🇭", "Panama": "🇵🇦"
    },

    // FIFA Rankings (approximate for odds calculation)
    rankings: {
        "Argentina": 1, "France": 2, "Brazil": 3, "England": 4, "Belgium": 5,
        "Netherlands": 6, "Portugal": 7, "Spain": 8, "Germany": 9, "Croatia": 10,
        "Uruguay": 11, "Colombia": 12, "USA": 13, "Mexico": 14, "Morocco": 15,
        "Switzerland": 16, "Japan": 17, "Senegal": 18, "Iran": 19, "South Korea": 20,
        "Australia": 21, "Ecuador": 22, "Tunisia": 23, "Turkey": 24, "Poland": 25,
        "Austria": 26, "Czech Republic": 27, "Scotland": 28, "Norway": 29, "Algeria": 30,
        "Egypt": 31, "Ivory Coast": 32, "Canada": 33, "Paraguay": 34, "Ghana": 35,
        "Saudi Arabia": 36, "Panama": 37, "Qatar": 38, "Jordan": 39, "Uzbekistan": 40,
        "Bosnia": 41, "Cape Verde": 42, "South Africa": 43, "New Zealand": 44,
        "Haiti": 45, "Curaçao": 46, "Trinidad": 47, "Indonesia": 48
    },

    // 12 Groups
    groups: {
        "A": {
            name: "Bảng A",
            teams: ["Mexico", "South Africa", "South Korea", "Czech Republic"],
            venue: "Mexico City / Dallas"
        },
        "B": {
            name: "Bảng B",
            teams: ["Canada", "Bosnia", "Qatar", "Switzerland"],
            venue: "Toronto / Vancouver"
        },
        "C": {
            name: "Bảng C",
            teams: ["Brazil", "Morocco", "Haiti", "Scotland"],
            venue: "Los Angeles / Seattle"
        },
        "D": {
            name: "Bảng D",
            teams: ["USA", "Paraguay", "Australia", "Turkey"],
            venue: "Atlanta / Philadelphia"
        },
        "E": {
            name: "Bảng E",
            teams: ["Germany", "Curaçao", "Ivory Coast", "Ecuador"],
            venue: "Houston / Dallas"
        },
        "F": {
            name: "Bảng F",
            teams: ["Netherlands", "Japan", "Poland", "Tunisia"],
            venue: "Miami / Boston"
        },
        "G": {
            name: "Bảng G",
            teams: ["Belgium", "Egypt", "Iran", "New Zealand"],
            venue: "San Francisco / Kansas City"
        },
        "H": {
            name: "Bảng H",
            teams: ["Spain", "Cape Verde", "Saudi Arabia", "Uruguay"],
            venue: "Guadalajara / Monterrey"
        },
        "I": {
            name: "Bảng I",
            teams: ["France", "Senegal", "Indonesia", "Norway"],
            venue: "Atlanta / Houston"
        },
        "J": {
            name: "Bảng J",
            teams: ["Argentina", "Algeria", "Austria", "Jordan"],
            venue: "Miami / New York"
        },
        "K": {
            name: "Bảng K",
            teams: ["Portugal", "Trinidad", "Uzbekistan", "Colombia"],
            venue: "Dallas / Philadelphia"
        },
        "L": {
            name: "Bảng L",
            teams: ["England", "Croatia", "Ghana", "Panama"],
            venue: "Seattle / Boston"
        }
    },

    // Venues
    venues: [
        { city: "Mexico City", country: "Mexico", stadium: "Estadio Azteca", capacity: 87523 },
        { city: "Guadalajara", country: "Mexico", stadium: "Estadio Akron", capacity: 49850 },
        { city: "Monterrey", country: "Mexico", stadium: "Estadio BBVA", capacity: 53500 },
        { city: "Toronto", country: "Canada", stadium: "BMO Field", capacity: 45736 },
        { city: "Vancouver", country: "Canada", stadium: "BC Place", capacity: 54500 },
        { city: "New York/NJ", country: "USA", stadium: "MetLife Stadium", capacity: 82500 },
        { city: "Los Angeles", country: "USA", stadium: "SoFi Stadium", capacity: 70240 },
        { city: "Dallas", country: "USA", stadium: "AT&T Stadium", capacity: 92967 },
        { city: "Atlanta", country: "USA", stadium: "Mercedes-Benz Stadium", capacity: 71000 },
        { city: "Houston", country: "USA", stadium: "NRG Stadium", capacity: 72220 },
        { city: "Miami", country: "USA", stadium: "Hard Rock Stadium", capacity: 64767 },
        { city: "Philadelphia", country: "USA", stadium: "Lincoln Financial Field", capacity: 69176 },
        { city: "Seattle", country: "USA", stadium: "Lumen Field", capacity: 69000 },
        { city: "San Francisco", country: "USA", stadium: "Levi's Stadium", capacity: 68500 },
        { city: "Kansas City", country: "USA", stadium: "Arrowhead Stadium", capacity: 76416 },
        { city: "Boston", country: "USA", stadium: "Gillette Stadium", capacity: 65878 }
    ]
};

// ============================================================
// Generate Group Stage Matches
// ============================================================
function generateGroupMatches() {
    const matches = [];
    let matchId = 1;
    const baseDate = new Date("2026-06-11T18:00:00");

    Object.entries(WC2026.groups).forEach(([groupKey, group], gIdx) => {
        const teams = group.teams;
        // Round 1: 0v1, 2v3
        // Round 2: 0v2, 1v3
        // Round 3: 0v3, 1v2
        const pairings = [
            [[0, 1], [2, 3]],
            [[0, 2], [1, 3]],
            [[0, 3], [1, 2]]
        ];

        pairings.forEach((round, rIdx) => {
            round.forEach((pair, pIdx) => {
                const dayOffset = gIdx * 1 + rIdx * 6;
                const matchDate = new Date(baseDate);
                matchDate.setDate(matchDate.getDate() + dayOffset);
                matchDate.setHours(pIdx === 0 ? 18 : 21);

                matches.push({
                    id: matchId++,
                    stage: "group",
                    group: groupKey,
                    team1: teams[pair[0]],
                    team2: teams[pair[1]],
                    date: matchDate.toISOString().split('T')[0],
                    time: matchDate.getHours() + ":00",
                    venue: group.venue.split(" / ")[pIdx % 2],
                    round: rIdx + 1,
                    score1: null,
                    score2: null,
                    status: "upcoming" // upcoming, live, finished
                });
            });
        });
    });

    return matches;
}

// Generate knockout matches (placeholders)
function generateKnockoutMatches(startId) {
    const matches = [];
    let id = startId;

    // Round of 32 (16 matches)
    for (let i = 0; i < 16; i++) {
        const d = new Date("2026-06-28");
        d.setDate(d.getDate() + Math.floor(i / 4));
        matches.push({
            id: id++,
            stage: "r32",
            stageLabel: "Vòng 32",
            team1: "TBD",
            team2: "TBD",
            date: d.toISOString().split('T')[0],
            time: (16 + (i % 4) * 2) + ":00",
            venue: WC2026.venues[i % 16].city,
            score1: null, score2: null,
            status: "upcoming"
        });
    }

    // Round of 16 (8 matches)
    for (let i = 0; i < 8; i++) {
        const d = new Date("2026-07-04");
        d.setDate(d.getDate() + Math.floor(i / 4));
        matches.push({
            id: id++,
            stage: "r16",
            stageLabel: "Vòng 16",
            team1: "TBD",
            team2: "TBD",
            date: d.toISOString().split('T')[0],
            time: (17 + (i % 4) * 2) + ":00",
            venue: WC2026.venues[i % 8].city,
            score1: null, score2: null,
            status: "upcoming"
        });
    }

    // Quarter-finals (4 matches)
    for (let i = 0; i < 4; i++) {
        const d = new Date("2026-07-09");
        d.setDate(d.getDate() + Math.floor(i / 2));
        matches.push({
            id: id++,
            stage: "quarter",
            stageLabel: "Tứ kết",
            team1: "TBD",
            team2: "TBD",
            date: d.toISOString().split('T')[0],
            time: (18 + (i % 2) * 3) + ":00",
            venue: WC2026.venues[i].city,
            score1: null, score2: null,
            status: "upcoming"
        });
    }

    // Semi-finals (2 matches)
    for (let i = 0; i < 2; i++) {
        matches.push({
            id: id++,
            stage: "semi",
            stageLabel: "Bán kết",
            team1: "TBD",
            team2: "TBD",
            date: "2026-07-1" + (4 + i),
            time: "20:00",
            venue: i === 0 ? "Dallas" : "Atlanta",
            score1: null, score2: null,
            status: "upcoming"
        });
    }

    // Bronze Final
    matches.push({
        id: id++,
        stage: "final",
        stageLabel: "Tranh hạng 3",
        team1: "TBD",
        team2: "TBD",
        date: "2026-07-18",
        time: "20:00",
        venue: "Miami",
        score1: null, score2: null,
        status: "upcoming"
    });

    // Final
    matches.push({
        id: id++,
        stage: "final",
        stageLabel: "🏆 CHUNG KẾT",
        team1: "TBD",
        team2: "TBD",
        date: "2026-07-19",
        time: "20:00",
        venue: "MetLife Stadium, New York/NJ",
        score1: null, score2: null,
        status: "upcoming"
    });

    return matches;
}

// Championship odds
const championshipOdds = [
    { team: "Argentina", odds: 4.5 },
    { team: "France", odds: 5.0 },
    { team: "Brazil", odds: 6.0 },
    { team: "England", odds: 7.0 },
    { team: "Spain", odds: 8.0 },
    { team: "Germany", odds: 9.0 },
    { team: "Portugal", odds: 10.0 },
    { team: "Netherlands", odds: 12.0 },
    { team: "Belgium", odds: 15.0 },
    { team: "Croatia", odds: 20.0 },
    { team: "Uruguay", odds: 25.0 },
    { team: "Colombia", odds: 30.0 },
    { team: "USA", odds: 15.0 },
    { team: "Mexico", odds: 25.0 },
    { team: "Japan", odds: 35.0 },
    { team: "Morocco", odds: 30.0 },
    { team: "South Korea", odds: 40.0 },
    { team: "Switzerland", odds: 35.0 },
    { team: "Senegal", odds: 50.0 },
    { team: "Canada", odds: 40.0 }
];

// Special bets
const specialBets = [
    {
        id: "sp1",
        title: "🥇 Vua phá lưới",
        description: "Ai sẽ là Vua phá lưới World Cup 2026?",
        options: [
            { label: "Kylian Mbappé (France)", odds: 6.0 },
            { label: "Lionel Messi (Argentina)", odds: 8.0 },
            { label: "Harry Kane (England)", odds: 7.0 },
            { label: "Erling Haaland (Norway)", odds: 5.5 },
            { label: "Vinícius Jr (Brazil)", odds: 9.0 },
            { label: "Lamine Yamal (Spain)", odds: 10.0 }
        ]
    },
    {
        id: "sp2",
        title: "🏆 Cầu thủ xuất sắc nhất",
        description: "Ai sẽ nhận Quả bóng vàng?",
        options: [
            { label: "Kylian Mbappé", odds: 5.0 },
            { label: "Lionel Messi", odds: 7.0 },
            { label: "Jude Bellingham", odds: 8.0 },
            { label: "Vinícius Jr", odds: 6.5 },
            { label: "Erling Haaland", odds: 9.0 },
            { label: "Lamine Yamal", odds: 12.0 }
        ]
    },
    {
        id: "sp3",
        title: "⚽ Tổng số bàn thắng",
        description: "Dự đoán tổng số bàn thắng của giải đấu",
        options: [
            { label: "Dưới 140 bàn", odds: 3.0 },
            { label: "140 - 160 bàn", odds: 2.5 },
            { label: "160 - 180 bàn", odds: 2.2 },
            { label: "Trên 180 bàn", odds: 3.5 }
        ]
    },
    {
        id: "sp4",
        title: "🎭 Bất ngờ lớn nhất",
        description: "Đội nào sẽ tạo nên cú sốc?",
        options: [
            { label: "Haiti vào vòng 32", odds: 15.0 },
            { label: "Indonesia vào vòng 32", odds: 20.0 },
            { label: "New Zealand vào vòng 16", odds: 50.0 },
            { label: "Curaçao thắng Germany", odds: 100.0 }
        ]
    }
];

// Generate sample leaderboard
const samplePlayers = [
    { name: "Minh Nguyễn", team: "Argentina", totalBets: 15, wins: 10, losses: 5, profit: 850000 },
    { name: "Hoàng Trần", team: "Brazil", totalBets: 12, wins: 8, losses: 4, profit: 620000 },
    { name: "Tuấn Phạm", team: "France", totalBets: 18, wins: 11, losses: 7, profit: 480000 },
    { name: "Hùng Lê", team: "England", totalBets: 10, wins: 7, losses: 3, profit: 350000 },
    { name: "Dũng Võ", team: "Spain", totalBets: 14, wins: 8, losses: 6, profit: 290000 },
    { name: "Thắng Đỗ", team: "Germany", totalBets: 9, wins: 5, losses: 4, profit: 180000 },
    { name: "Nam Bùi", team: "Portugal", totalBets: 11, wins: 6, losses: 5, profit: 120000 },
    { name: "Đức Hoàng", team: "Netherlands", totalBets: 8, wins: 4, losses: 4, profit: 50000 },
    { name: "Quang Ngô", team: "Belgium", totalBets: 7, wins: 3, losses: 4, profit: -80000 },
    { name: "Long Trịnh", team: "Croatia", totalBets: 13, wins: 5, losses: 8, profit: -150000 }
];
