<template>
    <h1 style="border-bottom: 1px solid #ebebeb;" class="text-center">{{detail}}</h1>
</template>
<script>
    export default {
        name:'ConcreteResult',
        props:{
            detail:{type:String,default:''}
        }
    }
</script>