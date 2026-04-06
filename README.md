# Kairo AI - Multilingual Healthcare Assistant

Kairo AI is a comprehensive healthcare platform that leverages artificial intelligence to make medical information accessible and understandable. The platform allows users to upload medical reports, voice symptoms, and engage in multilingual conversations with an AI doctor assistant.

## 🚀 Features

- **Multilingual Support**: Communicate in your preferred language
- **Report Analysis**: Upload and analyze medical reports (PDF, images)
- **Voice Input**: Record symptoms via voice for analysis
- **X-ray Analysis**: Upload and interpret X-ray images
- **AI Chat**: Interactive conversations with AI healthcare assistant
- **Dark Mode**: Global dark mode support across all pages
- **Responsive Design**: Optimized for desktop and mobile devices

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15.1.3 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom animations
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **State Management**: React hooks with local storage for dark mode

### Backend APIs
- **Runtime**: Next.js API Routes (Node.js)
- **Authentication**: Custom JWT-based auth system
- **File Processing**: PDF parsing, image processing
- **AI Integration**: Multiple AI providers

### AI & ML Services
- **Google Generative AI**: Primary AI model for analysis
- **OpenAI**: Alternative AI provider
- **Hugging Face**: Transformers for NLP tasks
- **Pinecone**: Vector database for context storage
- **TensorFlow.js**: Client-side ML processing
- **LangChain**: AI orchestration framework

### External Integrations
- **Pinecone Database**: Vector storage for chat history
- **Google AI SDK**: Advanced AI capabilities
- **Hugging Face Inference**: Model inference
- **Xenova Transformers**: Browser-based transformers

## 📁 Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── api/               # API endpoints
│   │   ├── chat.ts        # Chat API
│   │   ├── login.ts       # User authentication
│   │   ├── signup.ts      # User registration
│   │   ├── upload/        # File upload endpoints
│   │   │   ├── audio.ts   # Audio analysis
│   │   │   ├── report.ts  # Report analysis
│   │   │   └── xray.ts    # X-ray analysis
│   ├── dashboard/         # User dashboard
│   ├── chat/              # AI chat interface
│   ├── about/             # About page
│   └── ...
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components (shadcn/ui)
│   ├── HeroSection.tsx   # Landing page hero
│   ├── Navbar.tsx        # Navigation component
│   ├── ChatBox.tsx       # Chat interface
│   └── ...
├── services/             # API service layer
│   ├── aiService.ts      # AI-related API calls
│   ├── api.ts           # Generic API utilities
│   └── authService.ts   # Authentication services
├── lib/                  # Utility libraries
│   ├── utils.ts         # General utilities
│   └── ats.ts           # ATS scoring logic
├── hooks/                # Custom React hooks
└── public/               # Static assets
```

## 🔧 API Endpoints

### Authentication
- `POST /api/login` - User login
- `POST /api/signup` - User registration

### File Upload & Analysis
- `POST /api/upload/report` - Analyze medical reports
- `POST /api/upload/xray` - Analyze X-ray images
- `POST /api/upload/audio` - Analyze voice recordings

### AI Services
- `POST /api/chat` - AI chat conversations
- `POST /api/checkatsscore` - ATS resume scoring
- `GET /api/listfiles` - List uploaded files
- `GET /api/listgeminireport` - List Gemini AI reports
- `POST /api/resumechat` - Resume chat sessions

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm, yarn, or pnpm
- API keys for AI services (Google AI, OpenAI, Pinecone)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd medihelp
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
Create a `.env.local` file with:
```env
GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_key
OPENAI_API_KEY=your_openai_key
PINECONE_API_KEY=your_pinecone_key
PINECONE_INDEX=your_index_name
NEXTAUTH_SECRET=your_secret
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Build & Deployment

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

### Deployment
The app is optimized for deployment on Vercel, Netlify, or any Node.js hosting platform.

## 🔐 Security & Privacy

- **HIPAA Compliance**: Adheres to healthcare data protection standards
- **End-to-end Encryption**: All data transmission is encrypted
- **Secure Authentication**: JWT-based user authentication
- **Data Minimization**: Only necessary data is stored and processed

## 🌍 Multilingual Support

The platform supports multiple languages for:
- User interface localization
- Medical report analysis
- Voice input processing
- AI chat responses

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is proprietary software. All rights reserved.

## 📞 Support

For support or questions, please contact the development team.

## 🔄 Recent Updates

- Migrated to Next.js 15 with App Router
- Added global dark mode support
- Implemented multilingual AI responses
- Enhanced UI with blue and white theme
- Added doctor image to hero section
- Updated logo integration
