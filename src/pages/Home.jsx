import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Home.module.css';

function Home() {
  const { user, googleLogin } = useAuth();
  const navigate = useNavigate();
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  // Auth state watcher - EXACT same as HTML
  useEffect(() => {
    if (user) {
      setLoading(true);
      setMsg({ text: 'Account data check ho raha hai...', type: 'success' });

      // ensureUserNode is already called in AuthContext onAuthStateChanged
      // So we just need to show message and redirect
      const timer = setTimeout(() => {
        setMsg({ text: 'Account loaded successfully! Dashboard open ho raha hai...', type: 'success' });
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [user, navigate]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setMsg({ text: '', type: '' });

    try {
      const { mode } = await googleLogin();
      
      // Message will be shown by the auth state watcher above
      if (mode === 'new') {
        setMsg({ text: 'Account created successfully! Dashboard open ho raha hai...', type: 'success' });
      } else {
        setMsg({ text: 'Account loaded successfully! Dashboard open ho raha hai...', type: 'success' });
      }
      
      // Navigation will happen via useEffect when user state updates
    } catch (err) {
      console.error('Google login error:', err);
      let errorMsg = 'Google login fail ho gaya.';
      if (err.code === 'auth/unauthorized-domain') {
        errorMsg = 'Firebase Authentication → Settings → Authorized domains me apna domain add karo.';
      }
      setMsg({ text: errorMsg, type: 'error' });
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      {/* Top Navbar */}
      <header className={styles.topNav}>
        <div className={styles.topNavInner}>
          <div className={styles.brand}>
            <div className={styles.brandLogo}>
              <span>S</span>
            </div>
            <div>
              <div className={styles.brandTextMain}>TShortner</div>
              <div className={styles.brandTextSub}>Smart URL &amp; Earning Panel</div>
            </div>
          </div>

          <nav className={styles.topNavLinks}>
            <Link to="/">Home</Link>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
            <Link to="/dashboard" className={styles.navCta}>Open Dashboard</Link>
          </nav>
        </div>
      </header>

      {/* Top Intro Text */}
      <section className={styles.topIntro}>
        <h2 className={styles.topIntroTitle}>Apne traffic ko real earning me convert karo</h2>
        <p className={styles.topIntroText}>
          TShortner aapke long links ko ek organized earning system banata hai –
          jahan har click track hota hai, stats clear hote hain, aur sab kuch ek hi panel se control hota hai.
        </p>
      </section>

      {/* Top Login Card */}
      <div className={styles.wrapper}>
        <div className={styles.card}>
          <div className={styles.logo}><span>S</span></div>

          <h1>Shortner Panel</h1>
          <p className={styles.subtitle}>
            Apne लंबे links ko short karo, track karo aur earning manage karo – sab yahi se.
          </p>

          <div className={styles.btnGroup}>
            <Link to="/login" className={`${styles.btn} ${styles.btnPrimary}`}>🔐 Login</Link>
            <Link to="/signup" className={`${styles.btn} ${styles.btnOutline}`}>✨ Create Account</Link>

            <button 
              type="button" 
              className={`${styles.btn} ${styles.btnGoogle}`}
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              <span className={styles.g}>G</span>
              <span>{loading ? 'Connecting...' : 'Sign in with Google'}</span>
            </button>
          </div>

          {msg.text && (
            <div className={`${styles.msg} ${styles[msg.type]}`} style={{ display: 'block' }}>
              {msg.text}
            </div>
          )}

          <p className={styles.miniText}>
            Google se login karoge to email select karte hi account create ho jayega
            (agar pehle nahi bana). Agar pehle se data hai to wahi load hoga.
          </p>
        </div>
      </div>

      {/* Info Section */}
      <section className={styles.infoSectionWrapper}>
        <div>
          <h2 className={styles.infoSectionTitle}>Shortner kya hai aur kyun use karein?</h2>
          <p className={styles.infoSectionSubtitle}>
            Long URL ko ek smart, trackable aur earning wala asset banane ke liye hamne ye Shortner Panel design kiya hai.
            Chahe aap Telegram channel chalao, website run karo, ya daily links share karte ho – ek centralized panel se sab control me aa jata hai.
          </p>
        </div>

        <div className={styles.infoSectionGrid}>
          {/* Left Card */}
          <div className={styles.infoCard}>
            <h2>📌 Shortner ka basic concept</h2>
            <p>
              Internet par har jagah long URLs hote hain – jaise movie links, file links, Terabox links,
              blog posts, affiliate URLs, landing pages wagairah. In links ko jab aap directly share karte ho
              to link <strong>ugly lagta hai, track nahi hota, aur aapko pata bhi nahi chalta ki kitne log click kar rahe hain.</strong>
            </p>
            <p>
              Shortner exactly yehi problem solve karta hai. Aap ek long URL daalte ho aur system uska
              <strong>chhota, clean aur branded short link</strong> bana deta hai. Jab bhi koi user is short link par click karta hai,
              hamara system pehle impression &amp; click track karta hai, phir user ko safely aapke original URL par redirect kar deta hai.
            </p>
            <p>
              Ye panel specially un users ke liye banaya gaya hai jo:
              <strong>Telegram, WhatsApp, website, YouTube description, Facebook, Instagram</strong> par regular traffic laate hain
              aur chahte hain ki unka har click proper track ho aur future earning ka base ban sake.
            </p>

            <ul className={styles.infoList}>
              <li>Clean &amp; shareable short links – professional look ke saath.</li>
              <li>Har click &amp; impression ka record – exact stats dashboard me.</li>
              <li>Alag sources ke hisaab se performance samajhna easy (Telegram vs Website vs others).</li>
              <li>Secure Firebase Realtime Database – fast read/write aur stable backend.</li>
            </ul>

            <p>
              Agar aap regular basis par <strong>movies, series, tutorials, files, documents, ya koi bhi content</strong> share karte ho,
              to shortner use karna directly aapki branding, control aur earning potential ko improve karega.
            </p>

            <div className={styles.infoHighlightBox}>
              <span>Simple logic:</span> jitne zyada smart short links, utne zyada trackable clicks –
              aur jitna clear data, utna strong aapka traffic proof. Isi proof ke base par long-term earning build hoti hai.
            </div>
          </div>

          {/* Right Card */}
          <div className={styles.infoCard}>
            <h2>💰 Earning ka system kaise kaam karta hai?</h2>
            <p>
              Shortner Panel ka earning model mainly <strong>CPM (Cost Per Mille)</strong> and
              <strong>valid traffic</strong> par based hota hai. Simple language me:
              har 1000 valid impressions / views par aapko kitna payout milega, woh CPM decide karta hai.
            </p>
            <p>
              Jab koi user aapke short link par click karta hai, system:
              pehle hamare ads / verification flow ko load karta hai, impression count karta hai
              aur phir user ko final content par redirect kar deta hai. Agar traffic rules ke andar hai,
              to ye sab clicks &amp; views aapki earning me add hote rehte hain.
            </p>

            <ul className={styles.infoList}>
              <li>Har account ke liye CPM / rate alag ho sakta hai – country, quality aur performance ke base par.</li>
              <li>Fake, bot, repeated, VPN ya invalid traffic ko system filter karne ki koshish karta hai.</li>
              <li>Sirf <strong>valid &amp; real user actions</strong> ko hi earning calculation me count kiya jata hai.</li>
              <li>Dashboard me aap <strong>daily earning, total earning, overall CPM, total impressions</strong> sab dekh sakte ho.</li>
            </ul>

            <p>
              Yaha sabse important point hai <strong>quality traffic</strong>. Agar aap slow &amp; natural growth ke saath Genuine users laate ho,
              to CPM stable rehta hai, account safe rehta hai aur payout long-term possible hota hai.
            </p>
            <p>
              Hamara goal sirf number show karna nahi hai, balki aapko
              <strong>clear analytics</strong> dena hai – taaki aap easily samajh pao:
              kaunsa link best perform kar raha hai, kaunsa channel / group / page strongest earning de raha hai,
              aur kis type ka content logon ko sabse zyada pasand aa raha hai.
            </p>

            <div className={styles.infoHighlightBox}>
              <span>Pro tip:</span> ek hi link ko har jagah spam mat karo. Telegram, WhatsApp, website pages aur
              organic sources ka healthy mix rakho. Slow &amp; steady traffic se account safe rahega,
              aur earning bhi zyada stable &amp; long-term banegi.
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.miniFooter}>
        © {new Date().getFullYear()} Shortner Panel
        <div style={{ marginTop: '0.5rem' }}>
          <Link to="/privacy">Privacy Policy</Link> •
          <Link to="/terms">Terms &amp; Conditions</Link>
        </div>
        <div className={styles.footerSmallText}>
          Safe &amp; Legal Short-Link Platform – High Quality Traffic Only.
        </div>
      </footer>
    </div>
  );
}

export default Home;
