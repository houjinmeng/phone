<template>
  <div>
    <!-- 头部 -->
    <header class="header">
      <dl>
        <dd class="back per_icon">
          <router-link :to="'/personcenter'">
            <i class="left_arrow"></i>
          </router-link>
        </dd>
        <dt>填写订单</dt>
        <dd class="logOut">
          <router-link :to="'/'">
            <a href>首页</a>
          </router-link>
        </dd>
      </dl>
    </header>
    <!-- form表单 -->
    <el-form
      label-width="1.3rem"
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      class="demo-ruleForm"
      size="mini"
      style="margin-top:.15rem;margin-bottom:1rem"
    >
      <el-form-item label="设备名称">
        <el-input style="width:2rem" v-model="getMachine.machine_name" :readonly="true"></el-input>
      </el-form-item>
      <el-form-item label="投放地点">
        <el-input style="width:2rem" v-model="getMachine.address" :readonly="true"></el-input>
      </el-form-item>
      <el-form-item label="吸粉账号" prop="account">
        <el-select placeholder="请选择" v-model="ruleForm.account" style="width:2rem">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <!-- 上传二维码 -->
        <el-upload
          class="avatar-uploader"
          action="http://192.168.1.144/ad/client/upload_qrcode"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :data="uploadData"
          name="img"
          style="width: 1rem;height: 1rem;border: 1px dashed #d9d9d9;border-radius: 6px;cursor: pointer;overflow: hidden;"
        >
          <img
            v-if="imageUrl"
            :src="imageUrl"
            class="avatar"
            style="width: 1rem;height: 1rem;display: block;"
          >
          <i
            v-else
            style="font-size: 0.14rem;color: #8c939d;width: 1rem;height: 1rem;line-height: 1rem;text-align: center;"
          >点击上传二维码</i>
        </el-upload>
      </el-form-item>
      <el-form-item label="二维码位置" prop="location">
        <el-select placeholder="请选择" v-model="ruleForm.location" style="width:2rem">
          <el-option
            v-for="item in options0"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="投放开始时间" prop="valuedata">
        <el-date-picker
          type="date"
          placeholder="选择日期"
          value-format="timestamp"
          v-model="ruleForm.valuedata"
          :picker-options="pickerOptions"
          :editable="false"
          style="width:2rem"
          v-on:input="watchinput"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="投放周数">
        <el-select
          placeholder="请选择"
          v-model="ruleForm.valueweek"
          style="width:2rem"
          v-on:input="watchinput"
        >
          <el-option
            v-for="item in options1"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="连续播放次数" prop="play_count">
        <el-input
          style="width:2rem"
          v-model.number="ruleForm.play_count"
          v-on:input="watchinput"
          type="number"
        ></el-input>
      </el-form-item>
      <el-form-item label="每小时出现次数" prop="ad_count">
        <el-input style="width:2rem" v-model.number="ruleForm.ad_count" readonly></el-input>
      </el-form-item>
      <!-- 上传素材 -->
      <el-form-item label="上传素材" prop="valueimg">
        <!-- 上传图片或视频下拉选择框 -->
        <el-select placeholder="请选择" style="width:0.82rem" v-model="ruleForm.valueimg">
          <el-option
            v-for="item in options2"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <span style="font-size:0.12rem">建议素材格式：9:16</span>
      </el-form-item>
      <el-form-item label-width="0.6rem">
        <!-- 自定义上传素材 -->
        <el-upload
          name="pic"
          style="display: inline-block;"
          class="upload-demo"
          action="#"
          :multiple="ruleForm.valueimg==0?true:false"
          :auto-upload="false"
          :show-file-list="false"
          :on-change="imgPreview"
          :limit="10"
          :on-exceed="maxnumber"
          :file-list="fileList"
        >
          <el-button slot="trigger" type="primary">选择素材</el-button>
          <el-button type="primary" @click="submitUpload">提交素材</el-button>
        </el-upload>
        <!-- 上传背景音乐 -->
        <el-upload
          name="bgm"
          style="display: inline-block"
          class="editor-slide-upload"
          :data="uploadbgm"
          action="/api/ad/client/bgm/"
          :http-request="uploadBgm"
          :show-file-list="false"
        >
          <el-button type="primary">添加背景音乐</el-button>
        </el-upload>
        <span class="add" @click="add" v-if="additem">+</span>
      </el-form-item>
      <!-- 展示已选择的素材1 -->
      <div id="showbox">
        <div id="showList" v-show="showList">
          <div
            id="imglist"
            ref="imgList"
            @touchstart.prevent="touchstart"
            @touchend.prevent="touchend"
          >
            <div
              v-for="(item,k) in Data"
              :key="k"
              style="width:1.2rem;height:1.2rem"
              class="left everyimg"
            >
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-delete"
                class="delete"
                @click.stop="delimg(k)"
              ></el-button>
              <img style="width:1.2rem;height:1.2rem;" :src="item.src" :v-if="imgFlag">
            </div>
          </div>
          <div v-if="videoFlag" style="width:100%;height:100%" class="videobox">
            <el-button
              type="primary"
              icon="el-icon-delete"
              class="delvideo"
              @click="delvideo"
              size="mini"
            ></el-button>
            <video :src="Data1.ad_address" preload controls style="width:2rem;height:1.5rem"></video>
          </div>
        </div>
      </div>
      <!-- 可选的第二组素材 -->
      <el-form-item label="上传素材(2)" v-if="showupload">
        <!-- 上传图片或视频下拉选择框 -->
        <el-select placeholder="请选择" style="width:0.8rem" v-model="ruleForm.valueimg2">
          <el-option
            v-for="item in options2"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <span style="font-size:0.12rem">建议素材格式：16:9</span>
      </el-form-item>
      <el-form-item label-width="0.6rem" v-show="showupload">
        <!-- 上传素材 -->
        <el-upload
          name="pic"
          style="display: inline-block"
          class="upload-demo"
          action="#"
          :multiple="ruleForm.valueimg2==0?true:false"
          :auto-upload="false"
          :show-file-list="false"
          :on-change="imgPreview1"
          :limit="10"
          :on-exceed="maxnumber"
        >
          <el-button slot="trigger" type="primary">选择素材</el-button>
          <el-button type="primary" @click="submitUpload2">提交素材</el-button>
        </el-upload>
        <!-- 上传背景音乐 -->
        <el-upload
          name="bgm"
          style="display: inline-block"
          class="editor-slide-upload"
          :data="uploadbgm"
          action="/api/ad/client/bgm/"
          :http-request="uploadBgm"
          :show-file-list="false"
        >
          <el-button type="primary">添加背景音乐</el-button>
        </el-upload>
      </el-form-item>
      <!-- 展示已选择的素材2 -->
      <div id="showbox">
        <div id="showList" v-show="showList1">
          <div
            id="imglist"
            ref="imgList2"
            @touchstart.prevent="touchstart1"
            @touchend.prevent="touchend1"
          >
            <div
              v-for="(item,k) in Data2"
              :key="k"
              style="width:1.2rem;height:1.2rem"
              class="left everyimg"
            >
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-delete"
                class="delete"
                @click="delimg1(k)"
              ></el-button>
              <img style="width:1.2rem;height:1.2rem" :src="item.src" :v-if="imgFlag1">
            </div>
          </div>
          <div v-if="videoFlag1" style="width:100%;height:100%" class="videobox">
            <el-button
              type="primary"
              icon="el-icon-delete"
              class="delvideo"
              @click="delvideo1"
              size="mini"
            ></el-button>
            <video :src="Data3.ad_address" preload controls style="width:2rem;height:1.5rem"></video>
          </div>
        </div>
      </div>
      <el-form-item label="每张图片显示秒数" prop="seconds" v-if="imgTime">
        <el-input
          style="width:1.5rem"
          v-model.number="ruleForm.seconds"
          v-on:input="watchinput"
          type="number"
        ></el-input>秒
      </el-form-item>
      <div class="form-footer" style="margin-left:0.8rem">
        <el-popover placement="right" width="100" trigger="click">
          <p>素材总时长：{{total_time}}秒</p>
          <p>素材总金额：{{allprice}}元</p>
          <span>折后总金额：{{discounted_price}}元</span>
          <el-button @click="getPrice" slot="reference">金额明细</el-button>
        </el-popover>
        <el-tag type="success" style="margin-left:0.2rem;cursor:pointer" @click="discounts">优惠政策</el-tag>
        <p style="font-size:0.18rem;margin-top:0.3rem">合计金额：{{discounted_price}}元</p>
      </div>
      <el-form-item style="margin-top:0.3rem;margin-left:0.2rem">
        <el-button type="primary" @click="submitForm('ruleForm')">提交审核</el-button>
      </el-form-item>
    </el-form>
    <!-- 优惠政策弹框 -->
    <el-dialog :visible.sync="dialogTableVisible" width="100%">
      <div class="box1 same" style="margin:0;padding-top:5px;flex:3">
        <p id="samebg">广告时长单价</p>
        <div style="width:100%">
          <span>5秒/周：</span>
          <span>
            <input type="text" v-model="priceForm.five" readonly> 元
          </span>
        </div>
        <div style="100%">
          <span>15秒/周：</span>
          <span>
            <input type="text" v-model="priceForm.fifteen" readonly> 元
          </span>
        </div>
        <div>
          <span>30秒/周：</span>
          <span>
            <input type="text" v-model="priceForm.thirty" readonly> 元
          </span>
        </div>
      </div>
      <div class="box1 same" style="flex:3;padding-top:10px">
        <p id="samebg">广告时长优惠</p>
        <div>
          <span>5-15秒：</span>
          <span>
            <input type="text" v-model="priceForm.five_timeout" readonly> 元/秒
          </span>
        </div>
        <div>
          <span>15-30秒：</span>
          <span>
            <input type="text" v-model="priceForm.fifteen_timeout" readonly> 元/秒
          </span>
        </div>
        <div>
          <span>30秒以上：</span>
          <span>
            <input type="text" v-model="priceForm.thirty_time" readonly> 元/秒
          </span>
        </div>
      </div>
      <div class="box1 same" style="flex:4;padding-top:20px">
        <p id="longbg">广告投放周期优惠</p>
        <div>
          <span>4周（一个月）：</span>
          <span>
            <input type="text" v-model="priceForm.one_month_discount" readonly> %
          </span>
        </div>
        <div>
          <span>13周（3个月）：</span>
          <span>
            <input type="text" v-model="priceForm.three_month_discount" readonly> %
          </span>
        </div>
        <div>
          <span>27周（6个月）：</span>
          <span>
            <input type="text" v-model="priceForm.six_month_discount" readonly> %
          </span>
        </div>
        <div>
          <span>50周（一年）：</span>
          <span>
            <input type="text" v-model="priceForm.one_year_discount" readonly> %
          </span>
        </div>
      </div>
    </el-dialog>
    <!-- 提交弹框 -->
    <el-dialog title="提交成功" :visible.sync="centerDialogVisible" width="30%" center>
      <div style="text-align:center">请及时关注短信通知，审核成功后请尽快完成支付。</div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  mounted() {
    this.getMachine_id(); // 获取已选设备id
    this.getoptions(); // 动态生成选择周数下拉框
  },
  data() {
    return {
      startX: 0, // 开始触摸的位置
      endX: 0, // 结束触摸的位置
      disX: 0, // 移动距离

      mark: 0,
      mark1: 0,
      count: "", //提交审核后倒计时
      // 接收已上传素材id
      matterId: [],
      // 图片显示时间选填
      imgTime: false,
      // 素材展示
      showList: false,
      showList1: false,
      // 已登录用户名
      username: window.sessionStorage.getItem("user"),
      // 添加素材按钮
      additem: false,
      // 二维码
      imageUrl: "",
      imgFlag: false,
      videoFlag: false,
      imgFlag1: false,
      videoFlag1: false,
      // 展示上传素材
      Data: [],
      Data1: {},
      Data2: [],
      Data3: {},
      // 提交弹框
      centerDialogVisible: false,
      // 限制投放日期
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() + 3600 * 1000 * 24;
        }
      },
      // 接收优惠政策数据
      priceForm: {
        five: "",
        fifteen: "",
        thirty: "",
        five_timeout: "",
        fifteen_timeout: "",
        thirty_time: "",
        one_month_discount: "",
        three_month_discount: "",
        six_month_discount: "",
        one_year_discount: ""
      },
      // 优惠政策弹框显示隐藏
      dialogTableVisible: false,
      // 素材总时长
      total_time: "",
      // 素材总金额
      allprice: "",
      // 折后金额
      discounted_price: "",
      // 第二组上传素材显示隐藏
      showupload: false,
      // 表单验证绑定
      ruleForm: {
        token: window.sessionStorage.getItem("token"),
        account: "",
        location: "",
        valuedata: "",
        valueweek: "",
        play_count: "",
        ad_count: "",
        valueimg: "",
        valueimg2: "",
        seconds: "",
        team: 1
      },
      // 表单验证规则
      rules: {
        account: [
          { required: true, message: "请选择吸粉账号", trigger: "change" }
        ],
        location: [
          { required: true, message: "请选择二维码位置", trigger: "change" }
        ],
        valuedata: [
          { required: true, message: "请选择开始投放时间", trigger: "change" }
        ],
        valueweek: [
          { required: true, message: "请选择投放周数", trigger: "change" }
        ],
        play_count: [
          { required: true, message: "请填写连续播放次数", trigger: "blur" },
          { min: 1, type: "number", message: "播放次数必须最小为1的整数" }
        ],
        valueimg: [
          { required: true, message: "请选择素材类型", trigger: "change" }
        ],
        seconds: [
          {
            required: true,
            message: "请填写每张图片显示的秒数",
            trigger: "blur"
          },
          { min: 1, type: "number", message: "显示秒数必须为大于0的整数" }
        ]
      },
      // 上传背景音乐
      uploadbgm: {
        token: window.sessionStorage.getItem("token"),
        ad_id: ""
      },
      // 获取用户已选设备信息
      getMachine: {},
      // 上传二维码
      uploadData: {
        token: window.sessionStorage.getItem("token"),
        type: "",
        machine_arr: []
      },
      // 吸粉账号类型下拉框数据
      options: [
        {
          value: "微信",
          label: "微信"
        },
        {
          value: "公众号",
          label: "公众号"
        },
        {
          value: "微博",
          label: "微博"
        },
        {
          value: "抖音",
          label: "抖音"
        },
        {
          value: "快手",
          label: "快手"
        }
      ],
      // 投放周数下拉数据
      options1: [],
      // 上传素材类型
      options2: [
        {
          value: "0",
          label: "图片"
        },
        {
          value: "1",
          label: "视频"
        }
      ],
      // 二维码位置下拉数据
      options0: [
        {
          value: "左上",
          label: "左上"
        },
        {
          value: "左下",
          label: "左下"
        },
        {
          value: "右上",
          label: "右上"
        },
        {
          value: "右下",
          label: "右下"
        }
      ],
      // 动态创建上传素材
      dynamicValidateForm: {
        domains: [
          {
            value: ""
          }
        ]
      },
      // 自定义上传素材
      formmatter: {
        silderimgList: [],
        token: window.sessionStorage.getItem("token")
      },
      // 计算价格所需参数
      price: {
        token: window.sessionStorage.getItem("token"),
        length: "",
        start_time: "",
        end_time: "",
        repeat_number: "",
        number: ""
      },
      // 接收视频时长
      length1: "",
      length2: "",
      // 比较时长的数组
      maxlength: [],
      // 提交审核
      submitcheck: {
        token: window.sessionStorage.getItem("token"),
        ad_id: "",
        machine_id: "",
        order_amount: "",
        start_time: "",
        end_time: "",
        play_count: "",
        repeat_number: "",
        pp: "",
        qrcode_id: "",
        location: "",
        length: ""
      },
      fileList: []
    };
  },
  // 页面销毁，删除为提交审核的素材
  destroyed() {
    const data = {
      token: window.sessionStorage.getItem("token"),
      ad_id: this.matterId
    };
    this.$http.post("/delete_upload", JSON.stringify(data)).then(res => {});
  },
  methods: {
    // 预览已上传素材1
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
          if (this.mark >= this.Data.length - 2) {
            this.$message.warning("已经是最后一张了！");
            return false;
          }
          this.mark++;
          this.$refs.imgList.style.left = -120 * this.mark + "px";
        } else if (this.disX > 0 && Math.abs(this.disX) > 30) {
          if (this.mark === 0) {
            this.$message.warning("已经是第一张了");
            return false;
          }
          this.$refs.imgList.style.left = -120 * this.mark + 120 + "px";
          this.mark--;
        }
      }
    },
    // 预览已上传素材2
    touchstart1(ev) {
      ev = ev || event;
      if (ev.touches.length == 1) {
        //tounches类数组，等于1时表示此时有只有一只手指在触摸屏幕
        this.startX = ev.touches[0].clientX; // 记录开始位置
      }
    },
    touchend1: function(ev) {
      ev = ev || event;
      if (ev.changedTouches.length == 1) {
        let endX = ev.changedTouches[0].clientX;
        this.disX = endX - this.startX;
        if (this.disX < 0 && Math.abs(this.disX) > 30) {
          if (this.mark1 >= this.Data2.length - 2) {
            this.$message.warning("已经是最后一张了！");
            return false;
          }
          this.mark1++;
          this.$refs.imgList2.style.left = -120 * this.mark + "px";
        } else if (this.disX > 0 && Math.abs(this.disX) > 30) {
          if (this.mark1 === 0) {
            this.$message.warning("已经是第一张了");
            return false;
          }
          this.$refs.imgList2.style.left = -120 * this.mark1 + 120 + "px";
          this.mark1--;
        }
      }
    },
    // 监听实时获取价格
    watchinput() {
      this.ruleForm.ad_count = this.ruleForm.play_count * 4;
      setTimeout(() => {
        this.getPrice();
      }, 1000);
    },
    // 删除上传的素材1
    delimg(k) {
      const data = {
        token: window.sessionStorage.getItem("token"),
        ad_id: this.Data[k].id
      };
      this.$http.post("/delete_upload", JSON.stringify(data)).then(res => {
        if (res.data.status === 1) {
          let index = this.matterId.indexOf(this.Data[k].id);
          this.matterId.splice(index, 1);
          this.$message.success("删除素材成功");
          this.Data.splice(k, 1);
          if (this.Data.length == 0) {
            this.showList = false;
          }
        }
      });
    },
    delvideo() {
      const data = {
        token: window.sessionStorage.getItem("token"),
        ad_id: this.Data1.ad_id
      };
      this.$http.post("/delete_upload", JSON.stringify(data)).then(res => {
        if (res.data.status === 1) {
          let index = this.matterId.indexOf(this.Data1.ad_id);
          this.matterId.splice(index, 1);
          this.$message.success("删除素材成功");
          this.showList = false;
          this.videoFlag = false;
        }
      });
    },
    // 删除上传的素材2
    delimg1(k) {
      const data = {
        token: window.sessionStorage.getItem("token"),
        ad_id: this.Data2[k].id
      };
      this.$http.post("/delete_upload", JSON.stringify(data)).then(res => {
        if (res.data.status === 1) {
          let index = this.matterId.indexOf(this.Data2[k].id);
          this.matterId.splice(index, 1);
          this.$message.success("删除素材成功");
          this.Data2.splice(k, 1);
          if (this.Data2.length == 0) {
            this.showList1 = false;
          }
        }
      });
    },
    delvideo1() {
      const data = {
        token: window.sessionStorage.getItem("token"),
        ad_id: this.Data3.ad_id
      };
      this.$http.post("/delete_upload", JSON.stringify(data)).then(res => {
        if (res.data.status === 1) {
          let index = this.matterId.indexOf(this.Data3.ad_id);
          this.matterId.splice(index, 1);
          this.$message.success("删除素材成功");
          this.showList1 = false;
          this.videoFlag1 = false;
        }
      });
    },
    // 优惠政策
    discounts() {
      this.getPrice();
      this.dialogTableVisible = true;
    },
    // 增加第二组素材
    add() {
      this.showupload = !this.showupload;
      this.ruleForm.team = 2;
    },
    // 上传图片最大限制
    maxnumber(files, fileList) {
      if (this.ruleForm.valueimg === "0" || this.ruleForm.valueimg2 === "0") {
        this.$message.error("最多上传十张图片素材！！");
        fileList = [];
      }
    },
    //提交审核3秒后进入跳转页面
    clickJump() {
      const timejump = 3;
      if (!this.timer) {
        this.count = timejump;
        this.show = false;
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= timejump) {
            this.count--;
          } else {
            this.show = true;
            clearInterval(this.timer);
            this.timer = null;
            //跳转的页面写在此处
            this.$router.push("/check");
          }
        }, 1000);
      }
    },
    // 提交审核
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.matterId.length === 0) {
            this.$message.warning("请确认是否已成功提交素材");
            return false;
          }
          this.submitcheck.ad_id = this.matterId.join(",");
          this.submitcheck.machine_id = this.getMachine.machine_id;
          this.submitcheck.play_count = this.ruleForm.ad_count;
          this.submitcheck.repeat_number = this.ruleForm.play_count;
          this.submitcheck.pp = this.ruleForm.valueweek;
          this.submitcheck.location = this.ruleForm.location;
          this.submitcheck.length = this.price.length;
          this.$http
            .post("/submit_audit", JSON.stringify(this.submitcheck))
            .then(res => {
              if (res.data.status === 1) {
                this.clickJump();
                this.centerDialogVisible = true;
              } else {
                this.$message.error("提交审核失败，请重新提交！");
              }
            });
        } else {
          this.$message.warning("请完善订单信息");
          return false;
        }
      });
    },
    // 动态循环投放周数下拉框数据
    getoptions() {
      for (var i = 1; i <= 52; i++) {
        this.options1[i - 1] = { value: i, label: i };
      }
    },
    // 计算价格
    getPrice() {
      this.maxlength = [];
      if (this.showupload === true) {
        if (this.ruleForm.valueimg === "0") {
          let len = this.Data.length * this.ruleForm.seconds;
          this.maxlength.push(len);
        } else {
          this.maxlength.push(this.length1);
        }
        if (this.ruleForm.valueimg2 === "0") {
          let len = this.Data2.length * this.ruleForm.seconds;
          this.maxlength.push(len);
        } else {
          this.maxlength.push(this.length2);
        }
        this.price.length = Math.max.apply(null, this.maxlength);
      } else {
        if (this.ruleForm.valueimg === "0") {
          this.price.length = this.ruleForm.seconds * this.Data.length;
        } else {
          this.price.length = this.length1;
        }
      }
      this.price.start_time = this.ruleForm.valuedata / 1000;
      this.price.end_time =
        this.ruleForm.valueweek * 604800 + this.price.start_time;
      this.submitcheck.start_time = this.price.start_time;
      this.submitcheck.end_time = this.price.end_time;
      this.price.number = this.uploadData.machine_arr.length;
      this.price.repeat_number = this.ruleForm.play_count;
      this.$http.post("/count_price", JSON.stringify(this.price)).then(res => {
        this.allprice = res.data.amount_detail.price;
        this.total_time = res.data.amount_detail.total_time;
        this.discounted_price = res.data.amount_detail.discounted_price;
        this.priceForm = res.data.length_price;
        this.submitcheck.order_amount = res.data.amount_detail.discounted_price;
      });
    },
    // 素材选择事件
    imgPreview(file) {
      this.formmatter.silderimgList = [];
      if (this.ruleForm.valueimg === "0") {
        if (this.Data.length >= 10) {
          this.$message.warning("最多选择十张图片素材");
          return false;
        }
        let fileName = file.name;
        let regex = /(.jpg|.jpeg|.gif|.png|.bmp|.tif|.psd|.dng|.cr2|.nef)$/;
        if (regex.test(fileName.toLowerCase())) {
          this.$message.success("图片选择成功，请点击提交");
          this.fileList.push(file);
          for (let i = 0; i < this.fileList.length; i++) {
            let obj = {};
            obj = this.fileList[i].raw;
            this.formmatter.silderimgList.push(obj);
          }
        } else {
          this.$message.error("请选择图片文件");
          return false;
        }
      } else if (this.ruleForm.valueimg === "1") {
        if (this.Data1.length === 1 || this.fileList.length !== 0) {
          this.$message.warning("最多上传一个视频素材");
          return false;
        }
        let fileName = file.name;
        let regex = /(.mp4|.AVI|.mov|.rmvb|.rm|.FLV|.3GP)$/;
        if (regex.test(fileName.toLowerCase())) {
          const isLt2M = file.size / 1024 / 1024 < 200;
          if (!isLt2M) {
            this.$message.error("上传视频大小不能超过 200MB!");
            return false;
          }
          this.ruleForm.silder_image = file.url;
          this.$message.success("视频选择成功，请点击提交");
          this.fileList.push(file);
          for (let i = 0; i < this.fileList.length; i++) {
            let obj = {};
            obj = this.fileList[i].raw;
            this.formmatter.silderimgList.push(obj);
          }
        } else {
          this.$message.error("请选择视频文件");
          return false;
        }
      } else {
        this.$message.error("请选择素材类型");
        return false;
      }
    },
    // 素材选择事件2
    imgPreview1(file) {
      this.formmatter.silderimgList = [];
      if (this.ruleForm.valueimg2 === "0") {
        if (this.Data2.length >= 10) {
          this.$message.warning("最多选择十张图片素材");
          return false;
        }
        let fileName = file.name;
        let regex = /(.jpg|.jpeg|.gif|.png|.bmp|.tif|.psd|.dng|.cr2|.nef)$/;
        if (regex.test(fileName.toLowerCase())) {
          this.ruleForm.silder_image = file.url;
          this.$message.success("图片选择成功，请点击提交");
          this.fileList.push(file);
          for (let i = 0; i < this.fileList.length; i++) {
            let obj = {};
            obj = this.fileList[i].raw;
            this.formmatter.silderimgList.push(obj);
          }
        } else {
          this.$message.error("请选择图片文件");
          return false;
        }
      } else if (this.ruleForm.valueimg2 === "1") {
        if (this.Data3.length === 1 || this.fileList.length !== 0) {
          this.$message.warning("最多上传一个视频素材");
          return false;
        }
        let fileName = file.name;
        let regex = /(.mp4|.AVI|.mov|.rmvb|.rm|.FLV|.3GP)$/;
        if (regex.test(fileName.toLowerCase())) {
          const isLt2M = file.size / 1024 / 1024 < 200;
          if (!isLt2M) {
            this.$message.error("上传视频大小不能超过 200MB!");
            return false;
          }
          this.ruleForm.silder_image = file.url;
          this.$message.success("视频选择成功，请点击提交");
          this.fileList.push(file);
          for (let i = 0; i < this.fileList.length; i++) {
            let obj = {};
            obj = this.fileList[i].raw;
            this.formmatter.silderimgList.push(obj);
          }
        } else {
          this.$message.error("请选择视频文件");
          return false;
        }
      } else {
        this.$message.error("请选择素材类型");
        return false;
      }
    },
    // 自定义上传素材
    submitUpload() {
      let url = "";
      let name = "";
      let that = this;
      if (that.Data.length > 10) {
        that.$message.warning("最多上传十张图片素材");
        return false;
      }
      if (that.Data1.length >= 1) {
        that.$message.warning("最多上传一个视频素材");
        return false;
      }
      if (that.ruleForm.valueimg === "0") {
        url = "/upload_pic";
        name = `pic[]`;
      } else {
        url = "/upload_video";
        name = "video";
      }
      let formData = new FormData();
      // that.form.silderimgList值本地预览的图片数组
      for (let i = 0; i < that.formmatter.silderimgList.length; i++) {
        formData.append(name, that.formmatter.silderimgList[i]);
      }
      formData.append("token", that.ruleForm.token);
      formData.append("item", that.ruleForm.team);
      // 上传服务器的api
      that
        .$http({
          method: "post", // 指定请求方式
          url: url, // 请求接口
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;"
          },
          data: formData
        })
        .then(res => {
          if (res.status === 200) {
            that.fileList = [];
            that.additem = true;
            that.showList = true;
            if (res.data.error == null) {
              that.$message.success("素材提交成功");
            } else {
              that.$message.warning(res.data.error);
            }
            if (that.ruleForm.valueimg === "0") {
              that.imgTime = true;
              that.uploadbgm.ad_id = res.data.ad_id.join(",");
              for (var i = 0; i < res.data.ad_address.length; i++) {
                if (that.Data.length === 10 || that.Data.length > 10) {
                  that.$message.warning("上传的图片素材已到达最大数量10张");
                  break;
                } else {
                  let obj = {
                    src: res.data.ad_address[i],
                    id: res.data.ad_id[i]
                  };
                  that.Data.push(obj);
                }
              }
              that.$refs.imgList.style.width = that.Data.length * 1.2 + "rem";
              that.imgFlag = true;
              that.matterId = that.matterId.concat(res.data.ad_id);
            } else if (that.ruleForm.valueimg === "1") {
              that.uploadbgm.ad_id = res.data.ad_id;
              that.length1 = res.data.ad_length;
              that.Data1 = res.data;
              that.videoFlag = true;
              that.matterId.push(res.data.ad_id);
            }
            that.getPrice();
          } else {
            that.$message.error("素材提交失败");
          }
        });
    },
    // 自定义上传素材2
    submitUpload2() {
      let url = "";
      let name = "";
      let that = this;
      if (that.Data2.length > 10) {
        that.$message.warning("最多上传十张图片素材");
        return false;
      }
      if (that.Data3.length >= 1) {
        that.$message.warning("最多上传一个视频素材");
        return false;
      }
      if (that.ruleForm.valueimg2 === "0") {
        url = "/upload_pic";
        name = `pic[]`;
      } else {
        url = "/upload_video";
        name = "video";
      }
      let formData = new FormData();
      // that.form.silderimgList值本地预览的图片数组
      for (let i = 0; i < that.formmatter.silderimgList.length; i++) {
        formData.append(name, that.formmatter.silderimgList[i]);
      }
      formData.append("token", that.ruleForm.token);
      formData.append("item", that.ruleForm.team);
      that
        .$http({
          method: "post", // 指定请求方式
          url: url, // 请求接口
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;"
          },
          data: formData
        })
        .then(function(res) {
          if (res.status === 200) {
            that.fileList = [];
            that.showList1 = true;
            if (res.data.error == null) {
              that.$message.success("素材提交成功");
            } else {
              that.$message.warning(res.data.error);
            }
            if (that.ruleForm.valueimg2 === "0") {
              that.imgTime = true;
              that.uploadbgm.ad_id = res.data.ad_id.join(",");
              for (var i = 0; i < res.data.ad_address.length; i++) {
                if (that.Data2.length === 10 || that.Data2.length > 10) {
                  that.$message.warning("上传的图片素材已到达最大数量10张");
                  break;
                } else {
                  let obj = {
                    src: res.data.ad_address[i],
                    id: res.data.ad_id[i]
                  };
                  that.Data2.push(obj);
                }
              }
              that.$refs.imgList2.style.width = that.Data2.length * 1.2 + "rem";
              that.imgFlag1 = true;
              that.matterId = that.matterId.concat(res.data.ad_id);
            } else {
              that.uploadbgm.ad_id = res.data.ad_id;
              that.length2 = res.data.ad_length;
              that.Data3 = res.data;
              that.videoFlag1 = true;
              that.matterId.push(res.data.ad_id);
            }
            that.getPrice();
          } else {
            that.$message.error("素材提交失败");
          }
        });
    },
    // 上传素材的背景音乐
    uploadBgm(f) {
      if (this.uploadbgm.ad_id.length === 0) {
        // this.$message.warning("请先上传素材");
        alert("请先上传素材");
        return false;
      }
      let upload = new FormData();
      upload.append("bgm", f.file);
      upload.append("token", this.uploadbgm.token);
      upload.append("ad_id", this.uploadbgm.ad_id);
      this.$http.post("/bgm", upload).then(res => {
        this.uploadbgm.ad_id = [];
        if (res.status === 200) {
          this.$message.success("背景音乐添加成功");
        } else {
          this.$message.error("背景音乐添加失败");
        }
      });
    },
    // 获取用户已选设备信息
    getMachine_id() {
      this.getMachine = JSON.parse(window.sessionStorage.getItem("machine"));
      this.uploadData.machine_arr = this.getMachine.machine_id.split(",");
    },
    // 上传二维码成功回调
    handleAvatarSuccess(res, file) {
      if (res.qrcode_id === undefined) {
        this.$message.error("二维码上传失败，请重新上传");
      } else {
        this.imageUrl = URL.createObjectURL(file.raw);
        this.submitcheck.qrcode_id = res.qrcode_id.join(",");
        this.$message.success("上传二维码成功！");
      }
    },
    // 上传二维码前回调
    beforeAvatarUpload(file) {
      if (this.ruleForm.account == "") {
        this.$message.error("请先选择吸粉账号类型");
        return false;
      } else {
        this.uploadData.type = this.ruleForm.account;
        let fileName = file.name;
        let regex = /(.jpg|.jpeg|.gif|.png|.bmp|.tif|.psd|.dng|.cr2|.nef)$/;
        if (regex.test(fileName.toLowerCase())) {
          const isLt2M = file.size / 1024 / 1024 < 2;
          if (!isLt2M) {
            this.$message.error("上传图片大小不能超过 2MB!");
          }
          return isLt2M;
        } else {
          this.$message.error("请选择正确格式的图片文件");
          return false;
        }
      }
    }
  }
};
</script>
<style lang="less" scoped>
// 添加第二组素材
.add {
  font-size: 0.4rem;
  color: #409eff;
  cursor: pointer;
  position: absolute;
}
// 优惠政策弹窗
.box1 {
  text-align: center;
  box-sizing: border-box;
  p {
    margin: 0 auto;
    font-size: 0.16rem;
  }
  div {
    margin: 0 auto;
    margin-top: 15px;
    display: flex;
    justify-content: space-between;
  }
  span {
    font-size: 0.14rem;
  }
  input {
    height: 0.25rem;
    text-align: center;
    outline: none;
    border: 1px solid #ccc;
  }
}
// 展示已选素材
#showbox {
  width: 100%;
  position: relative;
  #showList {
    width: 2.4rem;
    height: 1.5rem;
    overflow: hidden;
    margin: 0 auto;
    margin-bottom: 0.2rem;
    position: relative;
    #imglist {
      position: absolute;
      width: 4.8rem;
      height: 1.25rem;
    }
    .everyimg {
      position: relative;
      .delete {
        position: absolute;
        left: 35%;
        top: 101%;
        font-size: 0.1rem;
      }
    }
    .videobox {
      position: relative;
      .delvideo {
        position: absolute;
        right: 0;
        bottom: 0;
      }
    }
  }
}
</style>
