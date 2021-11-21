<script>
    import {Link} from 'svelte-routing'
    let video = '';
    export let name;
    export let poster;
    export let relese;
    export let duration;
    export let genre;
    export let description;
    export let services;
    function setService(index) {
        video = services[index].link
    }
    $: services && setService(0)
</script>

<div class="heading" >
    <div class="ii">
        <img src={poster} alt="#" class="poster0">
        <div>
            <h1>{name}</h1>
            <p> <span class="description">Relese:</span> {relese} <img src="/images/cal.svg" alt="#"> </p>
            <p> <span class="description">Duration:</span> {duration} <img src="/images/playtime.svg" alt="#"> </p>
            <p> <span class='description'>Genre:</span> 
                {#if genre != undefined}
                {#each genre as gen}
                    <Link to={"/genre/"+gen}> {gen}, </Link>
                {/each}
                {/if}
            </p>
            <p class='description'> Description: </p>
            <p>{description}</p>
        </div>
    </div>
</div>
<div class="video">
    <iframe 
        src={video} 
        frameborder="0" 
        marginwidth="0" 
        marginheight="0" 
        scrolling="no" 
        allowfullscreen
    >
    </iframe>
    <div class="links">
        <h1> <img src="/images/server.svg" alt="#"> Servers: </h1>
        {#if video != ''}
            {#each services as service}
                {#if video == service.link}
                    <button on:click={() => {setService(services.indexOf(service))}} id="bluebutton">
                        {service.name}
                    </button>
                {:else}
                    <button on:click={() => {setService(services.indexOf(service))}}>
                        {service.name}
                    </button>
                {/if}
            {/each}
        {/if}
    </div>
</div>


<style>
    .heading {
        position: relative;
        background-color: rgb(27, 33, 43);
        border-radius: 5px;
        padding: 20px;
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 25px;
    }
    .ii {
        display: flex;
        flex-wrap: nowrap;
    }
    .heading div {
        margin: 0 16px;
    }
    .heading .poster0 {
        width: 200px;
    }
    .heading h1 {
        font-size: 32px;
        margin: 8px 0;
    }
    .heading p {
        display: inline-block;
        max-width: 600px;
        display: flex;
        align-items: center;
        font-size: 18px;
        padding: 4px 0;
    }
    .heading span {
        margin-right: 6px;
    }
    .heading p :global(a) {
        margin: 0 6px;
        text-decoration: none;
    }
    .heading .description {
        color: rgb(144, 151, 175);
    }
    .heading p img {
        width: 18px;
        margin: 0 6px;
    }
    .video {
        background-color: rgb(27, 33, 43);
        margin: 25px 0;
    }
    iframe {
        width: 100%;
        height: 550px;
    }
    .links {
        padding: 5px;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
    }
    .links h1 {
        font-weight: 400;
        margin-right: 6px;
        font-size: 26px;
        display: flex;
        align-items: center;
    }
    .links h1 img {
        width: 30px;
        margin-right: 5px;
    }
    .links button{
        cursor: pointer;
        width: min-content;
        padding: 6px;
        background-color: rgb(45, 53, 68);
        border: none;
        border-radius: 5px;
        font-size: 15px;
        display: flex;
        align-items: center;
        margin: 10px;
    }
    .links #bluebutton {
        background-color: rgb(0, 110, 255) !important;
    }
    @media only screen and (max-width: 772px) {
        iframe {
            height: 250px;
        }
        .ii {
            flex-wrap: wrap;
            justify-content: center;
        }
        .heading {
            justify-content: center;
            padding: 15px 0;
            border-radius: 0;
        }
        .heading div {
            text-align: center;
        }
        .heading p {
            display: flex;
            justify-content: center;
        }
        .heading .views {
            margin: 20px 0;
            align-items: center;
        }
        .links { 
            display: flex;
            justify-content: center;
            border-radius: 0;
            text-align: center;
        }
        .links h1 {
            width: 100%;
            justify-content: center;
        }
    }
</style>