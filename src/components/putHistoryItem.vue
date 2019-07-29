<template>
  <div>
    <header class="header">
      <dl>
        <dd class="back per_icon" style="position: absolute; top: 0.2rem;right:3rem">
          <router-link :to="'/puthistory'">
            <i class="left_arrow leftbtn"></i>
          </router-link>
        </dd>
        <dt>投放明细</dt>
        <dd class="logOut" style="position: absolute;left:2.6rem;top:0.2rem">
          <router-link :to="'/'">
            <a href>首页</a>
          </router-link>
        </dd>
      </dl>
    </header>
    <!-- 投放历史详情列表 -->
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
        <i>{{message.qrcode_type}}</i>
      </p>
      <p>
        <span style="line-height: 1rem">二维码：</span>
        <img :src="Url" alt>
      </p>
      <p style="text-align: center;display:block;margin-bottom:1rem">
        <el-button type="primary" @click="preview">预览素材</el-button>
        <el-button type="primary" @click="payDialog">再次投放</el-button>
      </p>
    </div>
    <!-- 预览素材对话框 -->
    <el-dialog
      title="素材预览"
      :visible.sync="dialogTableVisible"
      width="100%"
      style="text-align:center"
    >
      <div id="showList" v-if="imglist">
        <div
          id="imglist"
          ref="imgList"
          @touchstart.prevent="touchstart"
          @touchend.prevent="touchend"
        >
          <img
            style="width:50%;height:2rem"
            v-for="item in imgData"
            :src="item"
            :v-if="imgFlag"
            :key="item.index"
          >
        </div>
      </div>
      <video
        :key="item.index"
        v-for="item in videoData"
        v-show="videoFlag"
        :src="item"
        preload
        height="3rem"
        width="50%"
        controls
      ></video>
    </el-dialog>
    <!-- 再次投放 -->
    <el-dialog title="请选择时间" :visible.sync="dialogTableVisible2" width="100%" center>
      <ul class="top_search" style="margin-bottom:50px">
        <li>
          <div class="block">
            <span class="demonstration">投放时间：</span>
            <el-date-picker
              v-model="value"
              type="date"
              placeholder="开始时间"
              value-format="timestamp"
              :editable="false"
              :picker-options="pickerOptions1"
              style="width:60%"
            ></el-date-picker>
          </div>
          <div class="block" style="margin-top:0.2rem">
            <span class="demonstration">投放周数:</span>
            <el-select placeholder="请选择" v-model="valueweek" style="margin-left:0.1rem;width:60%">
              <el-option
                v-for="item in options1"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </li>
      </ul>
      <el-button type="info" style="margin-left:0.5rem" @click="dialogTableVisible2=false">取消投放</el-button>
      <el-button type="success" @click="putAgain">确定投放</el-button>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    this.message = this.$route.params.message;
    this.machine_name = this.message.machine_name;
    this.machine_address = this.message.address;
    this.Url = this.message.qrocde;
    this.ad_id = this.ad_id.concat(this.$route.params.ad_id);
    this.put.check_id = this.$route.params.check_id;
    this.getoptions(); // 动态生成选择周数下拉框
  },
  data() {
    return {
      // 限制投放开始日期
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() < Date.now() + 3600 * 1000 * 24;
        }
      },
      // 再次投放
      value: "",
      dialogTableVisible2: false,
      put: {
        token: window.sessionStorage.getItem("token"),
        check_id: "",
        start_time: "",
        end_time: ""
      },
      // 投放周数下拉数据
      options1: [],
      valueweek: "",
      // 接收传回的素材数据
      startX: 0, // 开始触摸的位置
      endX: 0, // 结束触摸的位置
      disX: 0, // 移动距离
      imglist: true,
      mark: 0,
      imgData: [],
      videoData: [],
      imgFlag: false,
      videoFlag: false,
      dialogTableVisible: false, // 预览素材弹框
      message: [], // 接收订单信息
      machine_name: "", // 设备名称
      machine_address: "", // 设备地址
      Url: "", // 二维码
      ad_id: [] // 素材地址
    };
  },
  methods: {
    // 再次投放
    payDialog() {
      this.value = "";
      this.valueweek = "";
      this.dialogTableVisible2 = true;
    },
    // 确定再次投放
    putAgain() {
      this.put.start_time = this.value / 1000;
      this.put.end_time = this.valueweek * 604800 + this.put.start_time;
      this.$http
        .post("/check_history_again", JSON.stringify(this.put))
        .then(res => {
          if (res.data.status === 1) {
            this.$message.success("投放成功！");
            this.dialogTableVisible2 = false;
          } else {
            this.$message.error("投放失败！");
          }
        });
    },
    // 动态循环投放周数下拉框数据
    getoptions() {
      for (var i = 1; i <= 52; i++) {
        this.options1[i - 1] = { value: i, label: i };
      }
    },
    // 预览已上传素材图片滑动
    touchstart(ev) {
      ev = ev || event;
      if (ev.touches.length == 1) {
        //tounches类数组，等于1时表示此时有只有一只手指在触摸屏幕
        this.startX = ev.touches[0].clientX; // 记录开始位置
      }
    },
    touchend: function(ev) {
      ev = ev || event;
      if (ev.changedTouches.length == 1) {
        let endX = ev.changedTouches[0].clientX;
        this.disX = endX - this.startX;
        if (this.disX < 0 && Math.abs(this.disX) > 30) {
          if (this.mark === this.imgData.length - 1) {
            this.$message.warning("已经是最后一张了！");
            return false;
          }
          this.mark++;
          this.$refs.imgList.style.left = -2.4 * this.mark + "rem";
        } else if (this.disX > 0 && Math.abs(this.disX) > 30) {
          if (this.mark === 0) {
            this.$message.warning("已经是第一张了");
            return false;
          }
          this.$refs.imgList.style.left = 2.4 * this.mark + 2.4 + "rem";
          this.mark--;
        }
      }
    },
    // 预览素材
    preview() {
      this.mark = 0;
      this.imgData = [];
      this.videoData = [];
      this.imgFlag = false;
      this.videoFlag = false;
      this.dialogTableVisible = true;
      for (let i = 0; i < this.ad_id.length; i++) {
        let fileName = this.ad_id[i].lastIndexOf(".");
        let fileNameLength = this.ad_id[i].length;
        let a = this.ad_id[i].substring(fileName + 1, fileNameLength);
        if (
          a === "jpg" ||
          a === "png" ||
          a === "gif" ||
          a === "jpeg" ||
          a === "bmp" ||
          a === "tif" ||
          a === "psd" ||
          a === "dng" ||
          a === "cr2" ||
          a === "nef"
        ) {
          this.imgFlag = true;
          this.imgData.push(this.ad_id[i]);
        }
        if (
          a === "mp4" ||
          a === "avi" ||
          a === "mov" ||
          a === "rmvb" ||
          a === "rm" ||
          a === "flv" ||
          a === "3gp"
        ) {
          this.videoFlag = true;
          this.videoData.push(this.ad_id[i]);
        }
      }
      if (this.imgData.length === 0) {
        this.imglist = false;
      } else {
        this.imglist = true;
        setTimeout(() => {
          this.$refs.imgList.style.left = 0;
          this.$refs.imgList.style.width = this.imgData.length * 2.4 + "rem";
        }, 0);
      }
    }
  }
};
</script>
<style lang="less" scoped>
// 素材展示
#showList {
  width: 2.4rem;
  height: 1.8rem;
  overflow: hidden;
  margin: 0 auto;
  position: relative;
  #imglist {
    height: 1.8rem;
    width: 2.4rem;
    position: absolute;
  }
}

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
      line-height: 0.25rem;
      border-radius: 0.03rem;
      background-color: #fff;
    }
  }
}
</style>