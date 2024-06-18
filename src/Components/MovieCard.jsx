import React from "react";
import "./MovieCard.css";


function MovieCard({title, poster, voteAverage, onClick}) {
    return (
        <div className="movie-card" onClick={onClick}>
            <img src={poster} alt={title} />
            <div className="movie-info">
                <h3>{title}</h3>
                <p>Rating: {voteAverage}</p>
            </div>
        </div>
    );
}

export default MovieCard;