<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input
            placeholder="请输入要查询的订单信息"
            v-model="queryInfo.query"
          >
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <el-table :data="orderList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column
          label="订单价格"
          prop="order_price"
          width="120px"
        ></el-table-column>
        <el-table-column label="是否付款" prop="pay_status" width="90px">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'"
              >已付款</el-tag
            >
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="是否发货"
          prop="is_send"
          width="90px"
        ></el-table-column>
        <el-table-column label="下单时间" prop="create_time" width="200px">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150px">
          <!-- 修改地址和查询物流信息功能暂时写死，未提供API接口 -->
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="showEditAddressDialog"
          ></el-button>
          <el-button
            type="success"
            icon="el-icon-location"
            size="mini"
            @click="showDeliveryDialog"
          ></el-button>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 修改地址的对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="editAddressDialogVisible"
      @close="editAddressDialogClose"
    >
      <el-form
        :model="editAddressForm"
        :rules="editAddressFormRules"
        ref="editAddressFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="provinceCityCounty">
          <el-cascader
            v-model="editAddressForm.provinceCityCounty"
            :options="area"
            :props="{ expandTrigger: 'hover' }"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="fullAddress">
          <el-input v-model="editAddressForm.fullAddress"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editAddressDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editAddressDialogVisible = false"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <!-- 展示物流信息的对话框 -->
    <el-dialog
      title="物流信息"
      :visible.sync="deliveryDialogVisible"
      width="50%"
    >
      <span>
        <el-timeline>
          <el-timeline-item
            v-for="(item, index) in delivery"
            :key="index"
            :timestamp="item.time"
          >
            {{ item.context }}
          </el-timeline-item>
        </el-timeline>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import area from './area'

export default {
  data() {
    return {
      queryInfo: {
        query: '',
        pagesize: 5,
        pagenum: 1,
      },
      total: 0,
      orderList: [],
      editAddressDialogVisible: false,
      editAddressForm: {
        provinceCityCounty: [],
        fullAddress: '',
      },
      editAddressFormRules: {
        provinceCityCounty: [
          { required: true, message: '此项为必填项', trigger: 'blur' },
        ],
        fullAddress: [
          { required: true, message: '此项为必填项', trigger: 'blur' },
        ],
      },
      area,
      deliveryDialogVisible: false,
      delivery: [],
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    // 获取订单列表 [API 1.10.1]
    async getOrderList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // console.log(res.data)
      this.total = res.data.total
      this.orderList = res.data.goods
      console.log(this.orderList)
    },

    // 页码条 pagesize 改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },

    // 页码条 pagenum 改变的事件
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum
      this.getOrderList()
    },

    // 展示修改地址的对话框
    showEditAddressDialog() {
      this.editAddressDialogVisible = true
    },

    // cascader 选中项改变
    handleChange() {},

    // 修改地址的对话框关闭，重置表单
    editAddressDialogClose() {
      this.$refs.editAddressFormRef.resetFields()
    },

    // 展示物流信息对话框
    async showDeliveryDialog() {
      const { data: res } = await this.$http.get('/kuaidi/1106975712662')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.delivery = res.data
      console.log(this.delivery)
      this.deliveryDialogVisible = true
    },
  },
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>
