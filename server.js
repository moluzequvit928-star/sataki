const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

// Загрузка .env
try {
    const envPath = path.join(__dirname, '.env');
    if (fs.existsSync(envPath)) {
        const envText = fs.readFileSync(envPath, 'utf-8');
        envText.split('\n').forEach(line => {
            const trimmed = line.trim();
            if (trimmed && !trimmed.startsWith('#')) {
                const parts = trimmed.split('=');
                if (parts.length >= 2) {
                    const key = parts[0].trim();
                    const value = parts.slice(1).join('=').trim().replace(/^"|"$/g, '');
                    process.env[key] = value;
                }
            }
        });
        console.log('[ENV] Переменные загружены из .env');
    }
} catch (err) {
    console.warn('[ENV] Ошибка чтения .env:', err.message);
}

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN || '';
const IS_SELFBOT = process.env.IS_SELFBOT === 'true';

// Кеш профилей
const profileCache = new Map();
const CACHE_TIME = 1000 * 60 * 60;

async function fetchWithTimeout(url, options = {}, timeoutMs = 10000) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const res = await fetch(url, { ...options, signal: controller.signal });
        return res;
    } finally {
        clearTimeout(timer);
    }
}

async function getUserProfile(userId) {
    const cached = profileCache.get(userId);
    if (cached && (Date.now() - cached.time < CACHE_TIME)) return cached.data;

    const authHeader = DISCORD_BOT_TOKEN.startsWith('Bot ') || DISCORD_BOT_TOKEN.startsWith('Bearer ')
        ? DISCORD_BOT_TOKEN
        : (IS_SELFBOT ? DISCORD_BOT_TOKEN : `Bot ${DISCORD_BOT_TOKEN}`);

    try {
        const url = IS_SELFBOT
            ? `https://discord.com/api/v9/users/${userId}/profile`
            : `https://discord.com/api/v10/users/${userId}`;

        const response = await fetchWithTimeout(url, {
            headers: {
                'Authorization': authHeader,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        }, 10000);

        if (!response.ok) {
            console.warn(`[DISCORD] Ошибка для ID ${userId}: HTTP ${response.status}`);
            return null;
        }

        const rawData = await response.json();
        const data = IS_SELFBOT && rawData.user ? rawData.user : rawData;

        const avatarUrl = data.avatar
            ? `https://cdn.discordapp.com/avatars/${userId}/${data.avatar}.png`
            : `https://cdn.discordapp.com/embed/avatars/${parseInt(userId.slice(-4), 10) % 6}.png`;

        const profile = {
            id: userId,
            nick: data.global_name || data.username || `ID: ${userId}`,
            avatar: avatarUrl
        };

        profileCache.set(userId, { time: Date.now(), data: profile });
        return profile;
    } catch (err) {
        console.error(`[DISCORD ERROR] ID ${userId}:`, err.message);
        return null;
    }
}

app.use(cors());

// Роут для получения профиля Discord
app.get('/api/discord/:id', async (req, res) => {
    const profile = await getUserProfile(req.params.id);
    if (!profile) return res.status(404).send('Not found');
    res.json(profile);
});

// Статические файлы из папки public
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

app.get('*', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`[SERVER] SATAKI Легенда запущен на порту ${PORT}`);
    console.log(`[SERVER] Открой: http://localhost:${PORT}`);
});
