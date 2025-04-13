<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import GameCircle from './GameCircle.vue'
import QuestionModal from './QuestionModal.vue'
import QuestionService, { Question } from '@/services/QuestionService'

interface Circle {
  id: string;
  row: number;
  col: number;
  color: string;
  revealed: boolean;
  correctColor: string;
  clickable: boolean;
}

const props = defineProps<{
  width: number;
  height: number;
  selectedCategory: string | null;
}>()

const emit = defineEmits(['gameComplete'])

const circles = ref<Circle[]>([])
const selectedCircle = ref<Circle | null>(null)
const currentQuestion = ref<Question | null>(null)
const questionModalOpen = ref(false)
const revealedCount = ref(0)
const correctCount = ref(0)
const totalCircles = computed(() => props.width * props.height)
const progress = computed(() => Math.round((revealedCount.value / totalCircles.value) * 100))

// Colors for the game with corresponding meanings
const colors = [
  '#E53935', // Red
  '#1E88E5', // Blue
  '#43A047', // Green
  '#FDD835', // Yellow
  '#8E24AA', // Purple
  '#FB8C00', // Orange
  '#00ACC1', // Cyan
  '#212121'  // Black
]

// Set the selected category in the service
onMounted(() => {
  QuestionService.setCategory(props.selectedCategory)
  initializeBoard()
})

// Create the board with initial pattern
const initializeBoard = () => {
  circles.value = []
  
  // Create pattern matrix
  const pattern = generateGamePattern(props.width, props.height)
  
  // Create circles
  for (let row = 0; row < props.height; row++) {
    for (let col = 0; col < props.width; col++) {
      const id = `${row}-${col}`
      const correctColor = pattern[row][col]
      const circle: Circle = {
        id,
        row,
        col,
        color: 'gray', // Start with all gray
        revealed: false,
        correctColor,
        clickable: false
      }
      circles.value.push(circle)
    }
  }
  
  // Reveal initial ~5% of circles
  const initialRevealCount = Math.floor(totalCircles.value * 0.05)
  revealInitialCircles(initialRevealCount)
  
  // Update clickable state for all circles
  updateClickableState()
}

// Generate color pattern for the game
const generateGamePattern = (width: number, height: number) => {
  const pattern: string[][] = Array(height).fill(0).map(() => Array(width).fill(''))
  
  // Dominant color (30-40% of the board)
  const dominantColor = colors[Math.floor(Math.random() * colors.length)]
  
  // Create coherent pattern with clusters
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      // Create more structured pattern with clusters
      const distanceFromCenter = Math.sqrt(
        Math.pow((row - height / 2) / height, 2) + 
        Math.pow((col - width / 2) / width, 2)
      )
      
      // Probability based on location
      const probDominant = 0.35 - distanceFromCenter * 0.5
      
      if (Math.random() < probDominant) {
        pattern[row][col] = dominantColor
      } else {
        // For non-dominant colors, make adjacent cells likely to have the same color
        if (row > 0 && col > 0) {
          const aboveColor = pattern[row-1][col]
          const leftColor = pattern[row][col-1]
          const diagonalColor = pattern[row-1][col-1]
          
          // 60% chance to match an adjacent color
          if (Math.random() < 0.6) {
            const adjacentColors = [aboveColor, leftColor, diagonalColor].filter(c => c !== '')
            if (adjacentColors.length > 0) {
              const randomAdjacentColor = adjacentColors[Math.floor(Math.random() * adjacentColors.length)]
              pattern[row][col] = randomAdjacentColor
              continue
            }
          }
        }
        
        // Otherwise choose a random color that's not the dominant one
        let randomColor
        do {
          randomColor = colors[Math.floor(Math.random() * colors.length)]
        } while (randomColor === dominantColor && Math.random() < 0.7)
        
        pattern[row][col] = randomColor
      }
    }
  }
  
  return pattern
}

// Reveal initial circles on the board
const revealInitialCircles = (count: number) => {
  const initialIndices = new Set<number>()
  
  // Ensure we have the required number of unique indices
  while (initialIndices.size < count) {
    const randomIndex = Math.floor(Math.random() * circles.value.length)
    initialIndices.add(randomIndex)
  }
  
  // Reveal the circles at these indices
  initialIndices.forEach(index => {
    const circle = circles.value[index]
    circle.revealed = true
    circle.color = circle.correctColor
    revealedCount.value++
    correctCount.value++
  })
}

