import { useState, useRef, useEffect, useCallback, MouseEvent } from 'react';

export interface Position {
  x: number;
  y: number;
}

export interface UseDraggableOptions {
  initialPosition?: Position;
  onFocus?: () => void;
}

export interface UseDraggableReturn {
  position: Position;
  setPosition: React.Dispatch<React.SetStateAction<Position>>;
  isDragging: boolean;
  handleMouseDown: (e: MouseEvent) => void;
}

export function useDraggable({ initialPosition = { x: 0, y: 0 }, onFocus }: UseDraggableOptions = {}): UseDraggableReturn {
  const [position, setPosition] = useState<Position>(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const positionRef = useRef<Position>(initialPosition);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  // Clean up global mouse event listeners on unmount
  useEffect(() => {
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, []);

  const handleMouseDown = useCallback((e: MouseEvent) => {
    // Only drag on left click (button 0)
    if (e.button !== 0) return;
    
    // Ignore interactive controls inside the drag handle
    const target = e.target as HTMLElement;
    if (target.closest('button, input, select, textarea, a, .menu-item')) {
      return;
    }

    if (onFocus) {
      onFocus();
    }

    // Clean up previous listeners if still active
    if (cleanupRef.current) {
      cleanupRef.current();
    }

    setIsDragging(true);
    const startMouseX = e.clientX;
    const startMouseY = e.clientY;
    const startPosX = positionRef.current.x;
    const startPosY = positionRef.current.y;

    const handleMouseMove = (moveEvent: globalThis.MouseEvent) => {
      const deltaX = moveEvent.clientX - startMouseX;
      const deltaY = moveEvent.clientY - startMouseY;

      // Keep window within reachable desktop bounds
      const minX = 0;
      const maxX = Math.max(100, window.innerWidth - 80);
      const minY = 0;
      const maxY = Math.max(50, window.innerHeight - 40);

      const nextX = Math.max(minX, Math.min(maxX, startPosX + deltaX));
      const nextY = Math.max(minY, Math.min(maxY, startPosY + deltaY));

      const nextPos = { x: nextX, y: nextY };
      positionRef.current = nextPos;
      setPosition(nextPos);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      cleanupRef.current = null;
    };

    cleanupRef.current = () => {
      setIsDragging(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      cleanupRef.current = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    e.preventDefault();
  }, [onFocus]);

  return {
    position,
    setPosition,
    isDragging,
    handleMouseDown
  };
}
