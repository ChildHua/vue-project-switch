<template>
    <div class="row">
        <div class="col-md-12" style="margin-top: 10px;color: #999;">
            <p class="text-right">{{content}}</p>
        </div>
    </div>
</template>
<script>
    export default {
        name:'ShowUnit',
        props:{
            content:{type:String,default:''}
        }
    }
</script>