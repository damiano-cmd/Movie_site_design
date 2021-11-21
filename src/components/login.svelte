<script>
	import {createEventDispatcher} from 'svelte'
	export let lr = false;
	let dispach = createEventDispatcher();
	function dis() {
		dispach("show", 0)
	}
</script>

<div class="ovrl" on:click={() => {dis()}}></div>
<div class="lr">
	{#if lr}
		<h1>Login</h1>
		<form>
			<label>Email:</label>
			<input type="text">
			<br><br>
			<label>Password:</label>
			<input type="text">
			<br><br>
			<button type="submit">Login</button>
		</form>
	{:else}
		<h1>Register</h1>
		<form>
			<label>Email:</label>
			<input type="text">
			<br><br>
			<label>User Name:</label>
			<input type="text">
			<br><br>
			<label>Password:</label>
			<input type="text">
			<br><br>
			<label>Confirm password:</label>
			<input type="text">
			<br><br>
			<button type="submit">Register</button>
		</form>
	{/if}
</div>

<style>
	.ovrl {
		position: fixed;
		top: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.9);
		z-index: 10;
	}
	.lr {
		z-index: 11;
		position: fixed;
		top: clamp(316px, 50%, 2000px);
		left: 50%;
		transform: translateX(-50%) translateY(-50%);
		width: 400px;
		min-height: 200px;
		padding: 40px 0;
		border-radius: 20px;
		background-color: rgb(40, 46, 54);
		display: grid;
		justify-content: center;
		align-items: center;
	}
	.lr h1 {
		margin: 15px 0;
		font-size: 28px;
	}
	.lr form input {
		border: 0;
		background-color: rgb(32, 32, 32);
		width: 250px;
		height: 30px;
		padding: 3px 15px;
		border-radius: 5px;
	}
	.lr form label {
		display: block;
		padding: 7px 0;
	}
	.lr form button {
		border: 0;
		background-color: rgb(0,110,255);
		font-size: 18px;
		padding: 10px 20px;
		border-radius: 10px;
	} 
</style>