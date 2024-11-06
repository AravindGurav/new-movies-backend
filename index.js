const express = require("express")
const app = express()

const cors = require("cors")
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
}

app.use(cors(corsOptions))

const { initializeDatabase } = require("./db/db.connect.js")
const Movie = require("./models/movie.models.js")

app.use(express.json())

initializeDatabase()

// const newMovie = {
//   title: "New Movie",
//   releaseYear: 2023,
//   genre: ["Drama"],
//   director: "Aditya Roy Chopra",
//   actors: ["Actor1", "Actor2"],
//   language: "Hindi",
//   country: "India",
//   rating: 6.1,
//   plot: "A young man and woman fall in love on a Australia trip.",
//   awards: "IFA Filmfare Awards",
//   posterUrl: "https://example.com/new-poster1.jpg",
//   trailerUrl: "https://example.com/new-trailer1.mp4",
// }

//async-await - it waits till the code is executed then proceeds to the next line

app.get("/", async (req, res) => {
  res.send("Hello, Express Server.")
})

async function createMovie(newMovie) {
  try {
    const movie = new Movie(newMovie)
    const saveMovie = await movie.save()
    //     console.log("New Movie Data: ", saveMovie)
    return saveMovie
  } catch (error) {
    console.log("error", error)
  }
}

// createMovie(newMovie)
//writing a post call here
app.post("/movies", async (req, res) => {
  try {
    const savedMovie = await createMovie(req.body)
    res
      .status(201)
      .json({ message: "Movie added successfully.", movie: savedMovie })
  } catch (error) {
    res.status(500).json({ error: "Failed to add movie" })
  }
})

//find a movie with a particular title

async function readMovieByTitle(movieTitle) {
  try {
    const movie = await Movie.findOne({ title: movieTitle })
    //   console.log(movie)
    return movie
  } catch (error) {
    throw error
  }
}

app.get("/movies/:title", async (req, res) => {
  try {
    const movie = await readMovieByTitle(req.params.title)
    if (movie) {
      res.json(movie)
    } else {
      res.status(404).json({ error: "Movie not found" })
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch movie." })
  }
})

//to get all the movies in the database

async function readAllMovies() {
  try {
    const allMovies = await Movie.find()
    //     console.log(allMovies)
    return allMovies
  } catch (error) {
    throw error
  }
}

app.get("/movies", async (req, res) => {
  try {
    const movies = await readAllMovies()

    if (movies.length != 0) {
      res.json(movies)
    } else {
      res.status(404).json({ error: "Movies not found" })
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch movies" })
  }
})

//get movie by director name

async function readMovieByDirector(directorName) {
  try {
    const movieByDirector = await Movie.find({ director: directorName })
    //     console.log(movieByDirector)
    return movieByDirector
  } catch (error) {
    console.log(error)
  }
}

app.get("/movies/director/:directorName", async (req, res) => {
  try {
    const movies = await readMovieByDirector(req.params.directorName)
    if (movies.length != 0) {
      res.json(movies)
    } else {
      res.status(404).json({ error: "Movies not found" })
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch movies from the specific director" })
  }
})

async function readMovieByGenre(genreName) {
  try {
    const movies = await Movie.find({ genre: genreName })
    // console.log(movies)
    return movies
  } catch (error) {
    console.log(error)
  }
}

app.get("/movies/genres/:genreName", async (req, res) => {
  try {
    const movies = await readMovieByGenre(req.params.genreName)

    if (movies.length != 0) {
      res.json(movies)
    } else {
      res.status(404).json({ error: "No movies found" })
    }
  } catch (error) {
    res.status(500).json("Failed to fetch movies")
  }
})

//writing a deleteMovie function that deleted movie from mongoose based on id
async function deleteMovie(movieId) {
  try {
    const deletedMovie = await Movie.findByIdAndDelete(movieId)
    return deletedMovie
  } catch (error) {
    console.log(error)
  }
}

//writing a delete api to delete a movie
app.delete("/movies/:movieId", async (req, res) => {
  try {
    const deletedMovie = await deleteMovie(req.params.movieId)
    res.status(200).json({
      message: "Movie deleted sucessfully.",
      movie: deletedMovie,
    })
  } catch (error) {
    res.status(500).json({ error: "Failed to delete movie" })
  }
})

//writing a function to update a movie
async function updateMovie(movieId, dataToUpdate) {
  try {
    const updatedMovie = await Movie.findByIdAndUpdate(movieId, dataToUpdate, {
      new: true,
    })
    // console.log(updatedMovie)
    return updatedMovie
  } catch (error) {
    console.log(error)
  }
}

// updateMovie("670b5c109aa3e2530da6f693", { releaseYear: 2002 })

//writing an api to update the movie
app.post("/movies/:movieId", async (req, res) => {
  try {
    const updatedMovie = await updateMovie(req.params.movieId, req.body)
    if (updatedMovie) {
      res.status(200).json({
        message: "Movie updated successfully.",
        movie: updatedMovie,
      })
    } else {
      res.status(404).json({ error: "Movie not found" })
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update the movie" })
  }
})

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`)
})
