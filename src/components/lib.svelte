<script>
	import Poster from '../components/poster.svelte'
	export let shows;
</script>

<div>
	{#each shows as i}
	<Poster name={i.name} img={i.poster} type={i.type} relese={i.relese} duration={i.duration} season={i.season} eps={i.eps} id={i.showid} />
	{/each}
</div>

<style>
	div {
		max-width: 96%;
		padding: 25px 2%;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;
	}
	@media only screen and (max-width: 1000px) {
		div {
			max-width: 100%;
			padding: 25px 0;
		}
	}
</style>