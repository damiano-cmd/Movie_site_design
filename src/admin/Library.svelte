<script>
	import Article from './components/article.svelte'
</script>

<main>
	<Article />
	<Article />
	<Article />
	<Article />
	<Article />
	<Article />
	<Article />
	<Article />
</main>

<style>
	main {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;
		padding: 30px;
	}
</style>