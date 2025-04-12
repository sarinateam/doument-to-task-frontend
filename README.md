# Document-to-Task AI - Frontend

<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
</div>

## Overview

The Document-to-Task AI frontend is a modern React application that provides a user-friendly interface for analyzing software development documents and extracting actionable tasks. It features a clean, responsive design with real-time progress updates and Excel export functionality.

## Features

- **Document Upload**: Drag-and-drop interface for uploading documents
- **Text Input**: Direct text input for quick analysis
- **Real-time Progress**: Visual progress bar with status updates
- **Excel Export**: One-click export of extracted tasks to Excel
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Clean, intuitive interface with smooth animations

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend server running (see backend README)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/document-to-task-ai.git
   cd document-to-task-ai/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the frontend directory with the following variables:
   ```
   REACT_APP_API_URL=http://localhost:3001
   ```

## Usage

### Development

Start the development server:

```bash
npm start
# or
yarn start
```

The application will start on port 3000 and automatically open in your default browser.

### Production

Build the application:

```bash
npm run build
# or
yarn build
```

The build artifacts will be stored in the `build/` directory.

## How to Use

1. **Upload a Document**:
   - Drag and drop a PDF, DOCX, or TXT file onto the upload area
   - Or click the upload area to select a file

2. **Enter Text Directly**:
   - Type or paste your document text into the text area
   - Click "Analyze" to process the text

3. **View Progress**:
   - Watch the progress bar as the document is analyzed
   - See real-time status updates

4. **Export Tasks**:
   - Once analysis is complete, click "Export to Excel"
   - The tasks will be downloaded as an Excel file

## Project Structure

```
frontend/
├── public/              # Static files
├── src/
│   ├── components/      # React components
│   ├── services/        # API services
│   ├── types/           # TypeScript type definitions
│   ├── App.tsx          # Main application component
│   └── index.tsx        # Application entry point
├── .env                 # Environment variables
├── package.json         # Dependencies and scripts
└── tsconfig.json        # TypeScript configuration
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| REACT_APP_API_URL | Backend API URL | http://localhost:3001 |

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- React for the frontend framework
- TypeScript for the type safety
- OpenAI for the AI capabilities 