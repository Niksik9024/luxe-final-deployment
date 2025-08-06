

'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Model } from '@/lib/types';


// Define the structure for carousel items
interface CarouselItem {
  id: string;
  img: string;
  modelName: string;
  profileUrl: string;
  thumbImg: string;
}

interface HeroCarouselProps {
  models: Model[];
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ models }) => {
  
  // Guard clause to prevent rendering if there are no models
  if (!models || models.length === 0) {
    return null; 
  }
  
  // Map the models data to the structure required by the carousel
  const initialItems: CarouselItem[] = models.map(model => ({
      id: model.id,
      img: model.image,
      modelName: model.name,
      profileUrl: `/models/${model.id}`,
      thumbImg: model.image,
  }));

  // State to hold the items and the current animation class
  const [items, setItems] = useState(initialItems);
  const [carouselClass, setCarouselClass] = useState('');

  // Refs to manage timeouts, preventing issues with re-renders
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const autoNextTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Animation and auto-play timing constants
  const timeRunning = 3000;
  const timeAutoNext = 7000;

  // Function to handle the 'next' slide transition
  const handleNext = useCallback(() => {
    setCarouselClass('next');
    // Defer the state update of items to allow the CSS animation to trigger first
    setTimeout(() => {
        setItems(prevItems => [...prevItems.slice(1), prevItems[0]]);
    }, 0);
  }, []);

  // Function to handle the 'previous' slide transition
  const handlePrev = () => {
    setCarouselClass('prev');
    // Defer the state update of items to allow the CSS animation to trigger first
    setTimeout(() => {
        setItems(prevItems => [prevItems[prevItems.length - 1], ...prevItems.slice(0, prevItems.length - 1)]);
    }, 0);
  };

  // useEffect to manage the animation class and auto-play timers
  useEffect(() => {
    if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
    }
    if (autoNextTimeoutRef.current) {
        clearTimeout(autoNextTimeoutRef.current);
    }

    if (carouselClass) {
      timeoutRef.current = setTimeout(() => {
        setCarouselClass('');
      }, timeRunning);
    }

    autoNextTimeoutRef.current = setTimeout(() => {
      handleNext();
    }, timeAutoNext);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (autoNextTimeoutRef.current) {
        clearTimeout(autoNextTimeoutRef.current);
      }
    };
  }, [items, carouselClass, handleNext]);

  if (!items || items.length === 0) {
    return null;
  }
  
  const thumbnailItems = items.slice(1);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;700;900&display=swap');
        
        .carousel {
          height: 92vh;
          width: 100%;
          overflow: hidden;
          position: relative;
        }
        .carousel .list .item {
          width: 100%;
          height: 100%;
          position: absolute;
          inset: 0 0 0 0;
        }
        .carousel .list .item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .carousel .list .item .content {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 1140px;
          max-width: 80%;
          padding-right: 30%;
          box-sizing: border-box;
          color: #fff;
          text-shadow: 0 5px 10px #0004;
          display: flex;
          flex-direction: column;
        }
        .carousel .list .item .model-name {
          font-size: 5em;
          font-weight: 700;
          line-height: 1.1em;
        }
        .carousel .list .item .model-label {
          font-size: 3em;
          font-weight: 300;
          color: #f1683a;
          text-transform: uppercase;
        }
        .carousel .list .item .buttons {
          margin-top: 20px;
        }
        .carousel .list .item .buttons a {
          display: inline-block;
          border: 1px solid #fff;
          background-color: transparent;
          color: #eee;
          padding: 5px 10px;
          font-family: 'Poppins', sans-serif;
          font-weight: 500;
          letter-spacing: 1px;
          text-decoration: none;
          transition: 0.3s;
        }
        .carousel .list .item .buttons a:hover {
            background-color: #fff;
            color: #000;
        }
        .thumbnail {
          position: absolute;
          bottom: 50px;
          left: 50%;
          width: max-content;
          z-index: 40;
          display: flex;
          gap: 20px;
        }
        .thumbnail .item {
          width: 150px;
          height: 220px;
          flex-shrink: 0;
          position: relative;
        }
        .thumbnail .item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 20px;
        }
        .thumbnail .item .content {
          color: #fff;
          position: absolute;
          bottom: 10px;
          left: 10px;
          right: 10px;
        }
        .thumbnail .item .content .title {
          font-weight: 500;
          font-size: 1em;
        }
        .arrows {
          position: absolute;
          top: 80%;
          right: 52%;
          z-index: 40;
          width: 300px;
          max-width: 30%;
          display: flex;
          gap: 10px;
          align-items: center;
        }
        .arrows button {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: #eee4;
          border: none;
          color: #fff;
          font-family: monospace;
          font-weight: bold;
          transition: .5s;
          cursor: pointer;
        }
        .arrows button:hover {
          background-color: #fff;
          color: #000;
        }
        .carousel .list .item:nth-child(1) {
          z-index: 1;
        }
        
        .carousel.next .list .item:nth-child(1) .content {
          display: none;
        }

        .carousel .list .item:nth-child(1) .content .model-name,
        .carousel .list .item:nth-child(1) .content .model-label,
        .carousel .list .item:nth-child(1) .content .buttons {
          transform: translateY(50px);
          filter: blur(20px);
          opacity: 0;
          animation: showContent .5s 1s linear 1 forwards;
        }
        @keyframes showContent {
          to {
            transform: translateY(0px);
            filter: blur(0px);
            opacity: 1;
          }
        }
        .carousel .list .item:nth-child(1) .content .model-label {
          animation-delay: 1.2s !important;
        }
        .carousel .list .item:nth-child(1) .content .buttons {
          animation-delay: 1.4s !important;
        }
        .carousel.next .list .item:nth-child(1) img {
          width: 150px;
          height: 220px;
          position: absolute;
          bottom: 50px;
          left: 50%;
          border-radius: 30px;
          animation: showImage .5s linear 1 forwards;
        }
        @keyframes showImage {
          to {
            bottom: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: 0;
          }
        }
        .carousel.next .thumbnail .item:nth-last-child(1) {
          overflow: hidden;
          animation: showThumbnail .5s linear 1 forwards;
        }
        .carousel.prev .list .item img {
          z-index: 40;
        }
        @keyframes showThumbnail {
          from {
            width: 0;
            opacity: 0;
          }
        }
        .carousel.next .thumbnail {
          animation: effectNext .5s linear 1 forwards;
        }
        @keyframes effectNext {
          from {
            transform: translateX(150px);
          }
        }
        .carousel .time {
          position: absolute;
          z-index: 1000;
          width: 0%;
          height: 3px;
          background-color: #f1683a;
          left: 0;
          top: 0;
        }
        .carousel.next .time,
        .carousel.prev .time {
          animation: runningTime 3s linear 1 forwards;
        }
        @keyframes runningTime {
          from { width: 100% }
          to { width: 0 }
        }
        .carousel.prev .list .item:nth-child(2) {
          z-index: 2;
        }
        .carousel.prev .list .item:nth-child(2) img {
          animation: outFrame 0.5s linear 1 forwards;
          position: absolute;
          bottom: 0;
          left: 0;
        }
        @keyframes outFrame {
          to {
            width: 150px;
            height: 220px;
            bottom: 50px;
            left: 50%;
            border-radius: 20px;
          }
        }
        .carousel.prev .thumbnail .item:nth-child(1) {
          overflow: hidden;
          opacity: 0;
          animation: showThumbnail .5s linear 1 forwards;
        }
        .carousel.next .arrows button,
        .carousel.prev .arrows button {
          pointer-events: none;
        }
        .carousel.prev .list .item:nth-child(2) .content .model-name,
        .carousel.prev .list .item:nth-child(2) .content .model-label,
        .carousel.prev .list .item:nth-child(2) .content .buttons {
          animation: contentOut 1.5s linear 1 forwards !important;
        }
        @keyframes contentOut {
          to {
            transform: translateY(-150px);
            filter: blur(20px);
            opacity: 0;
          }
        }
        @media screen and (max-width: 678px) {
          .carousel .list .item .content {
            padding-right: 0;
          }
          .carousel .list .item .content .model-name {
            font-size: 2.0em;
          }
          .carousel .list .item .content .model-label {
            font-size: 1.2em;
          }
        }
      `}</style>

      <div>
        <div className={`carousel ${carouselClass}`}>
          <div className="list">
            {items.map((item) => (
              <div className="item" key={item.id}>
                <img src={item.img} alt={item.modelName} onError={(e) => { (e.target as HTMLImageElement).onerror = null; (e.target as HTMLImageElement).src='https://placehold.co/1600x900/cccccc/ffffff?text=Image+Not+Found'; }}/>
                <div className="content">
                  <div className="model-name">{item.modelName}</div>
                  <div className="model-label">Model</div>
                  <div className="buttons">
                    <a href={item.profileUrl}>SEE PROFILE</a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="thumbnail">
            {thumbnailItems.map((item) => (
              <div className="item" key={item.id}>
                <img src={item.thumbImg} alt={`Thumbnail of ${item.modelName}`} onError={(e) => { (e.target as HTMLImageElement).onerror = null; (e.target as HTMLImageElement).src='https://placehold.co/150x220/cccccc/ffffff?text=Image+Not+Found'; }}/>
                <div className="content">
                  <div className="title">{item.modelName}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="arrows">
            <button id="prev" onClick={handlePrev} aria-label="Previous slide">&lt;</button>
            <button id="next" onClick={handleNext} aria-label="Next slide">&gt;</button>
          </div>
          
         
        </div>
      </div>
    </>
  );
};
