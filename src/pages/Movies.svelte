<script>
	import Lib from '../components/lib.svelte'
	import Load from '../components/load.svelte'
	import {movieList, mScl, curentMPage} from '../stores.js'
	import axios from 'axios'

	let movies = [];

	let scroll;
	let height;
	let page = 0;
    	let maxpg = 0;
	let end = false;
	let load = true;

	async function update() {
		load = false
			axios.get(`http://localhost:3000/api/show/movie/${page}`).then(res => {
				maxpg = res.data.maxpage
				let newm = movies
				for (let i = 0; i < res.data.shows.length; i++) {
					newm.push(res.data.shows[i])
				}
				console.log(newm)
				movieList.set(newm)
				load = true
				if (page >= maxpg) {
					end = true;
				}
			})
	}

	movieList.subscribe(r => {
		movies = r
	})
	curentMPage.subscribe(r => {
		page = r
	})

	if (movies.length == 0) {
		update()
	}

	window.onscroll = () => {
		mScl.update(() => {
			return scroll
		})
		if (!end && load) {
			if (page < maxpg) {
				if ((document.body.offsetHeight - (scroll+height))<10) {
					update()
					curentMPage.update(n => {
						return n+1
					})
				}
			} else {
				end = true
			}
		}
		console.log(page, maxpg)
	}
	setTimeout(() => {
		mScl.update(r => {
			window.scrollTo(0, r)
			return r
		})
	}, 10)
</script>

<svelte:window bind:scrollY={scroll} />

<main bind:clientHeight={height} >
	<Lib shows={movies} />
	{#if end == false}
	<Load />
	{/if}
</main>

<style>
</style>