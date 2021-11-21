<script>
	window.scrollTo(0, 0)
</script>

<main>
	<form>
		<h1>Your email:</h1>
		<input type="text" placeholder="youremail@email.com">
		<h1>About:</h1>
		<input type="text">
		<h1>Details:</h1>
		<textarea name="" id="" cols="30" rows="10"></textarea>
		<button type="submit">Submit</button>
	</form>
</main>

<style>
	main {
		width: 100%;
		height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	form {
		display: flex;
		flex-direction: column;
		width: 450px;
	}
	button {
		cursor: pointer;
		width: min-content;
		border: none;
		border-radius: 4px;
		margin: 12px 0;
		background-color: rgb(0, 110, 255);
		font-size: 18px;
		padding: 6px 12px;
		font-weight: 400;
	}
	h1 {
		margin-top: 20px;
		margin-bottom: 6px;
		font-size: 30px;
		font-weight: 300;
	}
	textarea, input {
		border: none;
		color: black;
		padding: 4px 8px;
		border-radius: 4px;
		font-size: 17px;
	}
	input {
		height: 26px;
	}
</style>