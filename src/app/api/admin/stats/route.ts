import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const today = new Date().toISOString().split('T')[0];
    const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
    const upcomingDate = new Date();
    upcomingDate.setDate(upcomingDate.getDate() + 7);
    const upcomingDateStr = upcomingDate.toISOString().split('T')[0];

    // Total patients
    const { count: totalPatients } = await supabase
      .from('patients')
      .select('*', { count: 'exact', head: true });

    // Sessions completed today
    const { count: todaySessions } = await supabase
      .from('sessions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed')
      .eq('session_date', today);

    // Sessions completed this month
    const { count: monthSessions } = await supabase
      .from('sessions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed')
      .gte('session_date', monthStart);

    // Revenue today
    const { data: todayRevenueData } = await supabase
      .from('sessions')
      .select('amount_paid')
      .eq('payment_status', 'paid')
      .eq('payment_date', today);
    const todayRevenue = todayRevenueData?.reduce((sum, s) => sum + (Number(s.amount_paid) || 0), 0) || 0;

    // Revenue this month
    const { data: monthRevenueData } = await supabase
      .from('sessions')
      .select('amount_paid')
      .eq('payment_status', 'paid')
      .gte('payment_date', monthStart);
    const monthRevenue = monthRevenueData?.reduce((sum, s) => sum + (Number(s.amount_paid) || 0), 0) || 0;

    // Sessions by status
    const { data: sessionsByStatus } = await supabase
      .from('sessions')
      .select('status');

    const statusCounts = sessionsByStatus?.reduce((acc: any, s) => {
      acc[s.status] = (acc[s.status] || 0) + 1;
      return acc;
    }, {}) || {};

    const sessionsByStatusArray = Object.entries(statusCounts).map(([status, count]) => ({ status, count }));

    // Pending payments
    const { count: pendingPayments } = await supabase
      .from('sessions')
      .select('*', { count: 'exact', head: true })
      .eq('payment_status', 'pending');

    // Total pending amount
    const { data: pendingAmountData } = await supabase
      .from('sessions')
      .select('price, amount_paid')
      .eq('payment_status', 'pending');
    const pendingAmount = pendingAmountData?.reduce((sum, s) => sum + (Number(s.price) - Number(s.amount_paid)), 0) || 0;

    // Recent patients (last 5)
    const { data: recentPatients } = await supabase
      .from('patients')
      .select('id, first_name, last_name, phone, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    // Upcoming sessions (next 7 days)
    const { data: upcomingSessions } = await supabase
      .from('sessions')
      .select('*, patients(first_name, last_name)')
      .gte('session_date', today)
      .lte('session_date', upcomingDateStr)
      .eq('status', 'planned')
      .order('session_date', { ascending: true });

    return NextResponse.json({
      totalPatients: totalPatients || 0,
      todaySessions: todaySessions || 0,
      monthSessions: monthSessions || 0,
      todayRevenue,
      monthRevenue,
      sessionsByStatus: sessionsByStatusArray,
      pendingPayments: pendingPayments || 0,
      pendingAmount,
      recentPatients: recentPatients || [],
      upcomingSessions: upcomingSessions?.map(s => ({
        ...s,
        first_name: s.patients?.first_name,
        last_name: s.patients?.last_name
      })) || []
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return NextResponse.json({ error: 'Failed to fetch statistics' }, { status: 500 });
  }
}
