import { useState, useEffect, useRef } from 'react';

/**
 * Generates or retrieves a persistent anonymous visitor ID from localStorage.
 * This ensures each browser is counted only once per day.
 */
function getOrCreateVisitorId() {
  const key = 'mm_visitor_id';
  let id = localStorage.getItem(key);
  if (!id) {
    // Generate a random UUID-like string
    id = `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
    localStorage.setItem(key, id);
  }
  return id;
}

/**
 * Animates a number rolling up from 0 to the target value.
 * @param {number} target - The final number to count up to.
 * @param {Function} setter - React state setter to update during animation.
 */
function animateCount(target, setter) {
  const duration = 1200; // ms
  const steps = 40;
  const interval = duration / steps;
  let current = 0;

  const timer = setInterval(() => {
    current += Math.ceil(target / steps);
    if (current >= target) {
      setter(target);
      clearInterval(timer);
    } else {
      setter(current);
    }
  }, interval);

  return () => clearInterval(timer);
}

/**
 * Custom hook to fetch and display the live visitor count.
 * Handles deduplication, animation, and graceful error fallback.
 *
 * @returns {{ count: number|null, isLoading: boolean }}
 */
export function useVisitorCount() {
  const [count, setCount] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const cleanupRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchCount() {
      try {
        const visitorId = getOrCreateVisitorId();

        const res = await fetch('/api/visit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-visitor-id': visitorId,
          },
        });

        if (!res.ok) throw new Error('API error');

        const { count: total } = await res.json();

        if (!cancelled && total !== null && typeof total === 'number') {
          // Kick off the roll-up animation
          cleanupRef.current = animateCount(total, setCount);
        }
      } catch {
        // Graceful failure — count stays null, UI hides the widget
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchCount();

    return () => {
      cancelled = true;
      // Clean up animation timer if component unmounts mid-animation
      if (cleanupRef.current) cleanupRef.current();
    };
  }, []);

  return { count, isLoading };
}
