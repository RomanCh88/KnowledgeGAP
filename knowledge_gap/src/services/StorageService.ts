interface GameStats {
  gamesPlayed: number;
  totalCorrect: number;
  totalQuestions: number;
  bestAccuracy: number;
  lastPlayed: string;
  categoryStats: Record<string, { played: number; correct: number }>;
}

class StorageService {
  private readonly STORAGE_KEY = 'knowledge_gap_stats';
  
  // Initialize or get stats
  getStats(): GameStats {
    const storedData = localStorage.getItem(this.STORAGE_KEY);
    if (storedData) {
      try {
        return JSON.parse(storedData);
      } catch (e) {
        console.error('Error parsing stored stats', e);
        return this.createInitialStats();
      }
    }
    return this.createInitialStats();
  }
  
  // Create initial stats structure
  private createInitialStats(): GameStats {
    return {
      gamesPlayed: 0,
      totalCorrect: 0,
      totalQuestions: 0,
      bestAccuracy: 0,
      lastPlayed: new Date().toISOString(),
      categoryStats: {}
    };
  }
  
  // Save game results
  saveGameResults(correctCount: number, totalCount: number, categoryResults: Record<string, { correct: number, total: number }>) {
    const stats = this.getStats();
    
    // Update general stats
    stats.gamesPlayed += 1;
    stats.totalCorrect += correctCount;
    stats.totalQuestions += totalCount;
    stats.lastPlayed = new Date().toISOString();
    
    // Calculate accuracy for this game
    const accuracy = Math.round((correctCount / totalCount) * 100);
    if (accuracy > stats.bestAccuracy) {
      stats.bestAccuracy = accuracy;
    }
    
    // Update category stats
    Object.entries(categoryResults).forEach(([category, results]) => {
      if (!stats.categoryStats[category]) {
        stats.categoryStats[category] = { played: 0, correct: 0 };
      }
      
      stats.categoryStats[category].played += results.total;
      stats.categoryStats[category].correct += results.correct;
    });
    
    // Save to localStorage
    this.saveStats(stats);
    
    return stats;
  }
  
  // Clear all stats
  clearStats(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
  
  // Save stats to localStorage
  private saveStats(stats: GameStats): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stats));
    } catch (e) {
      console.error('Error saving stats to localStorage', e);
    }
  }
}

export default new StorageService(); 