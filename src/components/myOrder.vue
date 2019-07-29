<template>
  <div style="text-align:center">
    <header class="header">
      <dl>
        <dd class="back per_icon">
          <router-link :to="'/personcenter'">
            <i class="left_arrow"></i>
          </router-link>
        </dd>
        <dt>我的订单</dt>
        <dd class="logOut">
          <router-link :to="'/'">
            <a href>首页</a>
          </router-link>
        </dd>
      </dl>
    </header>
    <!-- 搜索区域 -->
    <div class="rili">
      <div class="block" style>
        <el-date-picker
          v-model="value1"
          type="date"
          placeholder="开始时间"
          value-format="timestamp"
          size="small"
          style="width:80%;"
          :editable="false"
        ></el-date-picker>
      </div>
      <span style="margin-top:0.05rem">至</span>
      <div class="block">
        <el-date-picker
          v-model="value2"
          type="date"
          placeholder="结束时间"
          value-format="timestamp"
          size="small"
          style="width:80%"
          :editable="false"
          :picker-options="pickerOptions"
        ></el-date-picker>
      </div>
    </div>
    <div style="margin:0.05rem 0;text-align:left">
      <span style="margin-left:0.15rem">支付状态：</span>
      <el-select
        placeholder="请选择"
        v-model="tableList.keyword.is_pay"
        style="width:1rem;margin-right:0.52rem"
        size="small"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-button class="btn" size="small" @click="search">搜索</el-button>
    </div>
    <!-- 列表区域 -->
    <ul id="liststyle">
      <li id="box" v-for="(item,k) in tableData" :key="k" @click="orderlook(item.id)">
        <div class="left">{{k+1}}</div>
        <ul class="left" style="margin-right:0.2rem">
          <li style="font-size:0.12rem;width:1.7rem;height:0.18rem;overflow:hidden">{{item.machine_name}}</li>
          <li style="font-size:0.12rem;width:1.7rem;height:0.18rem;overflow:hidden">{{item.machine_address}}</li>
          <li>{{item.start_time*1000|formatDate}}至{{item.end_time*1000|formatDate}}</li>
        </ul>
        <ul class="left">
          <li>订单金额:{{item.order_amount}}元</li>
          <li style="margin:0.2rem 0 0 0.4rem">
            <el-button
              style="width:0.55rem;"
              class="btn"
              size="mini"
              @click.stop="payDialog(item.id)"
              v-if="item.is_pay==0"
            >支付</el-button>
            <span v-if="item.is_pay==1" class="ispay">已支付</span>
          </li>
        </ul>
        <div class="right el-icon-arrow-right btnr"></div>
      </li>
    </ul>
    <!-- 数据分页展示 -->
    <el-pagination
      @current-change="handleCurrentChange"
      background
      layout="prev, pager, next"
      :total="this.tot"
      :current-page="tableList.page"
      :page-size="10"
      :pager-count="7"
      small
    ></el-pagination>
    <!-- 点击支付弹窗 -->
    <el-dialog :visible.sync="dialogTableVisible1" width="100%" :modal="false">
      <div id="pay">
        <div>订单金额：¥ {{order_amount}}</div>
        <div>实付金额：¥ {{order_amount}}</div>
        <el-button type="primary" @click="zhifuPay">支付宝支付</el-button>
        <el-button type="success" style="margin-left:50px;" @click="weixin">微信支付</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogTableVisible5" width="100%" :modal="false" title="提示" center>
      <span style="margin-left:50px">您好，您选择的设备时间被占用，请重新选择设备或者更改投放时间</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogTableVisible5 = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 支付宝二维码弹窗 -->
    <el-dialog :visible.sync="dialogTableVisible2" width="100%" :modal="false">
      <div id="pay" v-show="text1">
        <h2>请扫码支付</h2>
        <vue-qr :text="config.value" :size="100" :dotScale="1"></vue-qr>
      </div>
      <h2 v-show="text2">支付成功！</h2>
    </el-dialog>
    <!-- 微信支付弹窗 -->
    <el-dialog :visible.sync="dialogTableVisible3" width="100%" :modal="false">
      <div id="pay" v-show="text1">
        <h2>请扫码支付</h2>
        <vue-qr :text="config.value1" :size="100" :dotScale="1"></vue-qr>
      </div>
      <h2 v-show="text2">支付成功！</h2>
    </el-dialog>
  </div>
</template>

