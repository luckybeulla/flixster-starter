import React, { useState, useEffect } from "react";
import "./MovieList.css";
import MovieCard from "./MovieCard";
import Modal from "./Modal";

function MovieList() {
    const [nowPlaying, setNowPlaying] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const moviesPerPage = 20;
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("nowPlaying");
    const [selectedMovie, setSelectedMovie] = useState(null); 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const apiKey = import.meta.env.VITE_API_KEY;
    const [sortBy, setSortBy] = useState("popularity.desc");
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState("");
    

    useEffect(() => {
        fetchGenres();
    }, []);

    const fetchGenres = async () => {
        try {
            const response = await fetch(
                `https://api.themoviedb.org/3/genre/movie/list?language=en&api_key=${apiKey}`
            );
            if (!response.ok) {
                throw new Error("Failed to fetch genres");
            }
            const data = await response.json();
            setGenres(data.genres);
        } catch (error) {
            setError(error.message);
        }
    };

    async function fetchMovies(url) {
        setIsLoading(true);
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            if (activeTab === "nowPlaying") {
                if (page === 1) {
                    setNowPlaying(data.results.slice(0, moviesPerPage));
                } else {
                    setNowPlaying((prevMovies) => [
                        ...prevMovies,
                        ...data.results.slice(0, moviesPerPage),
                    ]);
                }
            } else {
                if (page === 1) {
                    setSearchResults(data.results.slice(0, moviesPerPage));
                } else {
                    setSearchResults((prevResults) => [
                        ...prevResults,
                        ...data.results.slice(0, moviesPerPage),
                    ]);
                }
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        const url = activeTab === "nowPlaying"
            ? `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&page=${page}&sort_by=${sortBy}&with_genres=${selectedGenre}`
            : `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${searchQuery}&page=${page}`;

        fetchMovies(url);
    }, [page, activeTab, searchQuery, sortBy, selectedGenre]);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setPage(1);
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setPage(1);
        setSearchQuery("");
    };

    const loadMoreMovies = () => {
        setPage((prevPage) => prevPage + 1);
    };

    const handleMovieClick = async (movieId) => {
        try {
            const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const movieData = await response.json();
            setSelectedMovie(movieData);
            setIsModalOpen(true);
        } catch (error) {
            setError(error.message);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedMovie(null);
    }

    const handleSortChange = (e) => {
        setSortBy(e.target.value);
        setPage(1);
    };

    const handleGenreChange = (e) => {
        setSelectedGenre(e.target.value);
        setPage(1);
    };

    return (
        <div className="movie-list">
            <div className="tab-buttons">
                <button
                    className={activeTab === "nowPlaying" ? "active" : ""}
                    onClick={() => handleTabChange("nowPlaying")}
                >
                    Now Playing
                </button>
                <button
                    className={activeTab === "search" ? "active" : ""}
                    onClick={() => handleTabChange("search")}
                >
                    Search
                </button>
            </div>
            {activeTab === "search" && (
                <div className="search-section">
                    <input
                        type="text"
                        placeholder="Search movies..."
                        value={searchQuery}
                        onChange={handleSearch}
                        className="search-input"
                    />
                </div>
            )}
            <div className="filter-section">
                <div className="select-container">
                    <label className="sort-label">Sort By:</label>
                    <select value={sortBy} onChange={handleSortChange}>
                        <option value="original_title.asc">Alphabetic (A-Z)</option>
                        <option value="original_title.desc">Alphabetic (Z-A)</option>
                        <option value="popularity.desc">Popularity (Most-Least)</option>
                        <option value="popularity.asc">Popularity (Least-Most)</option>
                        <option value="release_date.desc">Release Date (Latest-Oldest)</option>
                        <option value="release_date.asc">Release Date (Oldest-Latest)</option>
                        <option value="vote_average.desc">Rating (Highest-Lowest)</option>
                        <option value="vote_average.asc">Rating (Highest-Lowest)</option>
                    </select>
                </div>
                <div className="select-container">
                    <label className="filter-label"></label>
                    <select value={selectedGenre} onChange={handleGenreChange}>
                        <option value="">All Genres</option>
                        {genres.map((genre) => (
                            <option key={genre.id} value={genre.id}>{genre.name}</option>
                        ))}
                    </select>
                </div>
            </div>
            {error && <div className="error">{error}</div>}
            <div className="movie-grid">
                {(activeTab === "nowPlaying" ? nowPlaying : searchResults).map(
                    (movie) => (
                        <MovieCard
                            key={movie.id}
                            title={movie.title}
                            overview={movie.overview}
                            poster={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                            voteAverage={movie.vote_average}
                            onClick={() => handleMovieClick(movie.id)}
                        />
                    )
                )}
            </div>
            {!isLoading && (
                <button
                    className="load-more-button"
                    onClick={loadMoreMovies}
                    disabled={isLoading}
                >
                    Load More...
                </button>
            )}
            {isLoading && <div>Loading...</div>}
            <Modal 
                isOpen={isModalOpen}
                movie={selectedMovie}
                onClose={closeModal}
            />
        </div>
    );   
}

export default MovieList;
