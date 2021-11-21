<script>
	import Lib from '../components/lib.svelte'
	import Load from '../components/load.svelte'
	import axios from 'axios'
	import Nav from '../components/nav.svelte'
	import Search from '../components/search.svelte'

	export let param;

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
		if (param == '-*hfh*-') {
			end = true;
		} else {
			axios.get(`http://localhost:3000/api/search/${param}/${page}`).then(res => {
				maxpg = res.data.maxpage;
				let news = shows;
				for (let i = 0; i < res.data.shows.length; i++) {
					news.push(res.data.shows[i]);
				}
				shows = news;
				page++;
				load = true;
				if (res.data.maxpage == 0) {
					end = true;
					nores = true;
				}
				if (page >= maxpg) {
					end = true;
				}
			})
		}
	}

	if (shows.length == 0) {
		update()
	}

	window.onscroll = () => {
		if (!end && load) {
			if (page < maxpg) {
				if ((document.body.offsetHeight - (scroll+height))<100) {
					update()
				}
			} else {
				end = true
			}
		}
	}

	function search(e) {
		param = e.detail.text
		shows = []
		scroll;
		height;
		page = 0;
		maxpg = 0;
		end = false;
		nores = false;
		load = true;
		update()
		navigate('/search/'+e.detail.text)
	}
</script>

<svelte:window bind:scrollY={scroll} />


<div class="sticky"><Nav on:search={search} /></div>

<main bind:clientHeight={height} >
	<Search on:search={search} clas="search" />
	<Lib shows={shows} />
	{#if end == false}
	<Load />
	{/if}
	{#if nores}
	<p class="nr">No results</p>
	{/if}
</main>

<style>
	:global(.search) {
		display: none;
	}
	.sticky {
		display: sticky;
		top: 0;
	}
	.nr {
		text-align: center;
		font-size: 30px;
		padding: 50px;
	}
	@media only screen and (max-width: 1100px) {
		:global(.search) {
			display: block;
		}
		main {
			padding-top: 54px;
			min-height: 100vh;
		}
	}
</style>