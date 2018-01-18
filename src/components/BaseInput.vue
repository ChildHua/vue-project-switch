<template>
    <input
            ref="input"
            :value="value"
            @input="syncParent($event.target.value)"
            class="form-control"
            placeholder="请输入数值"
    >
</template>
<script>
    export default {
        name:'BaseInput',
        props: {
            value: {
                type: Number,
                default: 0
            }
        },
        methods: {
            syncParent: function (value) {
                var formattedValue = value
                // 删除两侧的空格符
                    .trim()
                    // 保留 2 位小数
                    .slice(
                        0,
                        value.indexOf('.') === -1
                            ? value.length
                            : value.indexOf('.') + 3
                    );
                if (formattedValue < 0) {
                    formattedValue = 0
                }
                // 如果值尚不合规，则手动覆盖为合规的值
                if (formattedValue !== value) {
                    this.$refs.input.value = formattedValue
                }
                // 通过 input 事件带出数值
                this.$emit('input', Number(formattedValue))
            }
        }
    }
</script>
<style lang="scss">
</style>