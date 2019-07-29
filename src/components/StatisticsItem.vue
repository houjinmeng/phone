<template>
  <div>
    <header class="header">
      <dl>
        <dd class="back per_icon" style="position: absolute; top: 0.2rem;right:3rem">
          <router-link :to="'/statistics'">
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
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column label="播放时间" align="center">
        <template slot-scope="info">
          <span>{{info.row.start_time*1000|formatDateTwo}}</span>-
          <span>{{info.row.end_time*1000|formatDateTwo}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="素材1">
        <template slot-scope="info">{{info.row.item1_play_count}}次</template>
      </el-table-column>
      <el-table-column align="center" label="素材2">
        <template slot-scope="info">{{info.row.item2_play_count}}次</template>
      </el-table-column>
    </el-table>
    <el-button
      size="small"
      style="background-color: #15a46c;color: #fff;position: absolute;top:28%;right:37%;margin-top:0.2rem"
      @click="lookone"
    >预览素材一</el-button>
    <el-button
      size="small"
      style="background-color: #15a46c;color: #fff;position: absolute;top:28%;right:4%;margin-top:0.2rem"
      @click="looktwo"
    >预览素材二</el-button>
    <!-- 预览素材1 -->
    <el-dialog title="素材预览" :visible.sync="dialogTableVisible1" width="100%" center>
      <div id="showList" v-if="imglist">
        <div id="imglist" ref="imgList">
          <img
            style="width:400px;height:300px"
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
        :v-if="videoFlag"
        :src="item"
        preload
        height="1.8rem"
        width="50%"
        controls
      ></video>
    </el-dialog>
    <!-- 预览素材2 -->
    <el-dialog title="素材预览" :visible.sync="dialogTableVisible2" width="100%" center>
      <div id="showList" v-if="imglist">
        <div id="imglist" ref="imgList">
          <img
            style="width:400px;height:300px"
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
        :v-if="videoFlag"
        :src="item"
        preload
        height="1.8rem"
        width="50%"
        controls
      ></video>
    </el-dialog>
  </div>
</template>

<script>
import { formatDate } from "../assets/js/date.js"; // 在组件中引用date.js
export default {
  created() {
    this.tableData = this.$route.params.message;
  },
  // 时间戳过滤器
  filters: {
    formatDate(time) {
      var date = new Date(time);
      return formatDate(date, "yyyy/MM/dd"); // 年月日 格式自己定义   'yyyy : MM : dd'  例 2018年12月5日的格式
    },
    formatDateTwo(time) {
      var date = new Date(time);
      return formatDate(date, "yyyy/MM/dd/hh:mm");
    }
  },
  data() {
    return {
      startX: 0, // 开始触摸的位置
      endX: 0, // 结束触摸的位置
      disX: 0, // 移动距离

      videoData: [],
      imgData: [],
      imgFlag: false,
      videoFlag: false,
      mark: 0,
      tableData: [],
      dialogTableVisible1: false, // 预览素材1
      dialogTableVisible2: false // 预览素材2
    };
  },
  methods: {
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
    // 预览素材1
    lookone() {
      this.mark = 0;
      this.imgData = [];
      this.videoData = [];
      this.imgFlag = false;
      this.videoFlag = false;
      this.dialogTableVisible1 = true;
      const data = this.tableData[1].item1_ad;
      for (let i = 0; i < data.length; i++) {
        let fileName = data[i].lastIndexOf(".");
        let fileNameLength = data[i].length;
        let a = data[i].substring(fileName + 1, fileNameLength);
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
          this.imgData.push(data[i]);
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
          this.videoData.push(data[i]);
        }
      }
      if (this.imgData.length === 0) {
        this.imgbtn = false;
        this.imglist = false;
      } else {
        this.imgbtn = true;
        this.imglist = true;
        setTimeout(() => {
          this.$refs.imgList.style.left = 0;
          this.$refs.imgList.style.width = this.imgData.length * 2.4 + "rem";
        }, 0);
      }
    },
    // 预览素材2
    looktwo() {
      this.mark = 0;
      this.imgData = [];
      this.videoData = [];
      this.imgFlag = false;
      this.videoFlag = false;
      this.dialogTableVisible2 = true;
      const data = this.tableData[0].item2_ad;
      for (let i = 0; i < data.length; i++) {
        let fileName = data[i].lastIndexOf(".");
        let fileNameLength = data[i].length;
        let a = data[i].substring(fileName + 1, fileNameLength);
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
          this.imgData.push(data[i]);
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
          this.videoData.push(data[i]);
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
<style>
</style>