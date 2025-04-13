<script setup lang="ts">
import { ref, computed } from 'vue'
import GameBoard from '@/components/GameBoard.vue'
import GameResults from '@/components/GameResults.vue'
import QuestionService from '@/services/QuestionService'

// Game configuration
const BOARD_WIDTH = 30
const BOARD_HEIGHT = 15

// Game state
const gameStarted = ref(false)
const gameCompleted = ref(false)
const gameResults = ref(null)
const selectedCategory = ref<string | null>(null)

// Available categories
const categories = computed(() => QuestionService.getCategories())

// Start the game
const startGame = () => {
  gameStarted.value = true
  gameCompleted.value = false
  gameResults.value = null
}

// Handle game completion
const handleGameComplete = (results: any) => {
  gameCompleted.value = true
  gameResults.value = results
}

// Play again
const playAgain = () => {
  gameStarted.value = false
  gameCompleted.value = false
  gameResults.value = null
  selectedCategory.value = null
}

// Select a category
const selectCategory = (category: string) => {
  selectedCategory.value = category
}
</script>

<template>
  <div class="game-view">
    <div v-if="!gameStarted" class="welcome-screen">
      <h1>Knowledge GAP</h1>
      <p class="game-description">
        Test your knowledge and discover how gaps in information can distort your perception of reality.
      </p>
      
      <div class="category-selection">
        <h2>Choose a Specialization (Optional)</h2>
        <p>If you choose a specialization, you'll get more questions in this area.</p>
        
        <div class="categories-grid">
          <button 
            v-for="category in categories" 
            :key="category"
            class="category-button"
            :class="{ 'selected': selectedCategory === category }"
            @click="selectCategory(category)"
          >
            {{ category }}
          </button>
        </div>
        
        <button 
          v-if="selectedCategory"
          class="clear-selection"
          @click="selectedCategory = null"
        >
          Clear Selection
        </button>
      </div>
      
      <div class="selected-category" v-if="selectedCategory">
        <p>You selected: <strong>{{ selectedCategory }}</strong></p>
      </div>
      
      <button class="start-button" @click="startGame">Start Game</button>
      
      <div class="game-rules">
        <h2>How to Play</h2>
        <ol>
          <li>Click on gray circles that are adjacent to colored ones</li>
          <li>Answer questions to reveal the circle's true color</li>
          <li>Correct answers reveal the right color; wrong answers show an incorrect color</li>
          <li>Your goal is to uncover the complete image as accurately as possible</li>
          <li>The game demonstrates how knowledge gaps can distort our perception of reality</li>
        </ol>
      </div>
    </div>
    
    <div v-else-if="gameStarted && !gameCompleted" class="game-screen">
      <GameBoard 
        :width="BOARD_WIDTH"
        :height="BOARD_HEIGHT"
        :selectedCategory="selectedCategory"
        @gameComplete="handleGameComplete"
      />
    </div>
    
    <div v-else-if="gameCompleted && gameResults" class="results-screen">
      <GameResults 
        :results="gameResults"
        :width="BOARD_WIDTH"
        :height="BOARD_HEIGHT"
        @playAgain="playAgain"
      />
    </div>
  </div>
</template>

<style scoped>
.game-view {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

.welcome-screen, .results-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.welcome-screen h1 {
  font-size: 3rem;
  color: #3f51b5;
  margin-bottom: 20px;
}

.game-description {
  font-size: 1.2rem;
  max-width: 800px;
  margin-bottom: 40px;
  color: #555;
  line-height: 1.5;
}

.category-selection {
  width: 100%;
  max-width: 800px;
  margin-bottom: 30px;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.category-selection h2 {
  margin-top: 0;
  color: #333;
}

.categories-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 15px;
  margin: 20px 0;
}

.category-button {
  padding: 10px 15px;
  background-color: white;
  border: 2px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 1rem;
}

.category-button:hover {
  border-color: #3f51b5;
  background-color: #f9f9f9;
}

.category-button.selected {
  background-color: #3f51b5;
  color: white;
  border-color: #3f51b5;
}

.clear-selection {
  background: none;
  border: none;
  color: #3f51b5;
  text-decoration: underline;
  cursor: pointer;
  font-size: 0.9rem;
  margin-top: 10px;
}

.selected-category {
  margin-bottom: 30px;
  font-size: 1.1rem;
}

.start-button {
  padding: 15px 40px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 40px;
}

.start-button:hover {
  background-color: #388e3c;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.game-rules {
  max-width: 800px;
  text-align: left;
  border-top: 1px solid #eee;
  padding-top: 20px;
}

.game-rules h2 {
  text-align: center;
  color: #333;
}

.game-rules ol {
  padding-left: 20px;
}

.game-rules li {
  margin-bottom: 10px;
  color: #555;
  line-height: 1.4;
}

.game-screen {
  width: 100%;
}
</style> 