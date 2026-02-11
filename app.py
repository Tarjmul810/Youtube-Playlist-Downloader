from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import yt_dlp
import requests

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Your React app
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/playlist-info")
def get_playlist_info(url: str):
    ydl_opts = {
        'quiet': True,
        'extract_flat': True,  # Don't download, just get info
    }
    
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=False)

        playlistTitle = info.get('title')
        
        videos = []
        for entry in info['entries']:

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
        return {'videos': videos}


@app.get("/api/download-video")
def download_video(video_id: str):
    video_url = f"https://www.youtube.com/watch?v={video_id}"
    
    ydl_opts = {
        'format': 'best',
        'quiet': True,
    }
    
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(video_url, download=False)
        video_url_direct = info['url']
        filename = f"{info['title']}.{info['ext']}"
        
     # Stream the video
    def generate():
        response = requests.get(video_url_direct, stream=True)
        for chunk in response.iter_content(chunk_size=1024*1024):  # 1MB chunks
            yield chunk
    
    return StreamingResponse(
        generate(),
        media_type="video/mp4",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
        )