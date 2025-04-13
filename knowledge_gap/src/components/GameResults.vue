<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import StorageService from '@/services/StorageService'

interface Circle {
  id: string;
  row: number;
  col: number;
  color: string;
  revealed: boolean;
  correctColor: string;
  clickable: boolean;
  highlight?: boolean;
}

interface GameResults {
  revealedCount: number;
  correctCount: number;
  totalCircles: number;
  circles: Circle[];
}

// Define interface for GameStats
interface GameStats {
  gamesPlayed: number;
  totalCorrect: number;
  totalQuestions: number;
  bestAccuracy: number;
  lastPlayed: string;
  categoryStats: Record<string, { played: number; correct: number }>;
}

const props = defineProps<{
  results: GameResults;
  width: number;
  height: number;
}>()

const emit = defineEmits(['playAgain'])

const showCorrections = ref(false)
const displayedCircles = ref<Circle[]>([])
const gameStats = ref<GameStats | null>(null)

// Compute the accuracy percentage
const accuracy = computed(() => {
  return Math.round((props.results.correctCount / props.results.totalCircles) * 100)
})

// Create a copy of the circles but with their displayed colors
onMounted(() => {
  displayedCircles.value = JSON.parse(JSON.stringify(props.results.circles))
  
  // Calculate category results (using colors as category identifiers)
  const categoryResults: Record<string, { correct: number, total: number }> = {}
  
  // Group circles by correctColor
  props.results.circles.forEach(circle => {
    if (!categoryResults[circle.correctColor]) {
      categoryResults[circle.correctColor] = { correct: 0, total: 0 }
    }
    
    categoryResults[circle.correctColor].total++
    if (circle.color === circle.correctColor) {
      categoryResults[circle.correctColor].correct++
    }
  })
  
  // Save results
  gameStats.value = StorageService.saveGameResults(
    props.results.correctCount, 
    props.results.totalCircles,
    categoryResults
  )
})

// Show the correct colors
const showCorrectColors = () => {
  showCorrections.value = true
  
  // Animate the correction process
  let index = 0
  const interval = setInterval(() => {
    if (index >= displayedCircles.value.length) {
      clearInterval(interval)
      return
    }
    
    const circle = displayedCircles.value[index]
    if (circle.color !== circle.correctColor) {
      // First highlight the incorrect circles by setting them to a highlighted state
      circle.highlight = true
      
      // After a short delay, change to the correct color
      setTimeout(() => {
        circle.color = circle.correctColor
        circle.highlight = false
      }, 500)
    }
    
    index++
  }, 50)
}

// Calculate statistics by color
const colorStats = computed(() => {
  const stats: Record<string, { total: number, correct: number }> = {}
  
  props.results.circles.forEach(circle => {
    // Initialize if this color hasn't been seen yet
    if (!stats[circle.correctColor]) {
      stats[circle.correctColor] = { total: 0, correct: 0 }
    }
    
    stats[circle.correctColor].total++
    if (circle.color === circle.correctColor) {
      stats[circle.correctColor].correct++
    }
  })
  
  // Convert to array and sort by accuracy
  return Object.entries(stats).map(([color, data]) => {
    const accuracy = Math.round((data.correct / data.total) * 100)
    return {
      color,
      total: data.total,
      correct: data.correct,
      accuracy
    }
  }).sort((a, b) => a.accuracy - b.accuracy)
})

const playAgain = () => {
  emit('playAgain')
}
</script>

