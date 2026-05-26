'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface QRData {
  token: string;
  inviteUrl: string;
  expiresAt: string;
}

interface Props {
  onClose: () => void;
}

const QR_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

export default function QRCodeModal({ onClose }: Props) {
  const [qrData, setQrData] = useState<QRData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchQR = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/pairings/qr');
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Failed to generate QR code');
        return;
      }
      setQrData(data);
      setSecondsLeft(Math.round(QR_EXPIRY_MS / 1000));

      // Auto-refresh 10 seconds before expiry
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = setTimeout(fetchQR, QR_EXPIRY_MS - 10_000);
    } catch {
      setError('Network error — please try again');
    } finally {
      setLoading(false);
    }
  }, []);

  // Generate QR on mount
  useEffect(() => {
    fetchQR();
    return () => {
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [fetchQR]);

  // Countdown ticker
  useEffect(() => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    if (secondsLeft <= 0) return;
    countdownRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          if (countdownRef.current) clearInterval(countdownRef.current);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => { if (countdownRef.current) clearInterval(countdownRef.current); };
  }, [secondsLeft]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const urgent = secondsLeft > 0 && secondsLeft <= 30;
  const expired = secondsLeft === 0 && qrData !== null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-left">QR Code Pairing</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 text-left mt-0.5">
              Have the other person scan this with their phone camera
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* QR area */}
        <div className="relative flex items-center justify-center rounded-2xl bg-white dark:bg-white p-5 mb-4 min-h-[220px]">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/80">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {error && !loading && (
            <div className="text-sm text-red-600 dark:text-red-400 px-4">{error}</div>
          )}

          {expired && !loading && (
            <div className="flex flex-col items-center gap-3">
              <div className="text-4xl">⏰</div>
              <p className="text-sm text-gray-500">QR code expired</p>
              <button
                onClick={fetchQR}
                className="rounded-xl bg-primary text-white px-4 py-2 text-sm font-semibold hover:opacity-90 transition-all"
              >
                Generate new code
              </button>
            </div>
          )}

          {qrData && !expired && !loading && (
            <div className={`transition-opacity duration-300 ${urgent ? 'opacity-60' : 'opacity-100'}`}>
              <QRCodeSVG
                value={qrData.inviteUrl}
                size={180}
                level="M"
                includeMargin={false}
              />
            </div>
          )}
        </div>

        {/* Countdown */}
        {qrData && !expired && !loading && (
          <div className={`text-sm font-mono font-semibold mb-3 ${urgent ? 'text-red-500 animate-pulse' : 'text-gray-500 dark:text-gray-400'}`}>
            {urgent && '⚠️ '}Expires in {minutes}:{seconds.toString().padStart(2, '0')}
          </div>
        )}

        {/* Manual URL fallback */}
        {qrData && !expired && (
          <div className="rounded-xl bg-gray-50 dark:bg-gray-800 px-3 py-2 mb-4">
            <p className="text-xs text-gray-400 mb-1">Or share this link manually:</p>
            <p className="text-xs font-mono text-gray-600 dark:text-gray-300 break-all">{qrData.inviteUrl}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          {qrData && !expired && (
            <button
              onClick={fetchQR}
              disabled={loading}
              className="flex-1 rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-2.5 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              Refresh
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 rounded-xl bg-primary text-white px-4 py-2.5 text-sm font-semibold hover:opacity-90 transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
