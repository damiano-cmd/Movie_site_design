<script>
    import {Link} from 'svelte-routing'
    import { bilbord } from '../stores.js'
    let top;
    bilbord.subscribe(r => {
        top = r
    })
</script>

<div class="bilbord">
    <img src={top.panel} alt="#" id="br">
    <Link to={`/${top.type}/${top.showid}`} class="a">
        <div class="backgrade" ></div>
        <div class="info" >
            <h1>{top.name}</h1>
            <p>Duration: {top.duration} <img src="/images/playtime.svg" alt="#"> Relese: {top.relese} <img src="/images/cal.svg" alt="#"></p>
            <p>Genre: 
                {#if top.genres != undefined}
                    {#each top.genres as genre}
                        <Link to={'/genre/'+genre} > {genre}, </Link>
                    {/each}
                {/if}
            </p>
            <p id="description" >{top.description}</p>
        </div>
    </Link>
</div>

<style>
    .bilbord {
        position: relative;
        width: 100%;
        max-height: calc(90vh - 64px);
        overflow: hidden;
    }
    .bilbord :global(.a) {
        position: absolute;
        top: 0;
        overflow: hidden;
        width: 100%;
        height: 100%;
        border: none;
        display: flex;
        justify-content: center;
    }
    .bilbord #br {
        width: 100%;
        min-width: 500px;
    }
    .bilbord :global(.a .info) {
        position: absolute;
        bottom: 20px;
        left: 30px;
        z-index: 1;
    }
    .bilbord :global(.a .info h1) {
        font-size: 50px;
        margin: 8px 0;
    }
    .bilbord :global(.a .info p) {
        display: flex;
        align-items: center;
        font-size: 18px;
        margin-bottom: 10px;
    }
    .bilbord :global(.a .info #description) {
        color: rgb(150, 150, 150);
    }
    .bilbord :global(.a .info p a) {
        margin-left: 8px;
        text-decoration: none;
    }
    .bilbord :global(.a .info p img) {
        max-width: 20px;
        margin: 0 6px;
        margin-right: 30px;
    }
    .bilbord :global(.a .backgrade) {
        position: absolute;
        top: 0;
        width: 100%;
        height: calc(100%);
        background: radial-gradient(circle, rgba(0,0,0,0) 0%, rgba(10, 12, 16, 0.9) 80%);
    }
    .bilbord :global(.a .backgrade::before) {
        content: '';
        position: absolute;
        top: 0;
        width: 100%;
        height: 100% ;
        background: linear-gradient(0deg, hsla(218, 23%, 5%) 1%, rgba(0, 0, 0, 0) 80%);
    }
    @media only screen and (max-width: 1190px) {
        .bilbord :global(.a .info) {
            bottom: 30px;
            left: 2px;
        }
        .bilbord :global(.a .info p) {
            font-size: 15px;
            margin-bottom: 5px;
        }
        .bilbord :global(.a .info h1) {
            font-size: 30px;
            margin: 4px 0;
        }
    }
    @media only screen and (max-width: 680px) {
        .bilbord :global(.a .info) {
            bottom: 0px;
        }
        .bilbord :global(.a .info #description) {
            display: none;
        }
    }
</style>