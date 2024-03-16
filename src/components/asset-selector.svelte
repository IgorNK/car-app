<script lang="ts">
    export let values: Array<string>;
    export let handleSelect: (value: string) => void;
    let selected: string;
</script>

<select class="AssetSelector" bind:value={selected} on:change={() => handleSelect(selected)}>
    {#each values as value}
        <option class="AssetSelector" value={value}>
            {value}
        </option>
    {/each}
</select>

<style>
    .AssetSelector {
        display: flex;
        flex-direction: column;
        margin: 5px;
    }

</style>