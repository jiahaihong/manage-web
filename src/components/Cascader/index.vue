<!--
 * @Author: your name
 * @Date: 2022-02-08 14:01:11
 * @LastEditTime: 2022-02-08 17:37:47
 * @LastEditors: Please set LastEditors
 * @Description: 改装后的级联选择器，父关联子，子不关联父
-->

<template>
  <el-cascader
    ref="GlCascader"
    v-model="vop"
    v-bind="$attrs"
    style="width:100%"
    @change="handleChange"
  />
</template>
<script>
export default {
  name: 'GlCascader',
  props: {
    /** v-model绑定得值 */
    value: {
      type: Array
    }
  },
  data() {
    return {
      // 选中的值
      vop: [],
      // 临时存放的当前选中值
      tmpVop: [],
      // 选中的节点
      addVop: '',
      // 需选中的节点集合
      addArr: [],
      // 取消选中的节点
      reduceVop: '',
      // 需取消选中的节点集合
      reduceArr: []
    }
  },
  computed: {
    options() {
      return this.$attrs.options
    }
  },
  watch: {
    value: {
      handler(val) {
        this.vop = val
        this.tmpVop = JSON.parse(JSON.stringify(val))
      },
      immediate: true
    }
  },
  methods: {
    // change事件
    handleChange() {
      if (this.vop.length > 0) {
        if (this.vop.length > this.tmpVop.length) {
          // 新增
          const id = this.getCheckNode(this.vop, this.tmpVop)
          const children = this.getCurrentIdChildren(this.options, id)
          console.log('新增', id, children);
          const lastNode = children.filter(t => !this.vop.includes(t))
          this.vop = [...this.vop, ...lastNode]
        } else if (this.vop.length < this.tmpVop.length) {
          // 减少
          const id = this.getCheckNode(this.tmpVop, this.vop)
          const children = this.getCurrentIdChildren(this.options, id)
          this.vop = this.vop.filter(t => !children.includes(t))
          // console.log('少得', id, children, this.vop);
        }
      }
      this.$nextTick(() => {
        this.tmpVop = JSON.parse(JSON.stringify(this.vop))
      })
      // console.log(this.vop);
      this.$emit('input', this.vop)
    },
    /**
     * @description: 获取点击的节点
     * @param {*} long
     * @param {*} short
     * @return {*}
     */
    getCheckNode(long, short) {
      return long.filter(t => !short.includes(t))[0]
    },
    getCurrentIdChildren(all, id) {
      let arr = []
      const getOptions = (options) => {
        for (const i in options) {
          if (options[i].id === id) {
            arr = options[i].children
            console.log('getCurrentIdChildren', arr);
            break
          } else {
            if (options[i].children) {
              getOptions(options[i].children, id);
            }
          }
        }
      }
      getOptions(all)
      return this.traverseChildren(arr, [])
    },
    traverseChildren(datas, arr) {
      for (const i in datas) {
        arr.push(datas[i].id)
        if (datas[i].children) {
          this.traverseChildren(datas[i].children, arr)
        }
      }
      return arr
    },
  }
}
</script>
