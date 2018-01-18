<template>
    <div class="tab-content">
        <h3>Storage</h3>
        <div role="tabpanel" class="tab-pane container active">
            <div class="row">
                <div class="col-md-5">
                    <BaseInput :value="input_val" @input="input_val = arguments[0]"></BaseInput>
                </div>
                <div class="col-md-3">
                    <BaseSelect :units="optionsData" :value="from_key" @change="from_key = arguments[0]"></BaseSelect>
                </div>
                <div class="col-md-1">
                    <ReversalButton @click="reversal"></ReversalButton>
                </div>
                <div class="col-md-3">
                    <BaseSelect :units="[{key:'all',text:'全部'}].concat(optionsData)" :value="to_key"
                                @change="to_key = arguments[0]"></BaseSelect>
                </div>
            </div>
            <div class="row">

                <div class="col-md-6" v-if="show.currentView == 'show-all'">
                    <h3>常见单位</h3>
                    <ResultList :results="optionsData"></ResultList>
                </div>
                <ConcreteResult v-if="show.currentView == 'show-concrete'" :detail="show.concreteData"></ConcreteResult>
                <ShowUnit content="国际单位：字节(b)"></ShowUnit>
            </div>
        </div>
    </div>
</template>

<script>
    import BaseSelect from './BaseSelect.vue'
    import BaseInput from './BaseInput.vue'
    import ReversalButton from './ReversalButton.vue'
    import ShowUnit from './ShowUnit.vue'
    import ResultList from './ResultList.vue'
    import ConcreteResult from './ConcreteResult.vue'

    let _ = require('lodash');

    let _Run;
    _Run = {
        toExponential: function (value, point, limit) {
            if (value > Math.pow(10, point)) {
                value = value.toExponential(limit)
            }
            if (value < Math.pow(10, -(point - 2))) {
                value = value.toExponential(limit)
            }
            if (value < Math.pow(10, 7) && value > Math.pow(10, -5)) {
                value = parseFloat(value.toFixed(point - 1));
            }
            return value
        }
    };
    export default {
        name: 'Storage',
        components: {
            BaseSelect, BaseInput, ReversalButton, ShowUnit, ResultList, ConcreteResult
        },
        data() {
            return {
                optionsData: [
                    {key: 'bit', text: '比特(bit)', value: 0, formula: 1},
                    {key: 'b', text: '字节(b)', value: 0, formula: 8},
                    {key: 'kb', text: '千字节(kb)', value: 0, formula: 8 * 1024},
                    {key: 'mb', text: '兆字节(mb)', value: 0, formula: 8 * 1024 * 1024},
                    {key: 'gb', text: '千兆字节(gb)', value: 0, formula: 8 * 1024 * 1024 * 1024},
                    {key: 'tb', text: '钛兆字节(tb)', value: 0, formula: 8 * 1024 * 1024 * 1024 * 1024}
                ],
                show: {
                    currentView: 'show-all',
                    concreteData: ''
                },
                input_val: 0,
                from_key: 'b',
                to_key: 'all',
            }
        },
        watch: {
            input_val() {
                this.switchTransform();
            },
            from_key() {
                this.switchTransform();
            },
            to_key() {
              this.switchTransform()
            }
        },
        methods: {
            reversal() {
                if (this.future !== 'all') {
                    let from_key = this.from_key;
                    this.from_key = this.to_key;
                    this.to_key = from_key;
                }
            },
            switchTransform() {
                let to_obj = _.find(this.optionsData, {'key': this.to_key});
                let from_obj = _.find(this.optionsData, {'key': this.from_key});
                let that = this;
                _.forIn(this.optionsData, function (value, k) {
                    value.value = parseFloat(that.input_val) * _.result(from_obj, 'formula') / parseFloat(value.formula);
                    if (value.value !== 0) {
                        value.value = _Run.toExponential(value.value, 7, 4)
                    }
                })

                if (this.to_key !== 'all') {
                    var result = this.input_val * _.result(from_obj, 'formula') / _.result(to_obj, 'formula');
                    this.show.concreteData = this.input_val + _.result(from_obj, 'text') + '=' +
                        (result > 0 ? _Run.toExponential(result, 7, 4) : 0) + ' ' + _.result(to_obj, 'text');
                    this.show.currentView = 'show-concrete'
                }else{
                    this.show.currentView = 'show-all'
                }
            }
        }
    }
</script>


