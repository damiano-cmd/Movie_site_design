import { writable } from 'svelte/store'

// main
export const bilbord = writable({})
export const latest = writable([])
export const popular = writable([])
export const comingsoon = writable([])
export const tags = writable([])
export const genresList = writable([])
export const genres = writable([])

//movies
export const movieList = writable([])
export const curentMPage = writable(0)
export const mScl = writable(0)

//series
export const seriesList = writable([])
export const curentSPage = writable(0)
export const sScl = writable(0)

//player
export const player = writable({
	t: 0
})

//login 
export const logedin = writable(false)