const TMDB_CONFIG = {
    BASE_URL: 'https://api.themoviedb.org/3',

    headers:{
        accept:'application/json',
        Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`
    }
}

const getMovieDetails = async (tmdbId) => {
    const endpoint = `${TMDB_CONFIG.BASE_URL}/movie/${tmdbId}`

    const response = await fetch(endpoint,{
        method: 'GET',
        headers: TMDB_CONFIG.headers,
    });

    if(!response.ok){
        throw new Error(`Failed to fetch movie details: ${response.statusText}`);
    }

    const data = await response.json();

    return data;
}

module.exports={
    getMovieDetails
}