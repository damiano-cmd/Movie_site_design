<script>
	import Lib from '../components/lib.svelte'
	import Load from '../components/load.svelte'
	import {seriesList, sScl, curentSPage} from '../stores.js'
	import axios from 'axios'

	let shows = [];

	let scroll;
	let height;
	let page = 0;
    	let maxpg = 3;
	let end = false;
	let load = true;

	function update() {
		load = false
			axios.get(`http://localhost:3000/api/show/series/${page}`).then(res => {
				maxpg = res.data.maxpage
				let news = shows
				for (let i = 0; i < res.data.shows.length; i++) {
					news.push(res.data.shows[i])
				}
				seriesList.set(news)
				load = true
				if (page >= maxpg) {
					end = true;
				}
			})
	}

	seriesList.subscribe(r => {
		shows = r
	})
	curentSPage.subscribe(r => {
		page = r
	})

	if (shows.length == 0) {
		update()
	}

	window.onscroll = () => {
		sScl.update(() => {
			return scroll
		})
		if (!end && load) {
			if (page < maxpg) {
				if ((document.body.offsetHeight - (scroll+height))<100) {
					update()
					curentSPage.update(n => {
						return n+1
					})
				}
			} else {
				end = true
			}
		}
	}
	setTimeout(() => {
		sScl.update(r => {
			window.scrollTo(0, r)
			return r
		})
	}, 10)
</script>

<svelte:window bind:scrollY={scroll} />

<main bind:clientHeight={height} >
	<Lib shows={shows} />
	{#if end == false}
	<Load />
	{/if}
</main>

<style>
</style>