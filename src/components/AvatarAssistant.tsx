import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

const AvatarAssistant: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [message, setMessage] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [webGLSupported, setWebGLSupported] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const mountedRef = useRef(true);

  // Check WebGL support on mount
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl =
        canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setWebGLSupported(!!gl);
    } catch {
      setWebGLSupported(false);
      // WebGL not supported - using fallback
    }
  }, []);

  // Change message periodically
  useEffect(() => {
    if (isDisabled) return;

    // Messages that the avatar can display
    const messages = [
      "Hello! I'm ThinkRED's assistant. How can I help you?",
      'Explore our services to see how we can help your business.',
      'Check out our portfolio to see our previous work.',
      'Need a custom solution? Contact us today!',
      'We specialize in web development, DevOps, and platform engineering.',
    ];

    const interval = setInterval(() => {
      if (!mountedRef.current) return;

      const randomIndex = Math.floor(Math.random() * messages.length);
      setMessage(messages[randomIndex]);
      setIsAnimating(true);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        if (mountedRef.current) {
          setIsAnimating(false);
        }
      }, 500);
    }, 10000);

    // Set initial message
    setMessage(messages[0]);

    return () => {
      clearInterval(interval);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isDisabled]);

  // Handle scroll events to show/hide avatar
  useEffect(() => {
    if (isDisabled) return;

    const handleScroll = () => {
      if (!mountedRef.current) return;

      const scrollPosition = window.scrollY;
      // Hide avatar when scrolled past a certain point
      if (scrollPosition > 1000) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDisabled]);

  // Handle visibility change to prevent WebGL context loss
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!canvasRef.current || !mountedRef.current) return;

      if (document.hidden) {
        // Pause rendering when tab is not visible
        canvasRef.current.style.display = 'none';
      } else {
        canvasRef.current.style.display = 'block';
      }
    };

    // Handle form submission or page navigation
    const handleBeforeUnload = () => {
      if (canvasRef.current) {
        canvasRef.current.style.display = 'none';
      }
    };

    // Handle form submission
    const handleFormSubmit = () => {
      if (canvasRef.current) {
        // Temporarily hide canvas during form submission
        canvasRef.current.style.display = 'none';
        setTimeout(() => {
          if (canvasRef.current && mountedRef.current) {
            canvasRef.current.style.display = 'block';
          }
        }, 500);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Listen for form submissions
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      form.addEventListener('submit', handleFormSubmit);
    });

    return () => {
      mountedRef.current = false;
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      forms.forEach(form => {
        form.removeEventListener('submit', handleFormSubmit);
      });
    };
  }, []);

  // Toggle disable state
  const toggleDisable = () => {
    setIsDisabled(!isDisabled);
    if (!isDisabled) {
      setIsVisible(false);
      setIsExpanded(false);
    } else {
      setIsVisible(true);
    }
  };

  // Toggle expanded state
  const toggleExpanded = () => {
    if (isDisabled) return;
    setIsExpanded(!isExpanded);
    setIsAnimating(true);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (mountedRef.current) {
        setIsAnimating(false);
      }
    }, 500);
  };

  // Scene component with proper cleanup
  const Scene = () => {
    const { gl, scene } = useThree();

    // Cleanup on unmount
    useEffect(() => {
      return () => {
        // Dispose of all scene objects
        scene.traverse(object => {
          if (object instanceof THREE.Mesh) {
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
              if (Array.isArray(object.material)) {
                object.material.forEach(material => material.dispose());
              } else {
                object.material.dispose();
              }
            }
          }
        });

        // Force renderer to dispose
        gl.dispose();
      };
    }, [gl, scene]);

    return null;
  };

  // 3D model component with error handling
  const Model = () => {
    // Use a simple geometry as placeholder
    const mesh = React.useRef<THREE.Mesh>(null!);

    useFrame((state, delta) => {
      try {
        if (mesh.current && mountedRef.current) {
          mesh.current.rotation.y += delta * 0.5;
          if (isAnimating) {
            mesh.current.scale.x = THREE.MathUtils.lerp(
              mesh.current.scale.x,
              1.2,
              0.1
            );
            mesh.current.scale.y = THREE.MathUtils.lerp(
              mesh.current.scale.y,
              1.2,
              0.1
            );
            mesh.current.scale.z = THREE.MathUtils.lerp(
              mesh.current.scale.z,
              1.2,
              0.1
            );
          } else {
            mesh.current.scale.x = THREE.MathUtils.lerp(
              mesh.current.scale.x,
              1,
              0.1
            );
            mesh.current.scale.y = THREE.MathUtils.lerp(
              mesh.current.scale.y,
              1,
              0.1
            );
            mesh.current.scale.z = THREE.MathUtils.lerp(
              mesh.current.scale.z,
              1,
              0.1
            );
          }
        }
      } catch {
        // Animation frame error handled gracefully
      }
    });

    return (
      <group>
        {/* Base shape - more assistant-like with a body */}
        <mesh ref={mesh} position={[0, -0.2, 0]}>
          <sphereGeometry args={[0.6, 32, 32]} />
          <meshStandardMaterial
            color="#E4093E"
            metalness={0.4}
            roughness={0.2}
          />
        </mesh>

        {/* Head */}
        <mesh position={[0, 0.5, 0]}>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshStandardMaterial
            color="#E4093E"
            metalness={0.4}
            roughness={0.2}
          />
        </mesh>

        {/* Eyes */}
        <mesh position={[-0.15, 0.6, 0.3]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        <mesh position={[0.15, 0.6, 0.3]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>

        {/* Pupils */}
        <mesh position={[-0.15, 0.6, 0.38]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshStandardMaterial color="#2A2A2A" />
        </mesh>
        <mesh position={[0.15, 0.6, 0.38]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshStandardMaterial color="#2A2A2A" />
        </mesh>

        {/* Smile */}
        <mesh position={[0, 0.4, 0.3]} rotation={[0, 0, Math.PI]}>
          <torusGeometry args={[0.2, 0.04, 16, 32, Math.PI]} />
          <meshStandardMaterial color="#2A2A2A" />
        </mesh>

        {/* Arms */}
        <mesh position={[-0.7, -0.2, 0]} rotation={[0, 0, Math.PI / 4]}>
          <capsuleGeometry args={[0.1, 0.5, 8, 8]} />
          <meshStandardMaterial
            color="#E4093E"
            metalness={0.4}
            roughness={0.2}
          />
        </mesh>
        <mesh position={[0.7, -0.2, 0]} rotation={[0, 0, -Math.PI / 4]}>
          <capsuleGeometry args={[0.1, 0.5, 8, 8]} />
          <meshStandardMaterial
            color="#E4093E"
            metalness={0.4}
            roughness={0.2}
          />
        </mesh>
      </group>
    );
  };

  // Fallback component when WebGL is not available or has issues
  const FallbackAvatar = () => (
    <div className="w-full h-full bg-primary rounded-full flex items-center justify-center">
      <span className="text-white text-xl font-bold">TR</span>
    </div>
  );

  if (!isVisible && !isDisabled) return null;

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end">
      {/* Settings button */}
      <button
        onClick={toggleDisable}
        className="mb-4 bg-white p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        aria-label={isDisabled ? 'Enable assistant' : 'Disable assistant'}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-dark"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {!isDisabled && (
        <>
          {isExpanded && message && (
            <div className="bg-white p-4 rounded-lg shadow-lg mb-4 max-w-xs animate-fadeIn">
              <p className="text-dark">{message}</p>
              <div className="mt-3 flex justify-between">
                <button
                  className="text-sm text-primary hover:underline"
                  onClick={() => setIsExpanded(false)}
                >
                  Close
                </button>
                <a
                  href="/contact"
                  className="text-sm text-primary hover:underline"
                >
                  Contact Us
                </a>
              </div>
            </div>
          )}

          <div
            className="w-16 h-16 bg-white rounded-full shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 flex items-center justify-center"
            onClick={toggleExpanded}
          >
            <div className="w-full h-full" ref={canvasRef}>
              {webGLSupported ? (
                <React.Suspense fallback={<FallbackAvatar />}>
                  <ErrorBoundary fallback={<FallbackAvatar />}>
                    <Canvas
                      dpr={[1, 1.5]} // Lower resolution to improve performance
                      gl={{
                        powerPreference: 'default',
                        antialias: false,
                        preserveDrawingBuffer: false,
                        alpha: true,
                        // Remove this flag to allow WebGL to work in more environments
                        failIfMajorPerformanceCaveat: false,
                      }}
                      style={{ touchAction: 'none' }}
                      onCreated={({ gl }) => {
                        gl.setClearColor(0xffffff, 0);
                      }}
                    >
                      <Scene />
                      <ambientLight intensity={0.5} />
                      <spotLight
                        position={[10, 10, 10]}
                        angle={0.15}
                        penumbra={1}
                      />
                      <Model />
                      <OrbitControls
                        enableZoom={false}
                        enablePan={false}
                        minPolarAngle={Math.PI / 2 - 0.5}
                        maxPolarAngle={Math.PI / 2 + 0.5}
                      />
                    </Canvas>
                  </ErrorBoundary>
                </React.Suspense>
              ) : (
                <FallbackAvatar />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Error boundary component to catch WebGL errors
class ErrorBoundary extends React.Component<{
  fallback: React.ReactNode;
  children: React.ReactNode;
}> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    // WebGL error caught and handled
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

export default AvatarAssistant;
