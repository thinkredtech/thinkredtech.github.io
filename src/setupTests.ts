// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock for THREE.js and WebGL
jest.mock('three', () => {
  return {
    WebGLRenderer: jest.fn().mockImplementation(() => ({
      setSize: jest.fn(),
      render: jest.fn(),
      setClearColor: jest.fn(),
      domElement: document.createElement('canvas'),
      dispose: jest.fn(),
      shadowMap: {},
      outputEncoding: 0,
      toneMapping: 0,
    })),
    Scene: jest.fn().mockImplementation(() => ({
      add: jest.fn(),
      background: null,
    })),
    PerspectiveCamera: jest.fn().mockImplementation(() => ({
      position: { set: jest.fn() },
      lookAt: jest.fn(),
    })),
    Color: jest.fn(),
    MathUtils: {
      lerp: jest.fn((x, y, t) => x + (y - x) * t),
    },
    Mesh: jest.fn(),
    Group: jest.fn().mockImplementation(() => ({
      add: jest.fn(),
      rotation: { x: 0, y: 0, z: 0 },
      position: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
    })),
    BoxGeometry: jest.fn(),
    SphereGeometry: jest.fn(),
    TorusGeometry: jest.fn(),
    MeshStandardMaterial: jest.fn(),
    AmbientLight: jest.fn(),
    SpotLight: jest.fn(),
    Vector3: jest.fn().mockImplementation(() => ({
      set: jest.fn(),
    })),
  };
});

// Mock for react-three-fiber
jest.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="canvas-mock">{children}</div>
  ),
  useFrame: (callback: any) => {
    // Don't actually run the animation frame in tests
  },
}));

// Mock for react-three/drei
jest.mock('@react-three/drei', () => ({
  OrbitControls: () => <div data-testid="orbit-controls-mock" />,
  useGLTF: jest.fn().mockImplementation(() => ({
    scene: {
      clone: jest.fn().mockReturnValue({
        traverse: jest.fn(),
      }),
    },
  })),
}));

// Mock for window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock for IntersectionObserver
class MockIntersectionObserver {
  constructor(callback: any) {
    this.callback = callback;
  }
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
  callback: any;
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: MockIntersectionObserver,
});

// Mock for window.scrollTo
window.scrollTo = jest.fn();
