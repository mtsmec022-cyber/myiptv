import { useState, useEffect, useCallback } from 'react';

export function useTVNavigation(initialFocusId: string) {
  const [focusedId, setFocusedId] = useState(initialFocusId);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // This is a simplified version. A real TV app would use a spatial navigation library
    // or a more complex grid-based logic.
    const elements = Array.from(document.querySelectorAll('[data-focusable="true"]')) as HTMLElement[];
    const currentIndex = elements.findIndex(el => el.id === focusedId);

    if (currentIndex === -1) return;

    const currentRect = elements[currentIndex].getBoundingClientRect();

    let nextIndex = -1;
    let minDistance = Infinity;

    const findNext = (direction: 'up' | 'down' | 'left' | 'right') => {
      elements.forEach((el, index) => {
        if (index === currentIndex) return;
        const rect = el.getBoundingClientRect();

        let isCorrectDirection = false;
        switch (direction) {
          case 'up': isCorrectDirection = rect.bottom <= currentRect.top; break;
          case 'down': isCorrectDirection = rect.top >= currentRect.bottom; break;
          case 'left': isCorrectDirection = rect.right <= currentRect.left; break;
          case 'right': isCorrectDirection = rect.left >= currentRect.right; break;
        }

        if (isCorrectDirection) {
          const dist = Math.sqrt(
            Math.pow(rect.left - currentRect.left, 2) +
            Math.pow(rect.top - currentRect.top, 2)
          );
          if (dist < minDistance) {
            minDistance = dist;
            nextIndex = index;
          }
        }
      });
    };

    switch (e.key) {
      case 'ArrowUp': findNext('up'); break;
      case 'ArrowDown': findNext('down'); break;
      case 'ArrowLeft': findNext('left'); break;
      case 'ArrowRight': findNext('right'); break;
      case 'Enter':
        elements[currentIndex].click();
        return;
    }

    if (nextIndex !== -1) {
      const nextId = elements[nextIndex].id;
      setFocusedId(nextId);
      elements[nextIndex].focus();
    }
  }, [focusedId]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return { focusedId, setFocusedId };
}
