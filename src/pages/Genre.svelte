<script>
	import Lib from '../components/lib.svelte'
	import Load from '../components/load.svelte'
	import axios from 'axios'

	export let genre;

	let shows = [];

	let scroll;
	let height;
	let page = 0;
    	let maxpg = 0;
	let end = false;
	let load = true;
	let nores = false;

	function update() {
		load = false
		setTimeout(() => {
			axios.get(`http://localhost:3000/api/genre/${genre}/${page}`).then(res => {
				maxpg = res.data.maxpage
				let news = shows
				for (let i = 0; i < res.data.shows.length; i++) {
					news.push(res.data.shows[i])
				}
				shows = news
				page++
				load = true
				if (res.data.maxpage == 0) {
					end = true
					nores = true
				}
			})
		}, 1000)
	}

	if (shows.length == 0) {
		update()
	}

	window.onscroll = () => {
		if (!end && load) {
			if (page <= maxpg) {
				if ((document.body.offsetHeight - (scroll+height))<100) {
					update()
				}
			} else {
				end = true
			}
		}
	}
</script>

<svelte:window bind:innerHeight={height} bind:scrollY={scroll} />

<main>
	<Lib shows={shows} />
	{#if end == false}
	<Load />
	{/if}
	{#if nores}
	<p class="nr">No results</p>
	{/if}
</main>

<style>
	.nr {
		text-align: center;
		font-size: 30px;
		padding: 50px;
	}
</style>