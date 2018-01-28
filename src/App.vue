<template>
    <div id="app">
        <h1>{{ msg }}</h1>
        <div class="container-fluid">
            <ul role="tablist" class="nav nav-tabs">
                <li v-for="(list,index) in lists" :class="list.classObj" @click="active(index)">
                    <a href="#">{{list.text}}</a>
                </li>
            </ul>
            <div>
                <compoment :is="currentView"></compoment>
            </div>
            <img src="./assets/logo.png">
        </div>
    </div>
</template>

<script>
    import BaseInput from './components/BaseInput.vue'
    import Storage from './components/Storage.vue'
    import Area from './components/Area.vue'
    import Length from './components/Length.vue'
    import Volume from './components/Volume.vue'
    var _ = require('lodash');
    export default {
        components: {
            BaseInput, Storage,Length,Area,Volume
        },
        name: 'app',
        data() {
            return {
                msg: 'Welcome to Vue Switch',
                lists: [
                    {text: '存储单位', classObj: {active: false}, compo: Storage},
                    {text: '长度', classObj: {active: true},compo:Length},
                    {text: '面积', classObj: {active: false}, compo: Area},
                    {text: '体积', classObj: {active: false},compo:Volume}
                ],
                currentView: Length
            }
        },
        methods: {
            active: function (event) {
                _.forEach(this.lists, function (v, k) {
                    v.classObj.active = false;
                });
                this.lists[event].classObj.active = true;
                this.currentView = this.lists[event]['compo']
            }
        }
    }
</script>

<style lang="scss">
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }

    h1, h2 {
        font-weight: normal;
    }

    .tab-content {
        border: 1px solid #e3e3e3;
        border-top-color: white;
    }
</style>
