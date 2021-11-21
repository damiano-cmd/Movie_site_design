<script>
	let d = [];
	function file(e) {
		e.preventDefault()
		let a = e.dataTransfer.files[0]
		if (a.type == 'application/json') {
			let file = new FileReader()
			file.onload = () => {
				let data = file.result
				d.push(JSON.parse(atob(data.split(',')[1])))
			}
			file.readAsDataURL(a)
		} else {
			alert('not the right file type')
		}
	}
</script>

<main > 
	<div on:drop={(e) => {file(e)}} on:dragover={(e) => {e.preventDefault()}}>
		<form>
			<h2>Name</h2>
			<input type="text">
			<h2>Description</h2>
			<input type="text">
			<h2>Panel</h2>
			<input type="text">
			<h2>Poster</h2>
			<input type="text">
			<h2>Type</h2>
			<select name="" id="">
				<option value="g">g</option>
			</select>
			<h2>Links</h2>
			<textarea name="" id="" cols="30" rows="10"></textarea>
			<h2>Genres</h2>
			<section>
				<label>
					All <input type="checkbox"> <span class="radio" ></span>
				</label>
				<label>
					All <input type="checkbox"> <span class="radio" ></span>
				</label>
				<label>
					All <input type="checkbox"> <span class="radio" ></span>
				</label>
				<label>
					All <input type="checkbox"> <span class="radio" ></span>
				</label>
			</section>
			<button type="submit">Submit</button>
		</form>
	</div>
	<div>
		<form>
			<h2>Genre name</h2>
			<input type="text">
			<button type="submit">Submit</button>
		</form>
		<form>
			<h2>Delete genre</h2>
			<input type="text">
			<button id="red" >Delete</button>
		</form>
	</div>
</main>

<style>
	main {
		width: 100%;
		height: calc(100vh - 64px);
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;
		align-items: center;
		min-height: 710px;
	}
	main div {
		width: 50%;
		height: 100%;
		min-width: 350px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	#red {
		background-color: red;
	}
	main div:hover {
		background-color: rgba(240, 248, 255, 0.04);
	}
	main form {
		display: flex;
		width: 350px;
		flex-wrap: wrap;
		margin: 0px 20px;
	}
	main form section {
		position: relative;
		width: 100%;
		display: flex;
		flex-wrap: wrap;
	}
	main form section input {
		position: absolute;
		top: 0;
		left: 0;
		width: 40px;
		height: 20px;
		opacity: 0;
	}
	main form section span {
		width: 16px;
		height: 16px;
		margin: 0 4px;
		border-radius: 50%;
		background-color: white;
	}
	main form section input:checked + .radio {
		background-color: rgb(22, 76, 255);
	}
	main form section label {
		display: flex;
		flex-wrap: nowrap;
		justify-content: center;
		align-items: center;
		margin: 0px 5px;
	}
	main form input{
		width: 100%;
		border: none;
		color: black;

		padding: 4px;
		border-radius: 4px;
	}
	main form button {
		cursor: pointer;
		border: 0px;
		background-color: rgb(43, 255, 0);
		padding: 10px;
		border-radius: 8px;
		font-weight: 600;
		font-size: 20px;
		margin: 10px 0 ;
	}
	main form select {
		width: 100%;
		border: none;
		color: black;

		padding: 4px;
		border-radius: 4px;
	}
	main form h2 {
		margin: 5px 0px;
	}
	main form textarea {
		width: 100%;
		color: black;
		border: none;

		padding: 4px;
		border-radius: 4px;
	}
</style>