import { useState, useEffect } from 'react';
import { ref, get } from 'firebase/database';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import { emailToKey, formatMoney, formatNumber, formatDateLabel } from '../firebase/utils';
import Layout from '../components/Layout';
import styles from './Dashboard.module.css';

function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    dailyEarning: 0,
    dailyCPM: 0,
    totalEarning: 0,
    totalImpressions: 0,
    overallCPM: 0,
    withdrawnAmount: 0
  });
  const [dailyData, setDailyData] = useState([]);
  const [yesterdayEarning, setYesterdayEarning] = useState(0);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user?.email) return;

      try {
        const email = user.email;
        const emailKey = emailToKey(email);

        const userRef = ref(db, 'users/' + emailKey);
        const snap = await get(userRef);

        if (!snap.exists()) {
          setError('Database node nahi mila. Pehle signup page se user create hua hona chahiye.');
          setLoading(false);
          return;
        }

        const data = snap.val() || {};
        const profile = data.profile || {};
        const dash = data.dashboard || {};
        const wallet = data.wallet || {};
        const dailyMap = dash.daily || {};

        // Set stats (EXACT same as HTML)
        setStats({
          dailyEarning: dash.dailyEarning || 0,
          dailyCPM: dash.dailyCPM || 0,
          totalEarning: dash.totalEarning || 0,
          totalImpressions: dash.totalImpressions || 0,
          overallCPM: dash.overallCPM || 0,
          withdrawnAmount: dash.withdrawnAmount || wallet.totalWithdrawn || 0
        });

        // Process daily data (EXACT same as HTML)
        const entries = Object.entries(dailyMap);
        if (entries.length) {
          // Sort desc by date key (latest upar) - same as HTML
          entries.sort((a, b) => (a[0] < b[0] ? 1 : -1));
          
          // Maximum 90 entries (same as HTML)
          const list = entries.slice(0, 90);
          setDailyData(list);

          // Yesterday earning (2nd entry agar hai) - same as HTML
          if (list.length > 1) {
            setYesterdayEarning(list[1][1].earning || 0);
          } else {
            setYesterdayEarning(0);
          }
        } else {
          setDailyData([]);
          setYesterdayEarning(0);
        }

        console.log('✅ Dashboard data loaded from RTDB');
        setLoading(false);
      } catch (err) {
        console.error('Dashboard load error:', err);
        setError('Dashboard load karte waqt error: ' + (err.code || err.message));
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

  if (loading) {
    return (
      <Layout activeNav="dashboard">
        <div className={styles.loading}>Loading dashboard...</div>
      </Layout>
    );
  }

  return (
    <Layout activeNav="dashboard">
      <div className={styles.mainInner}>
        {/* Title */}
        <div className={styles.pageTitle}>
          <div>
            <h1>Dashboard</h1>
            <p>Daily stats + overall earning ka clean overview.</p>
          </div>
          <div className={styles.tagSmall}>
            <span className={styles.tagDot}></span>
            <span>Live · Panel Data (USD)</span>
          </div>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        {/* TOP STATS (6 CARDS) */}
        <section className={styles.statsGrid}>
          {/* Daily Earning */}
          <div className={`${styles.card} ${styles.highlightCard}`}>
            <div className={styles.highlightBg}></div>
            <div className={styles.highlightInner}>
              <div className={styles.statLabel}>
                <span>Daily Earning</span>
                <span className={`${styles.badge} ${styles.badgeGreen}`}>Today</span>
              </div>
              <div className={styles.statValue}>$ {formatMoney(stats.dailyEarning)}</div>
              <div className={styles.statSub}>Yesterday: $ {formatMoney(yesterdayEarning)}</div>
              <div className={styles.hint}>Aaj ka total earning (00:00 se abhi tak), USD me.</div>
            </div>
          </div>

          {/* Daily CPM */}
          <div className={styles.card}>
            <div className={styles.statLabel}>
              <span>Daily CPM</span>
            </div>
            <div className={styles.statValue}>$ {formatMoney(stats.dailyCPM)}</div>
            <div className={styles.statSub}>Aaj ka average CPM per 1000 impressions.</div>
          </div>

          {/* Total Earning */}
          <div className={styles.card}>
            <div className={styles.statLabel}>
              <span>Total Earning</span>
            </div>
            <div className={styles.statValue}>$ {formatMoney(stats.totalEarning)}</div>
            <div className={styles.statSub}>Panel start hone se ab tak ka total (lifetime).</div>
          </div>

          {/* Total Impressions */}
          <div className={styles.card}>
            <div className={styles.statLabel}>
              <span>Total Impressions</span>
            </div>
            <div className={styles.statValue}>{formatNumber(stats.totalImpressions)}</div>
            <div className={styles.statSub}>Sabhi links ka lifetime view count.</div>
          </div>

          {/* Overall CPM */}
          <div className={styles.card}>
            <div className={styles.statLabel}>
              <span>Overall CPM</span>
            </div>
            <div className={styles.statValue}>$ {formatMoney(stats.overallCPM)}</div>
            <div className={styles.statSub}>Total earning / total impressions × 1000 (approx).</div>
          </div>

          {/* Withdrawn Amount */}
          <div className={styles.card}>
            <div className={styles.statLabel}>
              <span>Withdrawn Amount</span>
            </div>
            <div className={styles.statValue}>$ {formatMoney(stats.withdrawnAmount)}</div>
            <div className={styles.statSub}>Jo paisa already aapke account me ja chuka hai.</div>
          </div>
        </section>

        {/* DAILY BREAKDOWN */}
        <section>
          <div className={styles.card}>
            <div className={styles.sectionTitle}>
              <div>
                <h2>Daily Performance (Last 90 Days)</h2>
                <span>Roz ka data: impressions, daily CPM & daily earning.</span>
              </div>
              <span className={styles.badge}>Timezone: IST · Currency: USD</span>
            </div>

            <div className={styles.tableWrapper}>
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Impressions</th>
                    <th>Daily CPM ($)</th>
                    <th>Daily Earning ($)</th>
                  </tr>
                </thead>
                <tbody>
                  {dailyData.length === 0 ? (
                    <tr>
                      <td colSpan="4" className={styles.textSoft}>
                        Abhi daily stats empty hain. Jaise hi impressions/earning aayegi, yaha show hoga.
                      </td>
                    </tr>
                  ) : (
                    dailyData.map(([dateKey, obj]) => (
                      <tr key={dateKey}>
                        <td>{formatDateLabel(dateKey)}</td>
                        <td>{formatNumber(obj.impressions || 0)}</td>
                        <td>{formatMoney(obj.cpm || 0)}</td>
                        <td className={(obj.earning || 0) > 0 ? styles.textGreen : ''}>
                          {formatMoney(obj.earning || 0)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <p className={styles.note}>
              {dailyData.length > 0
                ? `Data loaded from your panel (last ${dailyData.length} days).`
                : error
                ? error
                : 'Abhi daily stats empty hain. Jaise hi impressions/earning aayegi, yaha show hoga.'}
            </p>
          </div>
        </section>
      </div>
    </Layout>
  );
}

export default Dashboard;
