# YouTube Playlist Downloader

A modern, full-stack web application for downloading YouTube playlists with ease. Built with Python (FastAPI) backend and React frontend, featuring a beautiful UI with real-time download progress.

<img width="1919" height="907" alt="image" src="https://github.com/user-attachments/assets/9b7e3506-93a9-4687-84e0-a26fd47e1dc7" />

*Main interface showing playlist input*

<img width="1903" height="908" alt="image" src="https://github.com/user-attachments/assets/d1e119c3-d417-465a-a72c-02ec5359d607" />

*Video list with thumbnails and download options*

## ✨ Features

- 🎯 **One-Click Downloads** - Download entire playlists or select specific videos
- 🖼️ **Video Thumbnails** - Preview videos before downloading
- ✅ **Batch Selection** - Select all or choose individual videos
- ⚡ **Streaming Downloads** - Videos stream directly through the API (no server storage)
- 🎨 **Modern UI** - Clean, responsive design with Tailwind CSS and shadcn/ui
- 🔄 **Smart Download Management** - Staggered downloads to prevent overwhelming the server

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern, fast web framework for building APIs
- **yt-dlp** - Powerful YouTube downloader library
- **Uvicorn** - ASGI server for running FastAPI
- **Python 3.12+**

### Frontend
- **React** - UI library for building interactive interfaces
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible component library
- **Inter & Outfit** - Modern typography

## 🚀 Getting Started

### Prerequisites

- Python 3.8 or higher
- Node.js 14 or higher
- npm or yarn

### Backend Setup

1. **Clone the repository**
```bash
   git clone https://github.com/yourusername/youtube-playlist-downloader.git
   cd youtube-playlist-downloader
```

2. **Set up Python virtual environment**
```bash
   cd backend
   python -m venv venv
   
   # On Windows
   venv\Scripts\activate
   
   # On Mac/Linux
   source venv/bin/activate
```

3. **Install dependencies**
```bash
   pip install -r requirements.txt
```

4. **Run the backend server**
```bash
   uvicorn app:app --reload
```

   The API will be available at `http://127.0.0.1:8000`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
   cd frontend
```

2. **Install dependencies**
```bash
   npm install
```

3. **Run the development server**
```bash
   npm start
```

   The app will open at `http://localhost:3000`

## 📖 API Documentation

Once the backend is running, visit `http://127.0.0.1:8000/docs` for interactive API documentation.

### Endpoints

#### GET `/api/playlist-info`
Retrieves information about all videos in a playlist.

**Query Parameters:**
- `url` (string, required) - YouTube playlist URL

**Response:**
```json
{
  "videos": [
    {
      "id": "video_id",
      "title": "Video Title",
      "url": "https://youtube.com/watch?v=...",
      "thumbnail": "https://..."
    }
  ]
}
```

#### GET `/api/download-video`
Streams a video file to the browser for download.

**Query Parameters:**
- `video_id` (string, required) - YouTube video ID

**Response:** Video file stream with appropriate headers

## 🎨 Color Scheme

- **Primary Blue**: `#3B82F6` - Main actions and interactive elements
- **Accent Purple**: `#8B5CF6` - Secondary actions and highlights
- **Success Green**: `#10B981` - Download confirmations and success states

## 📁 Project Structure
```
youtube-playlist-downloader/
├── backend/
│   ├── app.py                 # FastAPI application
│   ├── requirements.txt       # Python dependencies
│   └── venv/                  # Virtual environment
├── frontend/
│   ├── src/
│   │   ├── components/        # shadcn/ui components
│   │   ├── App.js            # Main React component
│   │   └── index.css         # Global styles
│   ├── package.json
│   └── tailwind.config.js    # Tailwind configuration
└── README.md
```

## 🔧 Configuration

### CORS Settings
The backend is configured to accept requests from `http://localhost:3000` by default. To change this, modify the `allow_origins` in `app.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Update this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Download Delay
By default, there's a 2-second delay between downloads to prevent overwhelming the server. Adjust this in `App.js`:
```javascript
await new Promise(resolve => setTimeout(resolve, 2000)); // Change 2000 (2 seconds)
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## ⚠️ Disclaimer

This tool is for educational purposes only. Please respect YouTube's Terms of Service and copyright laws. Only download content you have the right to download.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [yt-dlp](https://github.com/yt-dlp/yt-dlp) - The powerful YouTube downloader
- [FastAPI](https://fastapi.tiangolo.com/) - Modern Python web framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful component library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

## 📧 Contact

Your Name - [@yourtwitter](https://twitter.com/yourtwitter) - your.email@example.com

Project Link: [https://github.com/yourusername/youtube-playlist-downloader](https://github.com/yourusername/youtube-playlist-downloader)
