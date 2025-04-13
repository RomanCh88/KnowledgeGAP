# Knowledge GAP

An interactive web game that demonstrates how information manipulation works and how gaps in knowledge can distort our perception of reality.

## About the Game

Knowledge GAP is a educational game with the following features:

- 30x15 grid of interactive circles
- Answer questions to reveal colored patterns
- Correct answers reveal the true colors; incorrect answers show false colors
- Discover how misinformation and knowledge gaps create a distorted worldview
- Statistics and analysis at the end of each game
- Specialization options to focus on specific knowledge areas
- Progress tracking across multiple game sessions

## Game Mechanics

1. Start with a mostly gray board with only 5% of circles revealed in their true colors
2. Click on adjacent circles to reveal more of the image
3. Answer knowledge questions to reveal circles
4. Build a complete picture based on your knowledge
5. Compare your perception with reality at the end

## Technical Details

- Built with Vue.js 3, TypeScript, and modern web technologies
- Responsive design for desktop devices
- Local storage saving for game progress
- Dynamic question loading from a knowledge database

## Getting Started

### Installation

```bash
# Clone the repository
git clone [your-repo-url]

# Navigate to the project directory
cd knowledge_gap

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Building for Production

```bash
# Build the application
npm run build
```

### Running Tests

```bash
# Run unit tests
npm run test:unit
```

## Project Structure

```
knowledge_gap/
├── public/            # Static assets
├── src/
│   ├── assets/        # Images and styles
│   ├── components/    # Vue components
│   ├── data/          # Question database
│   ├── router/        # Vue Router configuration
│   ├── services/      # Game services
│   ├── stores/        # Pinia stores (if used)
│   └── views/         # Page components
├── index.html         # Entry HTML file
└── README.md          # This file
```

## Educational Purpose

This game was designed to demonstrate:

1. How gaps in knowledge affect our perception of reality
2. How misinformation uses these gaps to create false impressions
3. The importance of a well-rounded knowledge base
4. How our areas of expertise influence our understanding

## License

[Add your license information here]

## Acknowledgments

- Created as an educational project
- Questions cover various domains of knowledge
- Designed to promote critical thinking and awareness of information manipulation
