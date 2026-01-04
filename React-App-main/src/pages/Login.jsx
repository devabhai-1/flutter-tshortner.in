import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Auth.module.css';

function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

    if (!email || !password) {
      setError('Email aur password required hai.');
      return;
    }

    setLoading(true);

    try {
      await login(email, password);
      setSuccess('Login successful! Redirect ho raha hai...');
      setTimeout(() => navigate('/dashboard'), 800);
    } catch (err) {
      console.error(err);
      let msg = 'Login failed. Email / password check karo.';
      if (err.code === 'auth/user-not-found') msg = 'Ye email registered nahi hai.';
      if (err.code === 'auth/wrong-password') msg = 'Galat password.';
      if (err.code === 'auth/too-many-requests') msg = 'Too many attempts, thodi der baad try karo.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.card}>
          <h1>Login</h1>
          <p className={styles.subtitle}>Apne Shortner account me login karo.</p>

          <form onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="example@email.com"
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
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className={styles.btn} disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>

            {error && <div className={`${styles.msg} ${styles.error}`}>{error}</div>}
            {success && <div className={`${styles.msg} ${styles.success}`}>{success}</div>}
          </form>

          <p className={styles.bottomText}>
            Naya ho? <Link to="/signup">Create Account</Link>
          </p>

          <Link to="/" className={styles.backLink}>← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
