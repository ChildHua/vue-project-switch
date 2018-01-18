<template>
        <ul class='list-group' v-if="results.values != undefined">
            <h3>{{results.name}}</h3>
            <li class='list-group-item' style='height: 45px;' v-for='result in results.values'>
                <p style='float: left;display:inline-block;'>{{result.text}}</p>
                <p style='float: right;display:inline-block;'>{{result.value}}</p>
            </li>
        </ul>
        <ul v-else>
            <li class='list-group-item' style='height: 45px;' v-for='result in results'>
                <p style='float: left;display:inline-block;'>{{result.text}}</p>
                <p style='float: right;display:inline-block;'>{{result.value}}</p>
            </li>
        </ul>
</template>
<script>
    export default {
        name: 'ResultListt',
        props: {
            results: {type: Array | Object, default: {text: 'no data', value: 0}}
        }
    }
</script>