<template>
    <button type="button" class="btn btn-default" aria-label="Left Align" @click='syncParent'>
        <span class="glyphicon glyphicon-transfer" aria-hidden="true"></span>
    </button>
</template>
<script>
    export default {
        name:'ReversalButton',
        methods:{
            syncParent:function () {
                this.$emit('click')
            }
        }
    }
</script>