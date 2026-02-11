import { useState } from 'react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Card, CardContent } from './components/ui/card';
import { Checkbox } from './components/ui/checkbox';

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  playlistTitle: string;  
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
    <div className="min-h-screen bg-slate-950 text-slate-200">


      <div className="sticky top-0 z-20 backdrop-blur-xl bg-slate-900/70 border-b border-slate-800">
        <div className="h-16 flex items-center justify-between px-6 lg:px-10">

          {/* Left Cluster */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white font-semibold text-sm shadow-md">
              Y
            </div>

            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold text-slate-100 tracking-tight">
                Playlist Downloader
              </span>
              <span className="text-xs text-slate-400">
                Media Utility
              </span>
            </div>
          </div>

          {/* Right Cluster */}
          <div className="flex items-center gap-4">
            {videos.length > 0 && (
              <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-800/60 px-3 py-1.5 rounded-full border border-slate-700">
                <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                {videos.length} Videos
              </div>
            )}

            <button className="text-xs text-slate-400 hover:text-slate-200 transition">
              Help
            </button>
          </div>

        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Fetch Section */}
        <section className="mb-10">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-xs text-slate-400 uppercase tracking-wide mb-3">
              Playlist URL
            </p>

            <div className="flex gap-4">
              <Input
                type="text"
                value={playlistUrl}
                onChange={(e) => setPlaylistUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchPlaylist()}
                placeholder="https://youtube.com/playlist?list=..."
                className="h-11 flex-1 bg-slate-800 border-slate-700 text-slate-200 placeholder:text-slate-500"
                disabled={loading}
              />

              <Button
                onClick={fetchPlaylist}
                disabled={loading || !playlistUrl.trim()}
                className="h-11 px-6 bg-indigo-500 hover:bg-indigo-400 text-white"
              >
                {loading ? "Loading..." : "Fetch"}
              </Button>
            </div>
          </div>
        </section>

        {videos.length > 0 && (
          <section className="mb-6 flex items-center gap-6">
            <div className="w-28 h-28 rounded-xl bg-slate-800 flex items-center justify-center text-slate-500 text-sm border border-slate-700">
              <img src={videos[0].thumbnail} alt="" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-100">
                {videos[0].playlistTitle}
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                {videos.length} videos loaded
              </p>
            </div>
          </section>
        )}

        {videos.length > 0 && (
          <section className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3 text-sm text-slate-400">
              <Checkbox
                checked={selectedVideos.size === videos.length}
                onCheckedChange={selectAll}
              />
              Select all ({videos.length})
            </div>

            <div className="flex items-center gap-3">
              <Button
                size="sm"
                onClick={downloadSelected}
                disabled={selectedVideos.size === 0}
                className="bg-indigo-500 hover:bg-indigo-400 text-white"
              >
                Download Selected ({selectedVideos.size})
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-800"
                onClick={downloadAll}
              >
                Download All
              </Button>
            </div>
          </section>
        )}

        {/* Video List */}
        {videos.length > 0 && (
          <section className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">

            {videos.map((video, index) => (
              <div
                key={video.id}
                className="flex items-center gap-5 px-6 py-4 border-b border-slate-800 last:border-b-0 hover:bg-slate-800/50 transition"
              >
                <Checkbox
                  checked={selectedVideos.has(video.id)}
                  onCheckedChange={() => toggleVideo(video.id)}
                />

                <div className="text-xs text-slate-500 w-6 text-right">
                  {index + 1}
                </div>

                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-40 h-24 object-cover rounded-lg"
                />

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-100 truncate">
                    {video.title}
                  </p>
                </div>

                <Button
                  size="sm"
                  className="bg-indigo-500 hover:bg-indigo-400 text-white"
                  onClick={() => downloadVideo(video.id, video.title)}
                >
                  Download
                </Button>
              </div>
            ))}

          </section>
        )}

        {/* Empty State */}
        {!loading && videos.length === 0 && playlistUrl && (
          <div className="text-center py-16 text-slate-400 text-sm">
            No videos found. Please check the playlist URL.
          </div>
        )}

      </div>

    </div>
  );
}

export default App;