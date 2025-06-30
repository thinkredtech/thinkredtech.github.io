/**
 * Performance Monitoring Wrapper Component
 *
 * A higher-order component for monitoring React component performance
 * and user interactions. Currently provides basic timing metrics and
 * can be extended for advanced performance monitoring.
 *
 * @example
 * ```tsx
 * <PerformanceWrapper name="HomePage">
 *   <HomePage />
 * </PerformanceWrapper>
 * ```
 */

import React, { ReactNode, useEffect, useState } from "react";

interface PerformanceWrapperProps {
  /** Unique identifier for this performance measurement */
  name: string;
  /** Child components to monitor */
  children: ReactNode;
  /** Whether to log performance metrics to console (dev only) */
  logMetrics?: boolean;
  /** Custom performance threshold in milliseconds */
  slowThreshold?: number;
}

interface PerformanceMetrics {
  componentName: string;
  mountTime: number;
  renderTime: number;
  isSlowComponent: boolean;
}

/**
 * Performance monitoring wrapper that tracks component lifecycle metrics
 */
const PerformanceWrapper: React.FC<PerformanceWrapperProps> = ({
  name,
  children,
  logMetrics = process.env.NODE_ENV === "development",
  slowThreshold = 100,
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [mountStart] = useState(() => performance.now());

  useEffect(() => {
    const mountEnd = performance.now();
    const mountTime = mountEnd - mountStart;
    const isSlowComponent = mountTime > slowThreshold;

    const performanceMetrics: PerformanceMetrics = {
      componentName: name,
      mountTime: Math.round(mountTime * 100) / 100,
      renderTime: Math.round(mountTime * 100) / 100, // For now, same as mount time
      isSlowComponent,
    };

    setMetrics(performanceMetrics);

    // Log performance metrics in development
    if (logMetrics) {
      const emoji = isSlowComponent ? "🐌" : "⚡";
      // eslint-disable-next-line no-console
      console.group(`${emoji} Performance: ${name}`);
      // eslint-disable-next-line no-console
      console.log(`Mount time: ${performanceMetrics.mountTime}ms`);
      // eslint-disable-next-line no-console
      console.log(`Render time: ${performanceMetrics.renderTime}ms`);
      if (isSlowComponent) {
        // eslint-disable-next-line no-console
        console.warn(`Component is slower than ${slowThreshold}ms threshold`);
      }
      // eslint-disable-next-line no-console
      console.groupEnd();
    }

    // Report to analytics/monitoring service (if configured)
    if (typeof window !== "undefined" && "performance" in window) {
      // Future: Send metrics to monitoring service
      // Example: sendMetricsToService(performanceMetrics);
    }
  }, [name, mountStart, slowThreshold, logMetrics]);

  // Add performance data attributes for testing/debugging
  const dataAttributes = metrics
    ? {
        "data-performance-name": metrics.componentName,
        "data-performance-mount-time": metrics.mountTime,
        "data-performance-slow": metrics.isSlowComponent,
      }
    : {};

  return (
    <div className="performance-wrapper" {...dataAttributes}>
      {children}
    </div>
  );
};

export default PerformanceWrapper;

/**
 * Hook for manual performance tracking
 * @param operationName - Name of the operation to track
 * @returns Object with start and end functions
 */
export const usePerformanceTracker = (operationName: string) => {
  const [startTime, setStartTime] = useState<number | null>(null);

  const start = () => {
    setStartTime(performance.now());
  };

  const end = () => {
    if (startTime === null) {
      // eslint-disable-next-line no-console
      console.warn(`Performance tracker "${operationName}" was not started`);
      return;
    }

    const endTime = performance.now();
    const duration = Math.round((endTime - startTime) * 100) / 100;

    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.log(`⏱️ ${operationName}: ${duration}ms`);
    }

    setStartTime(null);
    return duration;
  };

  return { start, end };
};
