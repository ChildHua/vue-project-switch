<template>
    <div class="tab-content">
        <h3>Length</h3>
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
                <ShowUnit content="国际单位：米(m)"></ShowUnit>
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
                            {text: 'mm(毫米)', key: 'mm', value: 0, formula: 1},
                            {text: 'cm(厘米)', key: 'cm', value: 0, formula: 10},
                            {text: 'dm(分米)', key: 'dm', value: 0, formula: 100},
                            {text: 'm(米)', key: 'm', value: 0, formula: 1000},
                            {text: 'km(千米)', key: 'km', value: 0, formula: 1000000}
                        ]
                    },
                    {
                        key: 'cn',
                        name: '中国',
                        values: [
                            {text: '豪', key: 'cn_hao', value: 0, formula: 1 / 30},
                            {text: '厘', key: 'cn_li', value: 0, formula: 1 / 3},
                            {text: '分', key: 'cn_fen', value: 0, formula: 10 / 3},
                            {text: '寸', key: 'cn_cun', value: 0, formula: 100 / 3},
                            {text: '尺', key: 'cn_chi', value: 0, formula: 1000 / 3},
                            {text: '丈', key: 'cn_zhang', value: 0, formula: 10000 / 3},
                            {text: '里', key: 'cn_Li', value: 0, formula: 500000}
                        ]
                    },
                    {
                        key: 'navigation',
                        name: '航海',
                        values: [
                            {text: '海里', key: 'nautical', value: 0, formula: 1852000},
                            {text: '英寻', key: 'xun', value: 0, formula: 1828.8}
                        ]
                    },
                    {
                        key: 'astronomy',
                        name: '天文',
                        values: [
                            {key: 'pc', text: '秒差距 (pc', value: 0, formula: 3.08567758 * Math.pow(10, 19)},
                            {key: 'light_year', text: '光年', value: 0, formula: 9.4605284 * Math.pow(10, 18)},
                            {key: 'ae', text: '天文单位 (AE)', value: 0, formula: 1.49597871 * Math.pow(10, 14)},
                            {
                                key: 'light_second',
                                text: '光秒',
                                value: 0,
                                formula: 2.99792458 * Math.pow(10, 11)
                            },
                            {
                                key: 'light_minute',
                                text: '光分',
                                value: 0,
                                formula: 1.79875475 * Math.pow(10, 13)
                            }
                        ]
                    },
                    {
                        key: 'en_us',
                        name: '英／美',
                        values: [
                            {key: 'in', text: '英寸(in)', value: 0, formula: 25.4},
                            {key: 'ft', text: '英尺(ft)', value: 0, formula: 304.8},
                            {key: 'mi', text: '英里(mi)', value: 0, formula: 1609344},
                            {key: 'yd', text: '码(yd)', value: 0, formula: 914.4}
                        ]
                    }
                ],
                show: {
                    currentView: 'show-all',
                    concreteData: ''
                },
                input_val: 0,
                from_key: 'cm',
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


