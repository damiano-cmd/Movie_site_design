<script></script>

<div class="load"></div>

<style>
	.load {
		position: relative;
		left: calc(50% - 100px);
		width: 100px;
		height: 100px;
		margin: 30px;
		border: 8px solid rgb(35, 39, 51);
		border-radius: 50%;
		border-top-color: rgb(0, 110, 255);
		animation-name: rotor;
		animation-duration: 1s;
		animation-iteration-count: infinite;
	}
	@keyframes rotor {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
</style>