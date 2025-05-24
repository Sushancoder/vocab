# Vocabulary Builder

A modern web application that helps you learn new words with visual aids and mnemonics. The app generates random words along with their definitions, pronunciations, synonyms, and memory aids, then creates AI-generated images to help you remember them better.

## Features

- **Word Generation**: Get random words with detailed information including definition, pronunciation, and etymology
- **Visual Learning**: AI-generated images based on the word's meaning and mnemonic
- **Interactive Quizzes**: Test your knowledge with synonym matching
- **Progress Tracking**: Keeps track of words you've learned
- **Responsive Design**: Works on both desktop and mobile devices

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Google Gemini API key(Using Google's AI Studio, It's free)

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd emailer
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## How to Use

1. **Enter Your API Key**:
   - On first launch, you'll be prompted to enter your Google Gemini API key
   - The key will be saved in your browser's local storage for future use

2. **Generate a New Word**:
   - Click the "Get New Word" button to generate a random word
   - The app will display the word, its definition, pronunciation, and other details

3. **Test Your Knowledge**:
   - Try to identify the correct synonym from the given options
   - Click on your chosen synonym to check if it's correct

4. **Visual Learning**:
   - View the AI-generated image that helps visualize the word
   - The image is created based on the word's meaning and mnemonic

5. **Track Your Progress**:
   - The app keeps track of words you've learned in your browser's local storage
   - Previously seen words won't be repeated

## API Endpoints

- `POST /api/sender`: Generates word data using Google's Gemini AI
- `GET /api/imaginer`: Generates images based on word prompts

## Built With

- [Next.js](https://nextjs.org/) - React framework
- [Google Gemini API](https://ai.google.dev/) - For AI text and image generation
- [Tailwind CSS](https://tailwindcss.com/) - For styling

## License

This project is open source and available under the [MIT License](LICENSE).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
