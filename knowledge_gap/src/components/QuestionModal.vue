<script setup lang="ts">
interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: string;
  difficulty: number;
  category: string;
}

const props = defineProps<{
  question: Question
}>()

const emit = defineEmits(['selectAnswer'])

const selectAnswer = (answer: string) => {
  emit('selectAnswer', answer)
}
</script>

<template>
  <div class="modal-overlay">
    <div class="modal-container">
      <div class="modal-header">
        <h3>Question</h3>
        <span class="category-badge">{{ question.category }}</span>
      </div>
      
      <div class="modal-body">
        <p class="question-text">{{ question.text }}</p>
        
        <div class="options-container">
          <button 
            v-for="(option, index) in question.options" 
            :key="index"
            class="option-button"
            @click="selectAnswer(option)"
          >
            {{ option }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.modal-container {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  padding: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  animation: fadeIn 0.3s;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.modal-header h3 {
  margin: 0;
  color: #333;
  font-size: 1.5rem;
}

.category-badge {
  background-color: #3f51b5;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bold;
}

.modal-body {
  padding: 10px 0;
}

.question-text {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 20px;
  line-height: 1.5;
}

.options-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.option-button {
  padding: 12px 15px;
  border: 2px solid #ddd;
  border-radius: 8px;
  background-color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  color: #444;
}

.option-button:hover {
  border-color: #3f51b5;
  background-color: #f5f5f5;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style> 