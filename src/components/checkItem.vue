<template>
  <div>
    <header class="header">
      <dl>
        <dd class="back per_icon" style="position: absolute; top: 0.2rem;right:3rem">
          <router-link :to="'/check'">
            <i class="left_arrow leftbtn"></i>
          </router-link>
        </dd>
        <dt>审核详情</dt>
        <dd class="logOut" style="position: absolute;left:2.6rem;top:0.2rem">
          <router-link :to="'/'"><a href>首页</a></router-link>
        </dd>
      </dl>
    </header>
    <div id="box">
      <p>
        <span>设备名称：</span>
        <el-input
          style="width:1.54rem;"
          v-model="machine_name"
          size="small"
          type="textarea"
          :autosize="true"
          resize="none"
          readonly
        ></el-input>
      </p>
      <p>
        <span>投放地点：</span>
        <el-input
          style="width:1.54rem"
          v-model="machine_address"
          size="small"
          type="textarea"
          :autosize="true"
          resize="none"
          readonly
        ></el-input>
      </p>
      <p>
        <span>连续播放次数：</span>
        <i>{{message.repeat_number}}次</i>
      </p>
      <p>
        <span>每小时出现次数：</span>
        <i>{{message.play_count}}次</i>
      </p>
      <p>
        <span>合计金额：</span>
        <i>{{message.order_amount}}元</i>
      </p>
      <p v-if="showreason">
        <span>驳回原因：</span>
        <el-input
          type="textarea"
          :rows="2"
          autosize
          style="width:1.54rem"
          resize="none"
          v-model="message.explain"
          readonly
        ></el-input>
      </p>
      <p>
        <span>吸粉账号：</span>
        <i>{{message.type}}</i>
      </p>
      <p>
        <span style="line-height: 1rem">二维码：</span>
        <img :src="Url" alt>
      </p>
      <p v-if="showbtn">
        <el-button style="margin-left:1.5rem;width:0.8rem" size="small" @click="payDialog" type="primary">催办</el-button>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  created() {
    this.message = this.$route.params.message;
    this.status = this.$route.params.status;
    this.machine_name = this.message.machine_name.join(";");
    this.machine_address = this.message.address.join(";");
    this.Url = "http://" + this.message.code;
    if (this.message.explain == null) {
      this.showreason = false;
    } else {
      this.showreason = true;
    }
    if (this.status == "待审核" || this.status == "审核中") {
      this.showbtn = true;
    } else {
      this.showbtn = false;
    }
  },
  data() {
    return {
      showreason: false, // 驳回理由
      message: [], // 接收审核信息
      machine_name: "", // 设备名称
      machine_address: "", // 设备地址
      Url: "", // 二维码
      explain: "", // 驳回原因
      showbtn: false, // 催办按钮有无
      status: "", // 审核状态
      check_id: ""
    };
  },
  methods: {
    // 点击催办
    payDialog() {
      const data = {
        token: window.sessionStorage.getItem("token"),
        check_id: this.$route.params.check_id
      };
      this.$http.post("/check_press", JSON.stringify(data)).then(res => {
        if (res.data.status === 1) {
          this.$message.success("催办成功，尽快为您办理");
          this.getCheckList();
        } else {
          this.$message.error("催办失败");
        }
      });
    }
  }
};
</script>
<style lang='less' scoped>
#box {
  margin-top: 0.3rem;
  margin-bottom: 0.6rem;
  p {
    display: flex;
    justify-content: flex-start;
    margin-top: 0.19rem;
    span {
      width: 1.5rem;
      text-align: right;
      font-size: 0.14rem;
      margin-top: 5px;
    }
    img {
      height: 1rem;
      width: 1rem;
    }
    i {
      width: 1.54rem;
      text-align: center;
      border: 0.01rem solid #dcdfe6;
      font-size: 0.14rem;
      height: 0.25rem;
      line-height: 0.25rem;
      border-radius: 0.03rem;
      background-color: #fff;
    }
  }
}
</style>