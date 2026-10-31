"use client";

import { useRef, useState } from "react";

const videos = [
  { file:"eric.mp4", title:"Eric", poster:"eric.jpg", landscape:false },
  { file:"stuart.mp4", title:"Stuart", poster:"stuart.jpg", landscape:false },
  { file:"sq-dentist.mp4", title:"Patient Experience", poster:"sq-dentist.jpg", landscape:false },
  { file:"peter-kelly.mp4", title:"Peter Kelly", poster:"peter-kelly.jpg", landscape:false },
  { file:"sasiya.mp4", title:"Sasiya", poster:"sasiya.jpg", landscape:false },
];

export function VideoGallery() {
  const gallery = useRef<HTMLElement>(null);
  const [failed,setFailed] = useState<string[]>([]);
  const [expanded,setExpanded] = useState(false);
  return <section ref={gallery} className="video-section section-inner section-line" id="videos" aria-labelledby="video-heading">
    <div className="video-section-heading"><span>PATIENT STORIES</span><h2 id="video-heading">Hear from Our Patients</h2><p>Our patients share their treatment experiences and what it’s like to receive care at SQ Dentist.</p></div>
    <div className="video-grid" id="patient-video-grid">{videos.slice(0,expanded ? videos.length : 3).map((video,index) => {
      const source = `/sites/sqdentist/videos/web/${video.file}`;
      return <figure className={`video-card${video.landscape ? " video-landscape" : ""}`} key={video.file}>
        {/* Source files are supplied without separate caption tracks. */}
        <video controls playsInline preload="none" data-extra={index >= 3} poster={`/sites/sqdentist/videos/posters/${video.poster}`} aria-label={`SQ Dentist video: ${video.title}`} onPlay={event => {
          const playing = event.currentTarget;
          gallery.current?.querySelectorAll("video").forEach(item => {if(item !== playing)item.pause();});
        }} onError={() => setFailed(current => current.includes(video.file) ? current : [...current,video.file])}>
          <source src={source} type="video/mp4"/>
          Your browser does not support video. <a href={source}>Open this video</a>.
        </video>
        <figcaption><span aria-hidden="true">0{index + 1}</span><h3>{video.title}</h3></figcaption>
        {failed.includes(video.file) && <p className="video-error" role="status">This video could not be played. <a href={source} target="_blank" rel="noreferrer">Open the video directly</a>.</p>}
      </figure>;
    })}</div>
    {videos.length > 3 && <div className="video-more"><button type="button" aria-expanded={expanded} aria-controls="patient-video-grid" onClick={() => {
      if (expanded) gallery.current?.querySelectorAll<HTMLVideoElement>("video[data-extra='true']").forEach(video => video.pause());
      setExpanded(current => !current);
    }}>{expanded ? "View less" : "View more"}<span aria-hidden="true">{expanded ? "↑" : "↓"}</span></button></div>}
  </section>;
}
