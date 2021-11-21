<script>
    import {Link} from 'svelte-routing';
    import {globalHistory} from 'svelte-routing/src/history'
	import {createEventDispatcher} from 'svelte'
    import Login from './login.svelte';
    import {logedin} from '../stores.js';
	import Search from './search.svelte'

    let login
    let showProf = false;
    let showLR = false;
    let lr = false;

    logedin.subscribe(value => {
	login = value
    })

    globalHistory.listen(() => {
	profile(false)
    })

    function profile(n = 'k') {
	if (n == 'k') {
		showProf = !showProf
	} else {
		showProf = n
	}
    }
    function LoRe(n = 'k', l = false) {
	if (n == 'k') {
		showLR = !showLR
	} else {
		showLR = n
	}
	lr = l
    }

	let dispach = createEventDispatcher()
	const onSearch = e => {
		e.preventDefault()
		dispach("search", {
			text: e.detail.text
		})
	}
</script>

<nav>
	<div class="flex">
		<Link to="/" class="logo"><img src="/images/logoTr.png" alt="#"></Link>
		<Search on:search={onSearch} />
		<ul class="links">
			<li><Link to="/">Home</Link></li>
			<li><Link to="/genre">Genre</Link></li>
			<li><Link to="/movies">Movies</Link></li>
			<li><Link to="/series">TV Series</Link></li>
		</ul>
	</div>
	<ul class="nav">
        <li><Link to="/"><img src="/images/house.svg" alt="#"></Link></li>
        <li><Link to="/genre"><img src="/images/new.svg" alt="#"></Link></li>
        <li><Link to="/search/-*hfh*-"><img src="/images/gals.svg" alt="#"></Link></li>
        <li><Link to="/library"><img src="/images/library.svg" alt="#"></Link></li>
        <li><button on:click={() => {profile()}} to="/prof"><img src="/images/prof.svg" alt="#"></button></li>
	</ul>
	{#if login == true}
		<Link id="nobutton" to="/profile"><img src="/images/prof.svg" alt="#" class="prof"/></Link>
	{:else}
		<div class="buttons">
			<button on:click={() => {LoRe(true, true)}}>Sign in</button>
			<button class="bluebutton" on:click={() => {LoRe(true, false)}}>Sign up</button>
		</div>
	{/if}
</nav>
{#if showLR}
<Login lr={lr} on:show={() => {LoRe(false)}} />
{/if}


<style>
	.flex {
		display: flex;
		align-items: center;
	}
    nav {
		z-index: 9;
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 90%;
		height: 58px;
		padding: 0 5% 0 5%;
		background-color: rgb(27, 33, 43);
	}
	nav :global(.logo) {
		text-decoration: none;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	nav :global(.logo img)  {
		width: 46px;
	}
	nav .links {
		display: flex;
		list-style: none;
	}
	nav .links li :global(a) {
		text-decoration: none;
		font-size: 18px;
		padding: 14px 18px;
		border-bottom: 3px solid transparent;
	}
	nav .links li > :global(a:hover) {
		border-bottom-color: white;
	}
	nav button{
		border: none;
		font-size: 15px;
		background: none;
		cursor: pointer;
	}
	nav .buttons button {
		border-radius: 6px;
		padding: 12px 18px;
	}
	nav .bluebutton {
		background-color: rgb(0, 110, 255);
	}
	nav .prof {
		width: 45px;
		padding: 4px;
		border-radius: 50%;
		background: linear-gradient(318deg, rgba(0,87,201,1) 10%, rgba(0,110,255,1) 90%);
	}
	
	nav .nav {
		display: none;
		width: 100%;
		align-items: center;
		justify-content: space-around;
		border-bottom: 0px;
		list-style: none;
	}
	nav .nav li :global(a), nav .nav li :global(button) {
		display: block;
		width: 28px;
		height: 30px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	nav .nav li :global(a img), nav .nav li :global(button img) {
		min-width: 30px;
	}
	@media only screen and (max-width: 1245px) {
		nav {
			padding: 0;
			width: 100%;
			justify-content: space-around;
		}
		nav :global(.logo) {
			display: none;
		}
	}
	@media only screen and (max-width: 1100px) {
		.flex {
			display: none;
		}
		nav {
			position: fixed;
			bottom: 0px;
			height: 60px;
		}
		nav .links, nav .buttons {
			display: none;
		}
		nav .nav {
			display: flex;
		}
	}
</style>