<script>
	import Poster from '../components/poster.svelte'
	import {genres, genresList} from '../stores.js'
	import {Link} from 'svelte-routing'

	let genre; 
	let listgenres;

	genres.subscribe(r => {
		genre = r
	})
	genresList.subscribe(r => {
		listgenres = r
	})

	window.scrollTo(0, 0)
</script>

<main>
	<h1>Genres</h1>
	<section class="querys">
		{#each listgenres as i}
		<Link to={"/genre/"+i}>{i}</Link>
		{/each}
	</section>
	{#each genre as i}
		<h1>{i.genre}</h1>
		<section class="flex">
			{#each i.shows as e}
				<Poster name={e.name} type={e.type} img={e.poster} relese={e.relese} duration={e.duration} season={i.season} eps={i.eps} id={i.showid} />
			{/each}
		</section>
	{/each}
</main>

<style>
	main {
		width: 96%;
		padding: 5px 2%;
		padding-bottom: 20px;
	}
	main h1 {
		padding-bottom: 10px;
		font-weight: 400;
		font-size: 38px;
	}
	
	.querys {
		text-align: center;
		display: flex;
		flex-wrap: wrap;
		flex-direction: column;
		height: 250px;
		padding: 10px 0;
		width: min-content;
		margin-bottom: 20px;
	}
	.querys :global(a) {
		background-color: rgb(27, 33, 43);
		text-decoration: none;
		width: 100px;
		height: min-content;
		border-radius: 4px;
		padding: 5px 0;
		margin: 5px 15px;
	}
	.flex {
		margin-bottom: 60px;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;
	}
	@media only screen and (max-width: 1000px) {
		main {
			width: 100%;
			padding: 5px 0;
		}
		h1 {
			text-align: center;
		}
	}
</style>