<template>
  <div class="results-container">
    <h1 class="results-title">Game Complete!</h1>
    
    <div class="stats-container">
      <div class="stat-item">
        <h3>Accuracy</h3>
        <div class="stat-value">{{ accuracy }}%</div>
      </div>
      <div class="stat-item">
        <h3>Correct Answers</h3>
        <div class="stat-value">{{ results.correctCount }} / {{ results.totalCircles }}</div>
      </div>
    </div>
    
    <div class="boards-container">
      <div class="board-section">
        <h3>Your Image</h3>
        <div class="game-board" :style="{ gridTemplateColumns: `repeat(${width}, 1fr)` }">
          <div 
            v-for="circle in displayedCircles" 
            :key="circle.id"
            class="result-circle"
            :class="{ 'highlight': circle.highlight }"
            :style="{ backgroundColor: circle.color }"
          ></div>
        </div>
      </div>
      
      <div v-if="showCorrections" class="board-section">
        <h3>Correct Image</h3>
        <div class="game-board" :style="{ gridTemplateColumns: `repeat(${width}, 1fr)` }">
          <div 
            v-for="circle in results.circles" 
            :key="circle.id"
            class="result-circle"
            :style="{ backgroundColor: circle.correctColor }"
          ></div>
        </div>
      </div>
    </div>
    
    <div class="colors-analysis">
      <h3>Analysis by Category</h3>
      <div class="color-stats">
        <div 
          v-for="(stat, index) in colorStats" 
          :key="index"
          class="color-stat-item"
        >
          <div class="color-indicator" :style="{ backgroundColor: stat.color }"></div>
          <div class="color-details">
            <span class="color-accuracy">{{ stat.accuracy }}% accurate</span>
            <span class="color-count">{{ stat.correct }} / {{ stat.total }} correct</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="actions">
      <button v-if="!showCorrections" class="action-button show-corrections" @click="showCorrectColors">
        Show Correct Image
      </button>
      <button class="action-button play-again" @click="playAgain">
        Play Again
      </button>
    </div>
    
    <div class="explanation">
      <h3>What This Demonstrates</h3>
      <p>
        This game illustrates how gaps in knowledge can lead to a distorted view of reality. 
        The areas where you answered incorrectly created a different picture than what was actually there.
      </p>
      <p>
        Similarly, in real life, misinformation or lack of information in key areas can significantly 
        alter our perception and understanding of the world around us.
      </p>
    </div>
  </div>
</template>

<style scoped>
.results-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.results-title {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

.stats-container {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-bottom: 40px;
  width: 100%;
}

.stat-item {
  text-align: center;
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  width: 200px;
}

.stat-item h3 {
  margin: 0 0 10px 0;
  color: #555;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: #3f51b5;
}

.boards-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 30px;
  margin-bottom: 40px;
  width: 100%;
}

.board-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.board-section h3 {
  margin-bottom: 15px;
  color: #333;
}

.game-board {
  display: grid;
  grid-gap: 3px;
  width: 100%;
  max-width: 500px;
  aspect-ratio: 2/1;
}

.result-circle {
  width: 100%;
  aspect-ratio: 1/1;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.highlight {
  animation: blink 0.5s;
  transform: scale(1.2);
  z-index: 10;
}

.colors-analysis {
  width: 100%;
  margin-bottom: 40px;
}

.colors-analysis h3 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.color-stats {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 15px;
}

.color-stat-item {
  display: flex;
  align-items: center;
  background-color: #f9f9f9;
  padding: 10px 15px;
  border-radius: 6px;
  min-width: 200px;
}

.color-indicator {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 15px;
}

.color-details {
  display: flex;
  flex-direction: column;
}

.color-accuracy {
  font-weight: bold;
  color: #333;
}

.color-count {
  font-size: 0.9rem;
  color: #666;
}

.actions {
  display: flex;
  gap: 20px;
  margin-bottom: 40px;
}

.action-button {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}

.show-corrections {
  background-color: #3f51b5;
  color: white;
}

.show-corrections:hover {
  background-color: #303f9f;
}

.play-again {
  background-color: #4caf50;
  color: white;
}

.play-again:hover {
  background-color: #388e3c;
}

.explanation {
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  width: 100%;
  max-width: 800px;
}

.explanation h3 {
  margin-top: 0;
  color: #333;
}

.explanation p {
  line-height: 1.6;
  color: #555;
}

@keyframes blink {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); box-shadow: 0 0 10px rgba(255, 0, 0, 0.7); }
  100% { transform: scale(1); }
}

@media (max-width: 768px) {
  .stats-container {
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }
  
  .stat-item {
    width: 100%;
    max-width: 300px;
  }
  
  .actions {
    flex-direction: column;
    width: 100%;
    max-width: 300px;
  }
  
  .action-button {
    width: 100%;
  }
}
</style> 