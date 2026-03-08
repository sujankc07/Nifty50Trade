import { useAuth } from '../context/AuthContext.jsx';
import { usePortfolio } from '../hooks/usePortfolio.js';
import SummaryCards from '../components/dashboard/SummaryCards.jsx';
import MiniChart from '../components/dashboard/MiniChart.jsx';
import HoldingsSummary from '../components/dashboard/HoldingsSummary.jsx';
import PageWrapper from '../components/layout/PageWrapper.jsx';
import Spinner from '../components/common/Spinner.jsx';
import { resetPortfolio } from '../api/portfolio.js';
import { useToast } from '../context/ToastContext.jsx';
import { useState } from 'react';
const DashboardPage = () => {
    const { user } = useAuth();
    const { data, loading } = usePortfolio();
    const { updateBalance } = useAuth();
    const { showToast } = useToast();
    const [resetting, setResetting] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleReset = async () => {
        try {
            setResetting(true);
            const res = await resetPortfolio();
            updateBalance(res.data.balance);
            showToast('Portfolio reset! Starting fresh with ₹1,00,000 🎉');
            setShowConfirm(false);
            window.location.reload();
        } catch (err) {
            showToast('Failed to reset portfolio', 'error');
        } finally {
            setResetting(false);
        }
    };
    return (
        <PageWrapper title={`Welcome back, ${user?.name} 👋`}>
            {/* Reset Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
                <button
                    onClick={() => setShowConfirm(true)}
                    style={{
                        padding: '8px 16px', border: '1px solid rgba(239,68,68,0.4)',
                        borderRadius: 9, background: 'rgba(239,68,68,0.1)',
                        color: '#ef4444', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                    }}
                >
                    🔄 Reset Portfolio
                </button>
            </div>

            {/* Confirm Modal */}
            {showConfirm && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999,
                }}>
                    <div style={{
                        background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 16, padding: 32, maxWidth: 380, width: '90%', textAlign: 'center',
                    }}>
                        <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
                        <h3 style={{ margin: '0 0 8px', fontSize: 18 }}>Reset Portfolio?</h3>
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginBottom: 24 }}>
                            This will delete all your holdings, transactions and reset your balance to ₹1,00,000. This cannot be undone!
                        </p>
                        <div style={{ display: 'flex', gap: 10 }}>
                            <button
                                onClick={() => setShowConfirm(false)}
                                style={{
                                    flex: 1, padding: '10px 0', border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: 9, background: 'transparent', color: '#fff',
                                    fontSize: 13, fontWeight: 600, cursor: 'pointer',
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReset}
                                disabled={resetting}
                                style={{
                                    flex: 1, padding: '10px 0', border: 'none',
                                    borderRadius: 9, background: 'linear-gradient(135deg,#ef4444,#dc2626)',
                                    color: '#fff', fontSize: 13, fontWeight: 600,
                                    cursor: resetting ? 'not-allowed' : 'pointer', opacity: resetting ? 0.7 : 1,
                                }}
                            >
                                {resetting ? 'Resetting...' : '🔄 Yes, Reset'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {loading
                ? <Spinner />
                : <>
                    <SummaryCards balance={user?.balance || 0} summary={data?.summary} />
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: 14,
                    }}>
                        <MiniChart symbol="RELIANCE.NS" />
                        <HoldingsSummary holdings={data?.holdings || []} />
                    </div>
                </>
            }
        </PageWrapper>
    );
};

export default DashboardPage;