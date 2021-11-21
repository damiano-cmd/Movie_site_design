<script>
    import axios from "axios"
    import Watch from '../components/watch.svelte'
    export let name;
    let show = {};
    axios.get("http://localhost:3000/api/watch/"+name).then(res => {
        show = res.data
    })
</script>

<main>
    {#if show.length != 0}
    <Watch 
        name={show.name}
        relese={show.relese}
        duration={show.duration}
        genre={show.genres} 
        poster={show.poster}
        description={show.description}
        services={show.links}
    />
    {/if}
</main>

<style>
    main {
        width: 90%;
        padding: 25px 5%;
        padding-bottom: 40px;
    }
    @media only screen and (max-width: 772px) {
        main { 
            width: 100%;
            padding: 0;
        }
    }
</style>