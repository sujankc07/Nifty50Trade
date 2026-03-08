import { useState, useEffect, useRef } from 'react';
import { createChart, CandlestickSeries, AreaSeries } from 'lightweight-charts';
import { fetchChartData } from '../../api/stocks';
import Spinner from '../common/Spinner';

const MiniChart = ({ symbol = 'RELIANCE.NS' }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [chartType, setChartType] = useState('candle');

  // Fetch data
  useEffect(() => {
    setLoading(true);
    fetchChartData(symbol.replace('.NS', ''))
      .then(res => setData(res.data || []))
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, [symbol]);

  // Render chart
  // Render chart
  useEffect(() => {
    if (loading || !data.length || !chartRef.current) return;

    // Wait for DOM to have dimensions
    const timer = setTimeout(() => {
      if (!chartRef.current || chartRef.current.clientWidth === 0) return;

      if (chartInstanceRef.current) {
        chartInstanceRef.current.remove();
        chartInstanceRef.current = null;
      }

      const chart = createChart(chartRef.current, {
        width: chartRef.current.clientWidth,
        height: 220,
        layout: {
          background: { color: 'transparent' },
          textColor: 'rgba(255,255,255,0.5)',
        },
        grid: {
          vertLines: { color: 'rgba(255,255,255,0.04)' },
          horzLines: { color: 'rgba(255,255,255,0.04)' },
        },
        rightPriceScale: { borderColor: 'rgba(255,255,255,0.1)' },
        timeScale: {
          borderColor: 'rgba(255,255,255,0.1)',
          timeVisible: true,
          secondsVisible: false,
        },
      });

      chartInstanceRef.current = chart;

      if (chartType === 'candle') {
        const series = chart.addSeries(CandlestickSeries, {
          upColor: '#10b981',
          downColor: '#ef4444',
          borderUpColor: '#10b981',
          borderDownColor: '#ef4444',
          wickUpColor: '#10b981',
          wickDownColor: '#ef4444',
        });
        series.setData(data.map(d => ({
          time: d.date,
          open: d.open || d.close,
          high: d.high || d.close,
          low: d.low || d.close,
          close: d.close,
        })));
      } else {
        const series = chart.addSeries(AreaSeries, {
          lineColor: '#6366f1',
          topColor: 'rgba(99,102,241,0.3)',
          bottomColor: 'rgba(99,102,241,0)',
          lineWidth: 2,
        });
        series.setData(data.map(d => ({
          time: d.date,
          value: d.close,
        })));
      }

      chart.timeScale().fitContent();

      const observer = new ResizeObserver(() => {
        if (chartRef.current) {
          chart.applyOptions({ width: chartRef.current.clientWidth });
        }
      });
      observer.observe(chartRef.current);

      return () => {
        observer.disconnect();
      };
    }, 100); // small delay for DOM

    return () => {
      clearTimeout(timer);
      if (chartInstanceRef.current) {
        chartInstanceRef.current.remove();
        chartInstanceRef.current = null;
      }
    };
  }, [data, chartType, loading]);

  return (
    <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>
          {symbol.replace('.NS', '')} — 30 Day Chart
        </div>
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: 8, padding: 3 }}>
          {[{ id: 'candle', label: '🕯️ Candle' }, { id: 'line', label: '📈 Line' }].map(t => (
            <button key={t.id} onClick={() => setChartType(t.id)} style={{
              padding: '4px 10px', border: 'none', borderRadius: 6,
              cursor: 'pointer', fontSize: 11, fontWeight: 600,
              background: chartType === t.id ? 'rgba(99,102,241,0.6)' : 'transparent',
              color: chartType === t.id ? '#fff' : 'rgba(255,255,255,0.4)',
              transition: 'all 0.15s',
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      {loading
        ? <Spinner />
        : <div ref={chartRef} style={{ width: '100%', height: 220 }} />
      }
    </div>
  );
};

export default MiniChart;