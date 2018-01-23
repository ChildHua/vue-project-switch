<template>
    <select class="form-control" :value="value" @change="syncParent($event.target.value)">
        <optgroup :label="group.name" v-for="group in units" v-if="group.values != undefined">
            <option :value="option.key" v-for="option in group.values">{{option.text}}</option>
        </optgroup>
        <option :value="group.key" v-else>{{group.text}}</option>
    </select>
</template>
<script>
    export default {
        name: 'BaseSelect',
        props: {
            units: {type: Array, default: []}, value: {type: String, default: ''}
        },
        methods:{
            syncParent(value){
                this.$emit('change',value)
            }
        }
    }
</script>