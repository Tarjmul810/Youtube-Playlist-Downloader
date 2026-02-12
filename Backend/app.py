from fastapi import FastAPI
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import yt_dlp
import requests
import os
import uuid

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "YouTube Playlist Downloader API"}

@app.get("/api/playlist-info")
def get_playlist_info(url: str):
    ydl_opts = {
        'quiet': True,
        'extract_flat': True,  # Don't download, just get info
    }
    
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)

            playlistTitle = info.get('title')
            
            videos = []
            for entry in info['entries']:
                # Get thumbnail safely
                if len(entry['thumbnails']) >= 2:
                    thumbnail_url = entry['thumbnails'][1]['url']
                else:
                    thumbnail_url = entry['thumbnails'][0]['url']
                
                videos.append({
                    'id': entry['id'],
                    'title': entry['title'],
                    'url': entry['url'],
                    'thumbnail': thumbnail_url,
                    'playlistTitle': playlistTitle
                })
            
            return {
                'videos': videos
            }
            
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={
                "error": True,
                "message": f"Failed to fetch playlist: {str(e)}"
            }
        )

@app.get("/api/download-video")
def download_video(video_id: str):
    video_url = f"https://www.youtube.com/watch?v={video_id}"
    
    # Unique temp filename to avoid conflicts
    unique_id = str(uuid.uuid4())[:8]
    temp_path = f"/tmp/video_{unique_id}.mp4"
    
    ydl_opts = {
        'format': 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
        'merge_output_format': 'mp4',
        'outtmpl': temp_path,
        'quiet': True,
    }
    
    try:
        # yt-dlp handles downloading AND merging with ffmpeg
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(video_url, download=True)
            title = info.get('title', 'video')
        
        # Check if temp file was actually created
        if not os.path.exists(temp_path):
            return JSONResponse(
                status_code=500,
                content={
                    "error": True,
                    "message": f"Failed to process video '{title}'. File not created."
                }
            )
        
        # Clean filename
        safe_filename = "".join(
            c for c in title
            if c.isalnum() or c in (' ', '-', '_', '.')
        ).strip() + '.mp4'
        
        # Get file size for Content-Length header
        file_size = os.path.getsize(temp_path)
        
        # Stream temp file to browser chunk by chunk
        def generate():
            try:
                with open(temp_path, 'rb') as f:
                    while True:
                        chunk = f.read(1024 * 1024)  # 1MB chunks
                        if not chunk:
                            break
                        yield chunk
            finally:
                # Always delete temp file after streaming
                if os.path.exists(temp_path):
                    os.remove(temp_path)
                    print(f"✅ Deleted temp file: {temp_path}")
        
        return StreamingResponse(
            generate(),
            media_type="video/mp4",
            headers={
                "Content-Disposition": f"attachment; filename={safe_filename}",
                "Content-Length": str(file_size),  # Enables Chrome progress bar
            }
        )
        
    except Exception as e:
        # Always clean up temp file if something goes wrong
        if os.path.exists(temp_path):
            os.remove(temp_path)
        return JSONResponse(
            status_code=500,
            content={
                "error": True,
                "message": f"Failed to download '{video_id}': {str(e)}"
            }
        )