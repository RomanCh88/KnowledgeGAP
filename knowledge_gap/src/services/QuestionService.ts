import questionsData from '@/data/questions.json'

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: string;
  difficulty: number;
  category: string;
}

export interface CategoryStats {
  category: string;
  total: number;
  correct: number;
  accuracy: number;
}

class QuestionService {
  private questions: Question[]
  private categories: string[]
  private selectedCategory: string | null = null

  constructor() {
    this.questions = questionsData.questions as Question[]
    
    // Extract unique categories
    const categorySet = new Set<string>()
    this.questions.forEach(q => categorySet.add(q.category))
    this.categories = Array.from(categorySet)
  }

  // Get all available questions
  getAllQuestions(): Question[] {
    return this.questions
  }

  // Get all available categories
  getCategories(): string[] {
    return this.categories
  }

  // Set a preferred category for the player
  setCategory(category: string | null): void {
    this.selectedCategory = category
  }

  // Get a random question
  getRandomQuestion(): Question {
    let questionPool = this.questions
    
    // If a category is selected, filter questions
    if (this.selectedCategory) {
      const categoryQuestions = this.questions.filter(q => q.category === this.selectedCategory)
      
      // If category has questions, use them; otherwise use all questions
      if (categoryQuestions.length > 0) {
        questionPool = categoryQuestions
      }
    }
    
    const randomIndex = Math.floor(Math.random() * questionPool.length)
    return questionPool[randomIndex]
  }

  // Get questions filtered by difficulty
  getQuestionsByDifficulty(difficulty: number): Question[] {
    return this.questions.filter(q => q.difficulty === difficulty)
  }

  // Get questions by category
  getQuestionsByCategory(category: string): Question[] {
    return this.questions.filter(q => q.category === category)
  }

  // Calculate statistics by category
  getCategoryStats(answers: Map<number, boolean>): CategoryStats[] {
    const stats = new Map<string, { total: number, correct: number }>()
    
    // Initialize stats for each category
    this.categories.forEach(category => {
      stats.set(category, { total: 0, correct: 0 })
    })
    
    // Calculate stats based on answers
    this.questions.forEach(question => {
      const questionAnswered = answers.has(question.id)
      if (questionAnswered) {
        const categoryStats = stats.get(question.category)!
        categoryStats.total++
        
        if (answers.get(question.id)) {
          categoryStats.correct++
        }
      }
    })
    
    // Convert to array and calculate accuracy
    return Array.from(stats.entries()).map(([category, data]) => {
      const accuracy = data.total > 0 ? (data.correct / data.total) * 100 : 0
      
      return {
        category,
        total: data.total,
        correct: data.correct,
        accuracy: Math.round(accuracy)
      }
    }).sort((a, b) => b.accuracy - a.accuracy)
  }
}

export default new QuestionService() 