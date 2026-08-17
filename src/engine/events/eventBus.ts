import { LearningEvent, LearningEventType } from '../../types/events';

type EventListener = (event: LearningEvent) => void;

class LearningEventBus {
  private listeners: Map<LearningEventType | '*', Set<EventListener>> = new Map();
  private eventLog: LearningEvent[] = [];

  subscribe(eventType: LearningEventType | '*', listener: EventListener): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)!.add(listener);

    return () => {
      this.listeners.get(eventType)?.delete(listener);
    };
  }

  emit(event: LearningEvent): void {
    this.eventLog.push(event);

    // Specific listeners
    const specific = this.listeners.get(event.type);
    if (specific) {
      specific.forEach((listener) => {
        try {
          listener(event);
        } catch (err) {
          console.error(`Error in event listener for ${event.type}:`, err);
        }
      });
    }

    // Global wildcard listeners
    const wildcard = this.listeners.get('*');
    if (wildcard) {
      wildcard.forEach((listener) => {
        try {
          listener(event);
        } catch (err) {
          console.error(`Error in wildcard event listener:`, err);
        }
      });
    }
  }

  getRecentEvents(limit: number = 20): LearningEvent[] {
    return this.eventLog.slice(-limit);
  }
}

export const eventBus = new LearningEventBus();
