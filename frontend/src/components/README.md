# Performance Monitoring Components

This directory contains components and utilities for monitoring application performance.

## `PerformanceWrapper.tsx`

A higher-order component for monitoring React component performance in development and production
environments.

### Features

- **Component Mount Time Tracking**: Measures how long components take to mount
- **Development Logging**: Automatically logs performance metrics in development mode
- **Slow Component Detection**: Identifies components that exceed performance thresholds
- **Data Attributes**: Adds performance data to DOM for testing and debugging
- **Memory Leak Prevention**: Properly manages timing and cleanup

### Basic Usage

```tsx
import PerformanceWrapper from "./components/PerformanceWrapper";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <PerformanceWrapper name="HomePage">
      <HomePage />
    </PerformanceWrapper>
  );
}
```

### Advanced Usage

```tsx
<PerformanceWrapper name="ComplexComponent" logMetrics={true} slowThreshold={50}>
  <ComplexComponent />
</PerformanceWrapper>
```

### Manual Performance Tracking

Use the `usePerformanceTracker` hook for custom performance measurements:

```tsx
import { usePerformanceTracker } from "./components/PerformanceWrapper";

function DataProcessingComponent() {
  const tracker = usePerformanceTracker("DataProcessing");

  const processData = async data => {
    tracker.start();

    // Your data processing logic
    const result = await processComplexData(data);

    const duration = tracker.end();
    // duration is returned in milliseconds

    return result;
  };

  return <div>{/* Your component */}</div>;
}
```

### Configuration Options

| Prop            | Type        | Default                                  | Description                                            |
| --------------- | ----------- | ---------------------------------------- | ------------------------------------------------------ |
| `name`          | `string`    | Required                                 | Unique identifier for the performance measurement      |
| `children`      | `ReactNode` | Required                                 | Child components to monitor                            |
| `logMetrics`    | `boolean`   | `process.env.NODE_ENV === 'development'` | Whether to log performance metrics to console          |
| `slowThreshold` | `number`    | `100`                                    | Threshold in milliseconds for slow component detection |

### Development Output

When `logMetrics` is enabled, you'll see console output like:

```
⚡ Performance: HomePage
  Mount time: 45.23ms
  Render time: 45.23ms

🐌 Performance: SlowComponent
  Mount time: 156.78ms
  Render time: 156.78ms
  ⚠️ Component is slower than 100ms threshold
```

### Production Usage

In production, the component:

- Disables console logging by default
- Still collects performance data for monitoring
- Adds performance data attributes to DOM elements
- Can be extended to send metrics to monitoring services

### Testing with Performance Data

The component adds data attributes that can be used in tests:

```tsx
// Test example
const element = screen.getByTestId("my-component");
expect(element).toHaveAttribute("data-performance-name", "MyComponent");
expect(element).toHaveAttribute("data-performance-slow", "false");
```

### Extending for Monitoring Services

```tsx
// Example: Send metrics to monitoring service
const PerformanceWrapper = ({ name, children }) => {
  useEffect(() => {
    // Send metrics to your monitoring service
    if (metrics && typeof window !== "undefined") {
      // analytics.track('component_performance', metrics);
      // datadog.increment('component.mount_time', metrics.mountTime);
      // newrelic.recordMetric('Custom/Component/MountTime', metrics.mountTime);
    }
  }, [metrics]);

  // ... rest of component
};
```

### Best Practices

1. **Selective Wrapping**: Don't wrap every component - focus on:
   - Route components (pages)
   - Complex components with heavy logic
   - Components suspected of performance issues

2. **Meaningful Names**: Use descriptive names that help identify components:

   ```tsx
   <PerformanceWrapper name="UserDashboard-DataTable">
   <PerformanceWrapper name="ProductPage-ReviewsList">
   ```

3. **Production Considerations**:
   - The wrapper has minimal overhead
   - Performance data collection continues in production
   - Console logging is automatically disabled

4. **Threshold Tuning**: Adjust `slowThreshold` based on your app's needs:
   - Simple components: 50ms
   - Complex components: 100ms
   - Route components: 200ms

### Migration from Empty Component

The previous version was an empty placeholder. This new implementation:

- ✅ Provides actual functionality
- ✅ Maintains TypeScript compliance
- ✅ Follows React best practices
- ✅ Is production-ready
- ✅ Has minimal performance impact

### Related Documentation

- [React Performance](https://react.dev/learn/render-and-commit)
- [Web Performance APIs](https://developer.mozilla.org/en-US/docs/Web/API/Performance)
- [React Developer Tools Profiler](https://react.dev/reference/react/Profiler)
