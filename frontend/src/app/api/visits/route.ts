import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// Tracks website visits. Persists to a JSON file so counts survive server restarts.

interface VisitorData {
  totalViews: number;
  totalVisitors: number;
  sessions: Record<string, { lastSeen: number; page: string }>;
  daily: Record<string, number>;
  hourly: Record<string, number>;
}

const DATA_FILE = path.join(process.cwd(), '.data', 'visits.json');

const defaultData: VisitorData = {
  totalViews: 0,
  totalVisitors: 0,
  sessions: {},
  daily: {},
  hourly: {},
};

async function readData(): Promise<VisitorData> {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8');
    return { ...defaultData, ...JSON.parse(raw) };
  } catch {
    return { ...defaultData };
  }
}

async function writeData(data: VisitorData) {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

function todayKey(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

function hourKey(date = new Date()): string {
  return date.toISOString().slice(0, 13);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const sessionId = typeof body.sessionId === 'string' ? body.sessionId : null;
    const page = typeof body.page === 'string' ? body.page : '/';
    const now = Date.now();

    const data = await readData();

    if (sessionId) {
      const existing = data.sessions[sessionId];
      // New visitor if we haven't seen this session before
      if (!existing) {
        data.totalVisitors += 1;
        data.sessions[sessionId] = { lastSeen: now, page };
      } else {
        data.sessions[sessionId].lastSeen = now;
        data.sessions[sessionId].page = page;
      }
    }

    data.totalViews += 1;
    const day = todayKey(new Date(now));
    data.daily[day] = (data.daily[day] || 0) + 1;
    const hour = hourKey(new Date(now));
    data.hourly[hour] = (data.hourly[hour] || 0) + 1;

    await writeData(data);

    return NextResponse.json({ success: true, totalViews: data.totalViews, totalVisitors: data.totalVisitors });
  } catch {
    return NextResponse.json({ success: true });
  }
}

export async function GET() {
  const data = await readData();
  const now = new Date();

  // Last 14 days of daily views
  const days: { date: string; views: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = todayKey(d);
    days.push({ date: key, views: data.daily[key] || 0 });
  }

  // Last 7 days of unique visitors
  const sevenDaysAgo = now.getTime() - 7 * 24 * 60 * 60 * 1000;
  const visitorsThisWeek = Object.values(data.sessions).filter(
    (s) => s.lastSeen >= sevenDaysAgo
  ).length;

  const todayViews = data.daily[todayKey(now)] || 0;

  const last30Days = new Date(now);
  last30Days.setDate(last30Days.getDate() - 30);
  const visitors30d = Object.values(data.sessions).filter(
    (s) => s.lastSeen >= last30Days.getTime()
  ).length;

  return NextResponse.json({
    success: true,
    data: {
      totalViews: data.totalViews,
      totalVisitors: data.totalVisitors,
      visitorsToday: visitorsThisWeek && data.daily[todayKey(now)]
        ? Object.values(data.sessions).filter(
            (s) => new Date(s.lastSeen).toISOString().slice(0, 10) === todayKey(now)
          ).length
        : 0,
      todayViews,
      visitorsThisWeek,
      visitorsLast30Days: visitors30d,
      daily: days,
      hourly: data.hourly,
    },
  });
}
