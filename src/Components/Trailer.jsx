import React, { useState, useEffect } from 'react';
import './Trailer.css';

const Trailer = ({ movieId }) => {
    const [trailerUrl, setTrailerUrl] = useState('');

    useEffect(() => {
        if (movieId) {
            fetchTrailer(movieId);
        }
    }, [movieId]);

    const fetchTrailer = async (movieId) => {
        const apiKey = import.meta.env.VITE_API_KEY;
        try {
            const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}`);
            if (!response.ok) {
                throw new Error('Failed to fetch trailer');
            }
            const data = await response.json();
            const trailer = data.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
            if (trailer) {
                setTrailerUrl(`https://www.youtube.com/embed/${trailer.key}`);
            }
        } catch (error) {
            console.error('Error fetching trailer:', error);
        }
    };

    if (!trailerUrl) return null;

    return (
        <div className="trailer-container">
            <iframe
                width="560"
                height="315"
                src={trailerUrl}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            ></iframe>
        </div>
    );
};

export default Trailer;
