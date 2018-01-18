<template>
    <div class="tab-content">
        <h3>Volume</h3>
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
                <ShowUnit content="国际单位：立方米(m³)"></ShowUnit>
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
                            {text: '立方毫米(mm³)', key: 'mm³', value: 0, formula: 1},
                            {text: '立方厘米(cm³)', key: 'cm³', value: 0, formula: Math.pow(10,3)},
                            {text: '立方分米(dm³)', key: 'dm³', value: 0, formula: Math.pow(10,6)},
                            {text: '立方米(m³)', key: 'm³', value: 0, formula: Math.pow(10,9)},
                            {text: '微升(ul)', key: 'ul', value: 0, formula: 1},
                            {text: '公石(hl)', key: 'hl', value: 0, formula: Math.pow(10,8)},
                            {text: '厘升(cl)', key: 'cl', value: 0, formula: Math.pow(10,4)},
                            {text: '毫升(ml)', key: 'ml', value: 0, formula: Math.pow(10,3)},
                            {text: '分升(dl)', key: 'dl', value: 0, formula: Math.pow(10,6)},
                            {text: '升(l)', key: 'l', value: 0, formula: Math.pow(10,6)}
                        ]
                    },
                    {
                        key: 'en_us',
                        name: '英制',
                        values: [
                            {key: 'cu_in', text: '立方英寸(cu_in)', value: 0, formula: 1 / 0.000061},
                            {key: 'cu_ft', text: '立方英尺(cu_ft)', value: 0, formula: 1 / 3.5315 / Math.pow(10,-8)},
                            {key: 'cu_yd', text: '立方码(cu_yd)', value: 0, formula: 1 / 1.3080 / Math.pow(10,-9)},
                            {key: 'uk_gal', text: '亩英尺(uk_gal)', value: 0, formula: 1 / 8.1071 / Math.pow(10,-13)},
                            {key: 'us_gal', text: '英制加仑(us_gal)', value: 0, formula: 1 / 2.1997 / Math.pow(10,-7)},
                            {key: 'acre', text: '美制加仑(acre)', value: 0, formula: 1 / 2.6417 / Math.pow(10,-7)},
                            {key: 'uk_oz', text: '英制液体盎司(uk_oz)', value: 0, formula: 1 / 0.0000352},
                            {key: 'us_oz', text: '美制液体盎司(us_oz)', value: 0, formula: 1 / 0.0000342}
                        ]
                    }
                ],
                show: {
                    currentView: 'show-all',
                    concreteData: ''
                },
                input_val: 0,
                from_key: 'cm³',
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


