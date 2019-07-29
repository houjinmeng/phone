<template>
  <div>
    <header class="header">
      <dl>
        <dd class="back per_icon" style="position: absolute; top: 0.2rem;right:3rem">
          <router-link :to="'/myorder'">
            <i class="left_arrow leftbtn"></i>
          </router-link>
        </dd>
        <dt>订单详情</dt>
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
      <p>
        <span>吸粉账号：</span>
        <i>{{message.type}}</i>
      </p>
      <p>
        <span style="line-height: 1rem">二维码：</span>
        <img :src="Url" alt>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  created() {
    this.message = this.$route.params.message;
    this.machine_name = this.message.machine_name.join(";");
    this.machine_address = this.message.address.join(";");
    this.Url = "http://" + this.message.code;
  },
  data() {
    return {
      message: [], // 接收订单信息
      machine_name: "", // 设备名称
      machine_address: "", // 设备地址
      Url: "" // 二维码
    };
  }
};
</script>
<style lang="less" scoped>
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