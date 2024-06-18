import React from 'react';
import './Modal.css';
import Trailer from "./Trailer";

const Modal = ({isOpen, movie, onClose}) => {
    if (!isOpen) return null;
    return (
        <>
            <div className='modal-overlay'>
                <div className='modal-content' onClick={(e) => e.stopPropagation()}>
                    <button className='close-button' onClick={onClose}>X</button>
                    {movie && (
                        <>
                            <div className="modal-backdrop-container">
                                <img 
                                src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`} 
                                alt={movie.title} 
                                className="modal-backdrop" 
                                />
                            </div>
                            <h2>{movie.title}</h2>
                            <p><strong>Runtime:</strong> {movie.runtime} minutes</p>
                            <p><strong>Release Date:</strong> {movie.release_date}</p>
                            <p><strong>Genres:</strong> {movie.genres.map(genre => genre.name).join(', ')}</p>
                            <p>{movie.overview}</p>
                            <Trailer movieId={movie.id} />
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default Modal;