<script>
import VueQr from "vue-qr";
import { formatDate } from "@/assets/js/date.js"; // 在组件中引用date.js
export default {
  components: { VueQr },
  mounted() {
    this.getOrderList();
  },
  // 时间戳过滤器
  filters: {
    formatDate(time) {
      var date = new Date(time);
      return formatDate(date, "yyyy/MM/dd"); // 年月日 格式自己定义   'yyyy : MM : dd'  例 2018年12月5日的格式
    }
  },
  data() {
    return {
      showbtn: false, // 支付按钮
      showtext: false, // 支付状态
      config: {
        value: "", //显示的值、跳转的地址
        value1: ""
      },
      // 支付成功弹框内容
      text1: false,
      text2: false,
      // 限制投放结束日期
      pickerOptions: {
        disabledDate: time => {
          return time.getTime() < this.value1;
        }
      },
      // 弹框显示隐藏
      dialogTableVisible1: false,
      dialogTableVisible2: false,
      dialogTableVisible3: false,
      dialogTableVisible5: false,
      // 数据总条数
      tot: 10,
      // 选择日期
      value1: null,
      value2: null,
      // 审核状态下拉框数据
      options: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "1",
          label: "已支付"
        },
        {
          value: "0",
          label: "未支付"
        }
      ],
      // 获取订单列表所需参数
      tableList: {
        token: window.sessionStorage.getItem("token"),
        page: 1,
        keyword: {
          start_time: "",
          end_time: "",
          is_pay: ""
        }
      },
      // 接收列表数据
      tableData: [],
      order_amount: "" // 支付金额
    };
  },
  methods: {
    // 点击查看弹框
    orderlook(uid) {
      const data = {
        token: this.tableList.token,
        check_id: uid
      };
      this.$http.post("/order_detail", JSON.stringify(data)).then(res => {
        this.$router.push({
          name: "orderitem",
          params: {
            message: res.data
          }
        });
      });
    },
    // 按需搜所
    search() {
      if (this.value1 != null && this.value2 == null) {
        this.$message.warning("请选择投放结束日期");
        return false;
      } else if (this.value1 === null && this.value2 !== null) {
        this.$message.warning("请选择投放开始日期");
        return false;
      }
      this.tableList.keyword.start_time = this.value1 / 1000;
      this.tableList.keyword.end_time = this.value2 / 1000;
      if (this.value1 != null) {
        this.tableList.keyword.end_time = this.value2 / 1000 + 86399;
      }
      this.getOrderList();
    },
    // 当前页码变化的回调处理
    handleCurrentChange(arg) {
      this.tableList.page = arg;
      // 根据变化后的页码重新获得数据
      this.getOrderList();
    },
    // 获取订单表格数据
    getOrderList() {
      this.$http
        .post("/order_list", JSON.stringify(this.tableList))
        .then(res => {
          this.tableData = res.data.data;
          this.tot = res.data.count;
        });
    },
    // 支付
    payDialog(uid) {
      this.payId = uid;
      const data = {
        token: window.sessionStorage.getItem("token"),
        check_id: ""
      };
      data.check_id = uid;
      this.$http.post("/pay", JSON.stringify(data)).then(res => {
        if (res.data.error.length === 0) {
          this.order_amount = res.data.amount;
          this.dialogTableVisible1 = true;
        } else {
          this.dialogTableVisible5 = true;
        }
      });
    },
    // 询问是否支付成功
    payOk() {
      let that = this;
      that.$http.post("/order_status", that.ispay).then(res => {
        if (res.data.status === 1) {
          that.$message.success("支付成功！");
          that.getOrderList();
          that.text1 = false;
          that.text2 = true;
        } else {
          setTimeout(() => {
            that.payOk();
          }, 1000);
        }
      });
    },
    // 支付宝支付
    zhifuPay() {
      const data = {
        token: this.tableList.token,
        check_id: this.payId,
        type_id: 1
      };
      this.$http.post("/ad_pay", JSON.stringify(data)).then(res => {
        this.dialogTableVisible2 = true;
        this.dialogTableVisible1 = false;
        this.text1 = true;
        this.text2 = false;
        this.config.value = res.data.url;
        this.ispay = res.data.unique_order_id;
        this.payOk();
      });
    },
    // 微信支付
    weixin() {
      const data = {
        token: this.tableList.token,
        check_id: this.payId,
        type_id: 2
      };
      this.$http.post("/ad_pay", JSON.stringify(data)).then(res => {
        this.dialogTableVisible3 = true;
        this.dialogTableVisible1 = false;
        this.text1 = true;
        this.text2 = false;
        this.config.value1 = res.data.url;
        this.ispay = res.data.unique_order_id;
        this.payOk();
      });
    }
  }
};
</script>
<style lang="less" scoped>
.ispay {
  background-color: #4a87da;
  color: #fff;
  width: 0.54rem;
  height: 0.24rem;
  line-height: 0.24rem;
  display: inline-block;
  text-align: center;
}
// 列表样式
#liststyle {
  background-color: #fff;
  width: 100%;
  #box {
    width: 100%;
    height: 1rem;
    border-bottom: 0.01rem solid #ccc;
    font-size: 0.1rem;
    ul {
      text-align: left;
      line-height: 0.2rem;
      margin-top: 0.15rem;
      li {
        margin-bottom: 0.06rem;
        overflow: hidden;
      }
    }
    div {
      width: 0.27rem;
      height: 100%;
      line-height: 1rem;
      font-size: 0.2rem;
    }
    .btnr {
      font-size: 0.3rem;
      color: #cacaca;
    }
  }
}
// 支付弹框样式
#pay {
  div {
    font-size: 0.16rem;
    margin-bottom: 0.3rem;
  }
}
</style>