// Update which circles are clickable (adjacent to revealed circles)
const updateClickableState = () => {
  circles.value.forEach(circle => {
    if (circle.revealed) {
      circle.clickable = false
      return
    }
    
    // Check if this circle is adjacent to any revealed circle
    const adjacentCircles = getAdjacentCircles(circle)
    circle.clickable = adjacentCircles.some(c => c.revealed)
  })
}

// Get adjacent circles (sharing a side)
const getAdjacentCircles = (circle: Circle) => {
  const { row, col } = circle
  const adjacent: Circle[] = []
  
  // Check four directions (up, right, down, left)
  const directions = [
    { r: -1, c: 0 }, // up
    { r: 0, c: 1 },  // right
    { r: 1, c: 0 },  // down
    { r: 0, c: -1 }  // left
  ]
  
  directions.forEach(dir => {
    const newRow = row + dir.r
    const newCol = col + dir.c
    
    if (newRow >= 0 && newRow < props.height && newCol >= 0 && newCol < props.width) {
      const adjacentCircle = circles.value.find(c => c.row === newRow && c.col === newCol)
      if (adjacentCircle) adjacent.push(adjacentCircle)
    }
  })
  
  return adjacent
}

// Handle click on a circle
const handleCircleClick = (circle: Circle) => {
  if (!circle.clickable || circle.revealed) return
  
  selectedCircle.value = circle
  
  // Get a random question from the service
  currentQuestion.value = QuestionService.getRandomQuestion()
  
  questionModalOpen.value = true
}

// Handle answer selection
const handleAnswer = (selectedAnswer: string) => {
  if (!selectedCircle.value || !currentQuestion.value) return
  
  const isCorrect = selectedAnswer === currentQuestion.value.correctAnswer
  
  // Reveal the circle
  selectedCircle.value.revealed = true
  revealedCount.value++
  
  if (isCorrect) {
    // If correct, show the true color
    selectedCircle.value.color = selectedCircle.value.correctColor
    correctCount.value++
  } else {
    // If incorrect, show a wrong color
    let wrongColor = selectedCircle.value.correctColor
    while (wrongColor === selectedCircle.value.correctColor) {
      wrongColor = colors[Math.floor(Math.random() * colors.length)]
    }
    selectedCircle.value.color = wrongColor
  }
  
  // Close the modal and update clickable state
  questionModalOpen.value = false
  currentQuestion.value = null
  selectedCircle.value = null
  
  // Update clickable state for all circles
  updateClickableState()
  
  // Check if game is complete
  if (revealedCount.value === totalCircles.value) {
    emit('gameComplete', {
      revealedCount: revealedCount.value,
      correctCount: correctCount.value,
      totalCircles: totalCircles.value,
      circles: circles.value
    })
  }
}
</script>

<template>
  <div class="game-container">
    <div class="progress-bar">
      <div class="progress" :style="{ width: `${progress}%` }"></div>
      <span class="progress-text">{{ revealedCount }} / {{ totalCircles }} ({{ progress }}%)</span>
    </div>
    
    <div class="game-board" :style="{ gridTemplateColumns: `repeat(${width}, 1fr)` }">
      <GameCircle 
        v-for="circle in circles" 
        :key="circle.id"
        :circle="circle"
        @click="handleCircleClick(circle)"
      />
    </div>
    
    <QuestionModal
      v-if="questionModalOpen && currentQuestion"
      :question="currentQuestion"
      @select-answer="handleAnswer"
    />
  </div>
</template>

<style scoped>
.game-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.progress-bar {
  width: 100%;
  height: 20px;
  background-color: #e0e0e0;
  border-radius: 10px;
  margin-bottom: 20px;
  position: relative;
  overflow: hidden;
}

.progress {
  height: 100%;
  background-color: #4CAF50;
  border-radius: 10px;
  transition: width 0.3s ease;
}

.progress-text {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000;
  font-weight: bold;
}

.game-board {
  display: grid;
  grid-gap: 4px;
  width: 100%;
  aspect-ratio: 2/1;
}
</style> 