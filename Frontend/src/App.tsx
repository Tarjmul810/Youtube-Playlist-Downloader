import { useState } from 'react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Card, CardContent } from './components/ui/card';
import { Checkbox } from './components/ui/checkbox';

interface Video {
  id: string;
  title: string;
  thumbnail: string;
}

function App() {
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedVideos, setSelectedVideos] = useState(new Set());

  const fetchPlaylist = async () => {
    if (!playlistUrl.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/playlist-info?url=${encodeURIComponent(playlistUrl)}`
      );
      const data = await response.json();
      setVideos(data.videos);
      setSelectedVideos(new Set());
    } catch (error) {
      console.error('Error fetching playlist:', error);
      alert('Failed to fetch playlist. Please check the URL and try again.');
    }
    setLoading(false);
  };

const downloadVideo = (videoId: string, title: string) => {
    const link = document.createElement('a');
    link.href = `http://127.0.0.1:8000/api/download-video?video_id=${encodeURIComponent(videoId)}`;
    link.download = `${title}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadSelected = async () => {
    const videosToDownload = videos.filter(v => selectedVideos.has(v.id));
    for (let i = 0; i < videosToDownload.length; i++) {
      const video: Video = videosToDownload[i];
      downloadVideo(video.id, video.title);
      if (i < videosToDownload.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  };

  const downloadAll = async () => {
    for (let i = 0; i < videos.length; i++) {
      const video: Video = videos[i];
      downloadVideo(video.id, video.title);
      if (i < videos.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  };

  const toggleVideo = (videoId: string) => {
    const newSelected = new Set(selectedVideos);
    if (newSelected.has(videoId)) {
      newSelected.delete(videoId);
    } else {
      newSelected.add(videoId);
    }
    setSelectedVideos(newSelected);
  };

  const selectAll = () => {
    if (selectedVideos.size === videos.length) {
      setSelectedVideos(new Set());
    } else {
      setSelectedVideos(new Set(videos.map(v => v.id)));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-emerald-50">
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-display text-5xl font-bold bg-gradient-to-r from-primary via-accent to-success bg-clip-text text-transparent mb-3">
            YouTube Playlist Downloader
          </h1>
          <p className="text-gray-600 text-lg">
            Download your favorite playlists with ease
          </p>
        </div>

        {/* Input Section */}
        <Card className="mb-8 shadow-lg">
          <CardContent className="p-6">
            <div className="flex gap-3">
              <Input
                type="text"
                value={playlistUrl}
                onChange={(e) => setPlaylistUrl(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && fetchPlaylist()}
                placeholder="Paste YouTube playlist URL here..."
                className="flex-1 h-12 text-base"
                disabled={loading}
              />
              <Button
                onClick={fetchPlaylist}
                disabled={loading || !playlistUrl.trim()}
                className="h-12 px-8 bg-primary hover:bg-blue-600 text-white font-medium"
              >
                {loading ? 'Loading...' : 'Get Videos'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        {videos.length > 0 && (
          <div className="mb-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={selectedVideos.size === videos.length}
                  onCheckedChange={selectAll}
                  id="select-all"
                />
                <label
                  htmlFor="select-all"
                  className="text-sm font-medium text-gray-700 cursor-pointer"
                >
                  Select All ({videos.length} videos)
                </label>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={downloadSelected}
                  disabled={selectedVideos.size === 0}
                  className="bg-accent hover:bg-purple-600 text-white font-medium"
                >
                  Download Selected ({selectedVideos.size})
                </Button>
                <Button
                  onClick={downloadAll}
                  className="bg-success hover:bg-emerald-600 text-white font-medium"
                >
                  Download All
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Video List */}
        <div className="space-y-3">
          {videos.map((video, index) => (
            <Card
              key={video.id}
              className="overflow-hidden hover:shadow-md transition-shadow"
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {/* Checkbox */}
                  <Checkbox
                    checked={selectedVideos.has(video.id)}
                    onCheckedChange={() => toggleVideo(video.id)}
                    id={`video-${video.id}`}
                  />

                  {/* Index */}
                  <div className="flex-shrink-0 w-8 text-center">
                    <span className="text-sm font-semibold text-gray-500">
                      {index + 1}
                    </span>
                  </div>

                  {/* Thumbnail */}
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-40 h-24 object-cover rounded-lg flex-shrink-0"
                  />

                  {/* Title */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">
                      {video.title}
                    </h3>
                  </div>

                  {/* Download Button */}
                  <Button
                    onClick={() => downloadVideo(video.id, video.title)}
                    className="bg-primary hover:bg-blue-600 text-white flex-shrink-0"
                  >
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {!loading && videos.length === 0 && playlistUrl && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">
              No videos found. Please check the URL and try again.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;