// src/pages/VideoPage.jsx
import { Link } from "react-router-dom";
import "../styles/VideoPage.css";

const VideoPage = () => {
  return (
    <div className="video-page">
      <div className="video-wrapper">
        <h2 className="video-title">🎥 Watch Our Demo</h2>

        {/* Video Player */}
        <div className="video-frame">
          <video className="video-player" controls>
            <source src="/evidya.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Description */}
        <p className="video-desc">
          Experience how <span>EVidya</span> helps students, faculty, and institutions
          track achievements seamlessly.
        </p>

        {/* Back Button */}
        <Link to="/">
          <button className="back-btn">⬅ Back to Home</button>
        </Link>
      </div>
    </div>
  );
};

export default VideoPage;