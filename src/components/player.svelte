<script>
	import {player} from '../stores.js'
	let sub_value;
	player.subscribe(value => {
		sub_value = value
	})
</script>

{#if sub_value.t == 1}
<div class="player">
	<img src="/images/FAF7tall.jpg" alt="">
	<h1>Fast and Furious 7</h1>
</div>
{/if}

<style>
	.player {
		display: grid;
		grid-template-columns: 200px 200px;
		grid-template-rows: 150px 150px;
		z-index: 4;
		position: fixed;
		right: 0;
		bottom: 0;
		width: 400px;
		height: 300px;
		min-height: 100px;
		margin: 10px;
		background-color: rgb(36, 42, 51);
		text-align: center;
	}
	.player img {
		grid-column: span 1;
		grid-row: span 2;
		height: 100%;
	}
	.player h1 {
		margin: 10px;
	}
</style>