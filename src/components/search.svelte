<script>
    import {createEventDispatcher} from 'svelte'
    export let clas;
    let dispatch = createEventDispatcher()
    let searchQuery;
    const search = e => {
        e.preventDefault()
        dispatch("search", {
            text: searchQuery
        })
    }
</script>

<div class={clas}>
    <form on:submit={search}>
        <input type="text" placeholder="Search for any show or movie" bind:value={searchQuery}>
        <button type="submit">
            <img src="/images/gals.svg" alt="#">
        </button>
    </form>
</div>

<style>
    form {
        position: relative;
        width: 500px;
        display: flex;
        align-items: center;
        height: 44px;
        margin: 0 30px;
    }
    input {
        height: 40px;
        width: 100%;
        padding: 2px;
        padding-left: 10px;
        border: none;
        font-size: 16px;
        border-radius: 5px 0 0 5px;
		background-color: rgb(45, 54, 70);
        outline: none;
    }
    input:focus {
        padding: 1px;
        padding-left: 9px;
        border: 1px solid rgb(0, 110, 255);
    }
    button {
        height: 100%;
        cursor: pointer;
        display: flex;
        align-items: center;
        border: none;
		background-color: rgb(0, 110, 255);
        border-radius: 0 5px 5px 0;
        padding: 0 10px;
    }
    img {
        width: 34px;
    }
    @media only screen and (max-width: 1100px) {
        div {
            width: 100%;
            height: max-content;
            position: fixed;
            top: 0;
            z-index: 10;
        }
        form {
		    background-color: rgb(45, 53, 68);
            width: 98%;
            padding: 4px 1%;
            height: 46px;
            margin: 0;
        }
        input {
            height: 42px;
            border-radius: 4px 0 0 4px;
        }
        button {
            border-radius: 0 4px 4px 0;
        }
    }
</style>