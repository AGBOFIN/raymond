import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const today = new Date().toISOString().split('T')[0];
    const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];

    // Total patients
    const totalPatientsStmt = db.prepare('SELECT COUNT(*) as count FROM patients');
    const totalPatients = (totalPatientsStmt.get() as any).count;

    // Sessions completed today
    const todaySessionsStmt = db.prepare('SELECT COUNT(*) as count FROM sessions WHERE status = ? AND session_date = ?');
    const todaySessions = (todaySessionsStmt.get('completed', today) as any).count;

    // Sessions completed this month
    const monthSessionsStmt = db.prepare('SELECT COUNT(*) as count FROM sessions WHERE status = ? AND session_date >= ?');
    const monthSessions = (monthSessionsStmt.get('completed', monthStart) as any).count;

    // Revenue today (sum of amount_paid for completed sessions today)
    const todayRevenueStmt = db.prepare('SELECT COALESCE(SUM(amount_paid), 0) as total FROM sessions WHERE payment_status = ? AND payment_date = ?');
    const todayRevenue = (todayRevenueStmt.get('paid', today) as any).total;

    // Revenue this month
    const monthRevenueStmt = db.prepare('SELECT COALESCE(SUM(amount_paid), 0) as total FROM sessions WHERE payment_status = ? AND payment_date >= ?');
    const monthRevenue = (monthRevenueStmt.get('paid', monthStart) as any).total;

    // Sessions by status
    const sessionsByStatusStmt = db.prepare('SELECT status, COUNT(*) as count FROM sessions GROUP BY status');
    const sessionsByStatus = sessionsByStatusStmt.all();

    // Pending payments
    const pendingPaymentsStmt = db.prepare('SELECT COUNT(*) as count FROM sessions WHERE payment_status = ?');
    const pendingPayments = (pendingPaymentsStmt.get('pending') as any).count;

    // Total pending amount
    const pendingAmountStmt = db.prepare('SELECT COALESCE(SUM(price - amount_paid), 0) as total FROM sessions WHERE payment_status = ?');
    const pendingAmount = (pendingAmountStmt.get('pending') as any).total;

    // Recent patients (last 5)
    const recentPatientsStmt = db.prepare('SELECT id, first_name, last_name, phone, created_at FROM patients ORDER BY created_at DESC LIMIT 5');
    const recentPatients = recentPatientsStmt.all();

    // Upcoming sessions (next 7 days)
    const upcomingDate = new Date();
    upcomingDate.setDate(upcomingDate.getDate() + 7);
    const upcomingDateStr = upcomingDate.toISOString().split('T')[0];
    
    const upcomingSessionsStmt = db.prepare(`
      SELECT s.*, p.first_name, p.last_name 
      FROM sessions s 
      JOIN patients p ON s.patient_id = p.id 
      WHERE s.session_date >= ? AND s.session_date <= ? AND s.status = 'planned'
      ORDER BY s.session_date ASC
    `);
    const upcomingSessions = upcomingSessionsStmt.all(today, upcomingDateStr);

    return NextResponse.json({
      totalPatients,
      todaySessions,
      monthSessions,
      todayRevenue,
      monthRevenue,
      sessionsByStatus,
      pendingPayments,
      pendingAmount,
      recentPatients,
      upcomingSessions
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return NextResponse.json({ error: 'Failed to fetch statistics' }, { status: 500 });
  }
}
