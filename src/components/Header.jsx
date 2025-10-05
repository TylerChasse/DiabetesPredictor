import styles from '../styles/Header.module.css'

const Header = ({ currentPage, setCurrentPage }) => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.brandSection}>
            <div className={styles.logoContainer}>
              <svg 
                className={styles.logoIcon}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" 
                />
              </svg>
            </div>
            <div className={styles.brandText}>
              <h1>Diabetes Risk Predictor</h1>
              <p>Risk Assessment and Analytics System</p>
            </div>
          </div>
          
          <nav className={styles.nav}>
            <button
              className={`${styles.navButton} ${currentPage === 'prediction' ? styles.active : ''}`}
              onClick={() => setCurrentPage('prediction')}
            >
              Risk Assessment
            </button>
            <button
              className={`${styles.navButton} ${currentPage === 'dashboard' ? styles.active : ''}`}
              onClick={() => setCurrentPage('dashboard')}
            >
              Data Analytics
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;