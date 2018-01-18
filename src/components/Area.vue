<template>
    <div class="tab-content">
        <h3>Area</h3>
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
                <div v-if="show.currentView == 'show-all'">
                    <div class="col-md-6">
                        <ResultList :results="result"
                                    v-if="['metric','navigation','astronomy'].indexOf(result.key) >= 0"
                                    v-for="result in optionsData"
                        ></ResultList>
                    </div>
                    <div class="col-md-6">
                        <ResultList :results="result"
                                    v-if="['cn','en_us'].indexOf(result.key) >= 0"
                                    v-for="result in optionsData"
                        ></ResultList>
                    </div>
                </div>

                <ConcreteResult v-if="show.currentView == 'show-concrete'" :detail="show.concreteData"></ConcreteResult>
                <ShowUnit content="国际单位：平方米(㎡)"></ShowUnit>
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
        name: 'Length',
        components: {
            BaseSelect, BaseInput, ReversalButton, ShowUnit, ResultList, ConcreteResult
        },
        data() {
            return {
                optionsData: [
                    {
                        key: 'metric',
                        name: '公制',
                        values: [
                            {text: '平方毫米(m㎡)', key: 'mm', value: 0, formula: 1},
                            {text: '平方厘米(c㎡)', key: 'cm', value: 0, formula: Math.pow(10,2)},
                            {text: '平方分米(d㎡)', key: 'dm', value: 0, formula: Math.pow(10,4)},
                            {text: '平方米(㎡)', key: 'm', value: 0, formula: Math.pow(10,6)},
                            {text: '平方千米(k㎡)', key: 'km', value: 0, formula: Math.pow(10,12)}
                        ]
                    },
                    {
                        key: 'cn',
                        name: '市制',
                        values: [
                            {text: '平方寸', key: 'cn_cun', value: 0, formula: 1 / 0.0009},
                            {text: '平方尺', key: 'cn_chi', value: 0, formula: 1 / 9 / Math.pow(10,-6)},
                            {text: '分', key: 'cn_fen', value: 0, formula: 1 / 1.5 / Math.pow(10,-8)},
                            {text: '亩', key: 'cn_mu', value: 0, formula: 1 / 1.5 / Math.pow(10,-9)},
                            {text: '顷', key: 'cn_qing', value: 0, formula: 1 / 1.5 / Math.pow(10,-11)}
                        ]
                    },
                    {
                        key: 'en_us',
                        name: '英／美',
                        values: [
                            {key: 'in', text: '平方英寸(in)', value: 0, formula: 1 / 0.00155},
                            {key: 'ft', text: '平方英尺(ft)', value: 0, formula: 1 / 0.0000108},
                            {key: 'yd', text: '平方码(yd)', value: 0, formula: 1 / 1.196 / Math.pow(10,-6)},
                            {key: 'mi', text: '平方英里(mi)', value: 0, formula: 1 / 3.861 / Math.pow(10,-13)},
                            {key: 'mi', text: '英亩(acre)', value: 0, formula: 1 / 2.4711 / Math.pow(10,-10)},
                        ]
                    }
                ],
                show: {
                    currentView: 'show-all',
                    concreteData: ''
                },
                input_val: 0,
                from_key: 'c㎡',
                to_key: 'all',
                result: {
                    left: [],
                    right: []
                }
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
                console.log(1)
                if (this.future !== 'all') {
                    let from_key = this.from_key;
                    this.from_key = this.to_key;
                    this.to_key = from_key;
                }
            },
            switchTransform() {
                let to_obj = Object;
                let from_obj = Object;
                let that = this;
                _.forEach(this.optionsData, function (value, key) {
                    if (_.find(value.values, {'key': that.to_key})) {
                        to_obj = _.find(value.values, {'key': that.to_key});
                    }
                    if (_.find(value.values, {'key': that.from_key})){
                        from_obj = _.find(value.values, {'key': that.from_key});
                    }
                });

                _.forIn(this.optionsData, function (groups, k) {
                    _.forIn(groups.values, function (group, gk) {
                        group.value = parseFloat(that.input_val) * _.result(from_obj, 'formula') / parseFloat(group.formula);
                        if (group.value !== 0) {
                            group.value = _Run.toExponential(group.value, 7, 4)
                        }
                    });

                });
                if (this.to_key !== 'all') {
                    var result = this.input_val * _.result(from_obj, 'formula') / _.result(to_obj, 'formula');
                    this.show.concreteData = this.input_val + _.result(from_obj, 'text') + '=' +
                        (result > 0 ? _Run.toExponential(result, 7, 4) : 0) + ' ' + _.result(to_obj, 'text');
                    this.show.currentView = 'show-concrete'
                } else {
                    this.show.currentView = 'show-all'
                }
            }
        }
    }
</script>


