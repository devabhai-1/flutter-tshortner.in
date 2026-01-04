import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Auth.module.css';

function Signup() {
  const { user, signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirm) {
      setError('Password & Confirm Password same hone chahiye.');
      return;
    }

    setLoading(true);

    try {
      // This will create auth user, update profile, and create RTDB node
      await signup(email.trim(), password, name.trim());
      setSuccess('Account Successfully Created! Redirecting to Dashboard...');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      console.error('Signup error:', err);
      let errorMsg = 'Signup failed: ' + (err.code || err.message);
      if (err.code === 'auth/email-already-in-use') {
        errorMsg = 'Ye email pehle se use ho rahi hai.';
      } else if (err.code === 'auth/weak-password') {
        errorMsg = 'Password kam se kam 6 characters ka hona chahiye.';
      } else if (err.code === 'auth/invalid-email') {
        errorMsg = 'Invalid email format.';
      }
      setError(errorMsg);
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.card}>
          <h1>Create Account</h1>
          <p className={styles.subtitle}>Apna naya Shortner account banao.</p>

          <form onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="confirm">Confirm Password</label>
              <input
                id="confirm"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
            </div>

            <button type="submit" className={`${styles.btn} ${styles.btnGreen}`} disabled={loading}>
              {loading ? 'Creating...' : 'Create Account'}
            </button>

            {error && <div className={`${styles.msg} ${styles.error}`}>{error}</div>}
            {success && <div className={`${styles.msg} ${styles.success}`}>{success}</div>}
          </form>

          <p className={styles.bottomText}>
            Already account hai? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
