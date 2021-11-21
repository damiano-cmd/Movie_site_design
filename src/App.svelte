<script>
	import {globalHistory} from 'svelte-routing/src/history'
	import {Router, Route} from "svelte-routing"
	import {bilbord, tags, popular, latest, genres, genresList, comingsoon} from './stores.js'
    import { navigate } from 'svelte-routing'
	import axios from 'axios'
	import Home from "./pages/Home.svelte"
	import Genres from "./pages/Genres.svelte"
	import Mov from './pages/Movies.svelte'
	import Ser from './pages/Series.svelte'
	import Gen from './pages/Genre.svelte'
	import WatchM from './pages/WatchM.svelte'
	import WatchS from './pages/WatchS.svelte'
	import Search from './pages/Search.svelte'
	import Contact from './pages/Contact.svelte'
	import Player from './components/player.svelte'
	import Nav from './components/nav.svelte'
	import Foot from './components/footer.svelte'
	import ToS from './pages/ToS.svelte'

	let path = window.location.pathname;
	let paths = ['/', '/new', '/library', '/profile']

	globalHistory.listen(({location, action}) => {
		path = location.pathname;
	})

	axios.get('http://localhost:3000/api/main').then(res => {
		bilbord.set(res.data.top[0]);
		popular.set(res.data.pop);
		latest.set(res.data.latest);
		genresList.set(res.data.genres);
		genres.set(res.data.genre);
		comingsoon.set(res.data.cs);
		console.log(res.data.cs);
	})

	function search(e) {
		navigate('/search/'+e.detail.text)
	}
</script>

<Router>
	<Route path="/">
		<div class="sticky"><Nav on:search={search} /></div>
		<Home/>
	</Route>
	<Route path="/genre">
		<div class="sticky"><Nav on:search={search} /></div>
		<Genres/>
	</Route>
	<Route path="/genre/:genre" let:params >
		<div class="sticky"><Nav on:search={search} /></div>
		<Gen genre={params.genre} />
	</Route>
	<Route path="/movies" >
		<div class="sticky"><Nav on:search={search} /></div>
		<Mov />
	</Route>
	<Route path="/series" >
		<div class="sticky"><Nav on:search={search} /></div>
		<Ser />
	</Route>
	<Route path="/search/:param" let:params >
		<Search param={params.param} />
	</Route>
	<Route path="/contact" >
		<Contact />
	</Route>
	<Route path="/tos" >
		<div class="sticky"><Nav on:search={search} /></div>
		<ToS />
	</Route>
	<Route path="/movie/:name" let:params>
		<Nav on:search={search} />
		<WatchM name={params.name} />
	</Route>
	<Route path="/series/:name" let:params>
		<Nav on:search={search} />
		<WatchS name={params.name} />
	</Route>
	<Route>Page not fount</Route>
	{#if paths.includes(path)}
	<Player />
	{/if}
	<Foot/>
</Router>

<style>
	.sticky {
		z-index: 9;
		position: sticky;
		top: 0;
	}
</style>